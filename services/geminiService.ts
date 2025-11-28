import { GoogleGenAI, Modality, HarmCategory, HarmBlockThreshold, Part } from '@google/genai';
import { SearchSource } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

const getSystemInstruction = (baseInstruction: string, documentContext: string | null) => {
    if (documentContext) {
        return `${baseInstruction}\n\nUse the following context to answer the user's question. If the context doesn't contain the answer, say you don't know, but still try to be helpful based on your general knowledge if permitted by your persona.\n\nContext:\n---\n${documentContext}\n---`;
    }
    return baseInstruction;
};

interface ChatOptions {
    modelType?: string;
    enableSearch?: boolean;
    image?: string | null; // base64
}

// Image Generation
export const generateImage = async (prompt: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            },
        });
        
        // Iterate parts to find inlineData (image)
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
}

// Streaming Response
export const getChatResponseStream = async (
    userMessage: string, 
    documentContext: string | null, 
    systemInstruction: string,
    options: ChatOptions = {}
) => {
  try {
    const finalSystemInstruction = getSystemInstruction(systemInstruction, documentContext);
    
    // Select Model
    let modelName = 'gemini-2.5-flash';
    if (options.modelType === 'lite') {
        modelName = 'gemini-flash-lite-latest';
    }

    const tools: any[] = [];
    if (options.enableSearch) {
        tools.push({ googleSearch: {} });
    }

    // Construct Parts
    const parts: Part[] = [{ text: userMessage }];
    if (options.image) {
        // Remove data URL prefix if present for the API call
        const base64Data = options.image.split(',')[1] || options.image;
        parts.unshift({
            inlineData: {
                mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect from string
                data: base64Data
            }
        });
    }

    return await ai.models.generateContentStream({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction: finalSystemInstruction,
        safetySettings,
        tools: tools.length > 0 ? tools : undefined,
      },
    });
  } catch (error) {
    console.error("Error in getChatResponseStream:", error);
    throw error;
  }
};

export const getTextToSpeech = async (text: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Error in getTextToSpeech:", error);
    return null;
  }
};