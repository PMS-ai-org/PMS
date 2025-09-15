import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { ToastMessage } from '../../services/toast.model';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="toast-wrapper" *ngIf="messages.length">
    <div class="toast" *ngFor="let m of messages" [class]="'toast toast-' + m.type" (mouseenter)="pause(m)" (mouseleave)="resume(m)">
      <span class="text">{{m.text}}</span>
      <button type="button" class="close" aria-label="Close" (click)="dismiss(m.id)">✕</button>
    </div>
  </div>
  `,
  styleUrls: ['./toast-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainerComponent {
  messages: ToastMessage[] = [];
  private timers = new Map<number, any>();

  constructor(private toast: ToastService, private cdr: ChangeDetectorRef) {
    this.toast.messages$.subscribe(msgs => {
      this.messages = msgs;
      this.cdr.markForCheck();
    });
  }

  dismiss(id: number) { this.toast.dismiss(id); this.clearTimer(id); }

  pause(m: ToastMessage) { this.clearTimer(m.id); }
  resume(m: ToastMessage) {
    if (m.timeout && m.timeout > 0) {
      this.clearTimer(m.id);
      const t = setTimeout(() => this.dismiss(m.id), 1500); // short resume timeout
      this.timers.set(m.id, t);
    }
  }

  private clearTimer(id: number) {
    const t = this.timers.get(id);
    if (t) { clearTimeout(t); this.timers.delete(id); }
  }
}
