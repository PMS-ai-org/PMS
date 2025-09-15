export type ToastType = 'success' | 'error' | 'info' | 'warn';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
  timeout?: number;
}
