
import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageRole, WidgetPosition, SearchSource } from '../types';
import { getChatResponseStream, generateImage } from '../services/geminiService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import ChatIcon from './icons/ChatIcon';
import CloseIcon from './icons/CloseIcon';
import SendIcon from './icons/SendIcon';
import MicIcon from './icons/MicIcon';
import ImageIcon from './icons/ImageIcon';
import ChatBubble from './ChatBubble';

interface ChatWidgetProps {
  persona: string;
  activeDocumentContent: string | null;
  activeDocumentName: string | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  primaryColor: string;
  widgetPosition: WidgetPosition;
  headerText: string;
  welcomeMessage: string;
  enableVoice: boolean;
  modelType: string;
  enableSearch: boolean;
  enableImageGen: boolean;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  persona, 
  activeDocumentContent, 
  activeDocumentName,
  messages,
  setMessages,
  primaryColor,
  widgetPosition,
  headerText,
  welcomeMessage,
  enableVoice,
  modelType,
  enableSearch,
  enableImageGen
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();
  const { playAudio } = useTextToSpeech();

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming, attachedImage]);
  
  useEffect(() => {
    if (isOpen && messages.length === 0 && welcomeMessage) {
      const welcomeMsg: Message = {
        id: 'welcome-msg',
        role: MessageRole.MODEL,
        text: welcomeMessage
      };
      setMessages([welcomeMsg]);
    }
    if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, welcomeMessage, messages.length, setMessages]);


  const toggleChat = () => setIsOpen(!isOpen);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setAttachedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
      setAttachedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !attachedImage) || isStreaming) return;

    const userText = inputValue;
    const currentImage = attachedImage;
    const userMessage: Message = { 
        id: Date.now().toString(), 
        role: MessageRole.USER, 
        text: userText,
        image: currentImage || undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachedImage(null);
    setIsStreaming(true);

    // Create a placeholder message for the bot
    const botMsgId = (Date.now() + 1).toString();
    const botMessagePlaceholder: Message = { id: botMsgId, role: MessageRole.MODEL, text: '' };
    setMessages(prev => [...prev, botMessagePlaceholder]);

    try {
        // Special case: Image Generation
        if (enableImageGen && (userText.toLowerCase().startsWith('generate image') || userText.toLowerCase().startsWith('draw') || userText.toLowerCase().startsWith('create an image'))) {
            setMessages(prev => prev.map(msg => msg.id === botMsgId ? { ...msg, text: 'Generating image...' } : msg));
            const imageBase64 = await generateImage(userText);
            
            setMessages(prev => prev.map(msg => 
                msg.id === botMsgId 
                ? { ...msg, text: `Here is the image you requested: "${userText}"`, image: imageBase64 || undefined } 
                : msg
            ));
            setIsStreaming(false);
            return;
        }

        // Standard Chat / Vision / Search
        const result = await getChatResponseStream(userText, activeDocumentContent, persona, {
            modelType,
            enableSearch,
            image: currentImage
        });
        
        let fullResponse = "";
        let sources: SearchSource[] = [];

        // Iterate directly over result, not result.stream
        for await (const chunk of result) {
            // Access text as property, not function
            const chunkText = chunk.text;
            
            // Check for grounding metadata
            if (chunk.candidates && chunk.candidates[0]?.groundingMetadata?.groundingChunks) {
                const chunks = chunk.candidates[0].groundingMetadata.groundingChunks;
                chunks.forEach((c: any) => {
                    if (c.web) {
                        sources.push({ title: c.web.title, uri: c.web.uri });
                    }
                });
            }

            if (chunkText) {
                fullResponse += chunkText;
                setMessages(prev => 
                    prev.map(msg => 
                    msg.id === botMsgId ? { ...msg, text: fullResponse, sources: sources.length > 0 ? sources : undefined } : msg
                    )
                );
            }
        }

        if (enableVoice && fullResponse) {
            await playAudio(fullResponse);
        }
    } catch (error) {
      console.error('Error getting response from Gemini:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId 
        ? { ...msg, text: 'Sorry, I encountered an error processing your request.' } 
        : msg
      ));
    } finally {
      setIsStreaming(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const positionClass = widgetPosition === 'bottom-left' ? 'left-0' : 'right-0';
  const originClass = widgetPosition === 'bottom-left' ? 'origin-bottom-left' : 'origin-bottom-right';

  return (
    <>
      <div className={`fixed bottom-0 m-6 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100 hover:scale-105'} ${positionClass}`}>
        <button 
            onClick={toggleChat} 
            className="text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all focus:outline-none focus:ring-4 focus:ring-opacity-50"
            style={{ 
                backgroundColor: primaryColor,
                boxShadow: `0 10px 25px -5px ${primaryColor}80` 
            }}
            aria-label="Open chat"
        >
          <ChatIcon />
        </button>
      </div>

      <div 
        className={`fixed z-50 bottom-0 mb-6 md:mb-8 w-[calc(100%-48px)] h-[calc(100%-48px)] md:w-[420px] md:h-[650px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8 pointer-events-none'} ${positionClass} ${widgetPosition === 'bottom-left' ? 'ml-6 md:ml-8' : 'mr-6 md:mr-8'} ${originClass}`}
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      >
        <header 
          className="text-white p-5 flex justify-between items-center rounded-t-2xl shadow-sm relative overflow-hidden" 
          style={{ background: primaryColor }}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
             <h3 className="font-bold text-lg tracking-tight">{headerText}</h3>
          </div>
          <button onClick={toggleChat} className="relative z-10 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors" aria-label="Close chat">
            <CloseIcon />
          </button>
        </header>

        <main className="flex-1 p-5 overflow-y-auto bg-slate-50 scroll-smooth">
          <div className="space-y-6">
            {messages.map(msg => <ChatBubble key={msg.id} message={msg} primaryColor={primaryColor} />)}
            {isStreaming && messages[messages.length - 1]?.role !== MessageRole.MODEL && (
                 <ChatBubble message={{ id: 'thinking', role: MessageRole.MODEL, text: '...' }} primaryColor={primaryColor} />
            )}
          </div>
          <div ref={messagesEndRef} />
        </main>

        {attachedImage && (
            <div className="px-5 pt-3 bg-white border-t border-gray-100">
                <div className="relative inline-block">
                    <img src={attachedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                    <button 
                        onClick={removeAttachment}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            </div>
        )}

        <footer className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
          {activeDocumentName && (
            <div className="flex items-center gap-2 px-1 pb-3 text-xs text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.414a1 1 0 00-.293-.707l-4.414-4.414A1 1 0 0011.586 2H4zm5 2a1 1 0 011-1h.586L15 7.414V9h-6V4z" clipRule="evenodd" /></svg>
               <span className="truncate max-w-[200px]">Using: <span className="font-medium text-gray-600">{activeDocumentName}</span></span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
            <button 
                onClick={toggleListening} 
                className={`p-2.5 rounded-full transition-all duration-200 ${isListening ? 'text-red-500 bg-red-100 animate-pulse' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'}`}
                title="Voice Input"
            >
              <MicIcon />
            </button>
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-all"
                title="Upload Image"
            >
               <ImageIcon />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? 'Listening...' : (attachedImage ? "Add a caption..." : "Type a message...")}
              className="flex-1 bg-transparent px-2 py-1 focus:outline-none text-gray-800 placeholder-gray-400 text-sm"
              disabled={isStreaming}
            />
            <button 
                onClick={handleSendMessage} 
                disabled={(!inputValue.trim() && !attachedImage) || isStreaming} 
                className="p-2.5 text-white rounded-full transition-all disabled:opacity-50 disabled:scale-100 hover:scale-105 active:scale-95 shadow-sm"
                style={{ backgroundColor: primaryColor }}
            >
              <SendIcon />
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChatWidget;
