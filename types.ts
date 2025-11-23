export interface TextureOption {
  id: string;
  name: string;
  description: string;
  promptMod: string;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  READY = 'READY',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}