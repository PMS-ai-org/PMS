import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastMessage, ToastType } from './toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();
  private idCounter = 1;
  private defaultTimeout = 5000;

  private push(text: string, type: ToastType, timeout?: number) {
    const id = this.idCounter++;
    const message: ToastMessage = { id, text, type, timeout: timeout ?? this.defaultTimeout };
    const current = this.messagesSubject.getValue();
    this.messagesSubject.next([...current, message]);
    if (message.timeout && message.timeout > 0) {
      setTimeout(() => this.dismiss(id), message.timeout);
    }
  }

  dismiss(id: number) {
    const filtered = this.messagesSubject.getValue().filter(m => m.id !== id);
    this.messagesSubject.next(filtered);
  }

  clearAll() { this.messagesSubject.next([]); }

  success(text: string, timeout?: number) { this.push(text, 'success', timeout); }
  error(text: string, timeout?: number) { this.push(text, 'error', timeout); }
  info(text: string, timeout?: number) { this.push(text, 'info', timeout); }
  warn(text: string, timeout?: number) { this.push(text, 'warn', timeout); }
}
