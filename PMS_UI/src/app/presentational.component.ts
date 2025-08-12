import { Component, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Input, Output } from '@angular/core';

@Component({
  selector: 'pms-presentational',
  template: `<button (click)='onClick()'>{{ label }}</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'presentational' }
})
export class PresentationalComponent {
  readonly label = Input<string | null>();
  readonly clicked = Output<EventEmitter<void>>();

  onClick() {
    this.clicked.emit();
  }
}
