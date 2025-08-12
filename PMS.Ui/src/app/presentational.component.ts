import { Component, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Input, Output } from '@angular/core';

@Component({
  selector: 'pms-presentational',
  template: `<button (click)='onClick()'>{{ label }}</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'presentational' }
})
export class PresentationalComponent {
  @Input() readonly label: string | null = null;
  @Output() readonly clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
