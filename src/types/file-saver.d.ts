// src/types/file-saver.d.ts
declare module 'file-saver' {
    export function saveAs(data: Blob | string, filename?: string, options?: any): void;
    export function saveTextAs(data: string, filename: string): void;
  }
  