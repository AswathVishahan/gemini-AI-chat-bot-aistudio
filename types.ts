
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system',
}

export interface SearchSource {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  image?: string; // base64 or url
  sources?: SearchSource[];
}

export interface Document {
  name: string;
  content: string;
}

export type WidgetPosition = 'bottom-right' | 'bottom-left';