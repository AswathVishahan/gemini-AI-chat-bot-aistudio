import React from 'react';
import { Message, MessageRole } from '../types';
import UserIcon from './icons/UserIcon';
import BotIcon from './icons/BotIcon';

interface ChatBubbleProps {
  message: Message;
  primaryColor: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, primaryColor }) => {
  const isUser = message.role === MessageRole.USER;
  const isSystem = message.role === MessageRole.SYSTEM;
  const isThinking = message.id === 'thinking';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <span className="bg-gray-100 text-gray-500 text-xs py-1 px-3 rounded-full border border-gray-200 shadow-sm">
            {message.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} fade-in items-end`}>
      {/* Avatar */}
      <div 
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-black/5
            ${isUser ? 'bg-gray-100 text-gray-600' : 'text-white'}`}
        style={!isUser ? { 
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` 
        } : {}}
      >
        {isUser ? <UserIcon /> : <BotIcon />}
      </div>

      {/* Bubble Container */}
      <div className="flex flex-col gap-1 max-w-[85%]">
        
        {/* Image Display */}
        {message.image && (
            <div className={`rounded-xl overflow-hidden border ${isUser ? 'border-transparent' : 'border-gray-200'} mb-1`}>
                <img src={message.image} alt="content" className="max-w-full h-auto max-h-60 object-cover" />
            </div>
        )}

        {/* Text Bubble */}
        {(message.text || isThinking) && (
            <div 
                className={`relative px-4 py-3 shadow-sm text-sm leading-relaxed
                    ${isUser 
                        ? 'rounded-2xl rounded-br-none text-white' 
                        : 'bg-white border border-gray-100 rounded-2xl rounded-bl-none text-gray-800'
                    }`}
                style={isUser ? { backgroundColor: primaryColor } : {}}
            >
                {isThinking ? (
                    <div className="flex items-center gap-1 h-5">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap">{message.text}</div>
                )}
            </div>
        )}

        {/* Search Sources */}
        {message.sources && message.sources.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-2">
                {message.sources.map((source, idx) => (
                    <a 
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <span className="truncate max-w-[150px]">{source.title}</span>
                    </a>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
