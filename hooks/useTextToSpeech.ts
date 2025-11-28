
import { useState, useCallback } from 'react';
import { getTextToSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = useCallback(async (text: string) => {
    setIsPlaying(true);
    try {
      const base64Audio = await getTextToSpeech(text);
      if (!base64Audio) {
        throw new Error('No audio data received');
      }

      const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const decodedBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(decodedBytes, audioContext, 24000, 1);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      source.onended = () => {
        setIsPlaying(false);
        audioContext.close();
      };
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  }, []);

  return { playAudio, isPlaying };
};
