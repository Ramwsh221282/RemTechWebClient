import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-admin-mailing-service-google-instructions',
  imports: [Dialog, Button],
  templateUrl: './admin-mailing-service-google-instructions.component.html',
  styleUrl: './admin-mailing-service-google-instructions.component.scss',
})
export class AdminMailingServiceGoogleInstructionsComponent {
  @Output() closed: EventEmitter<void>;

  @Input({ required: true, alias: 'isVisible' }) set _isVisible(
    value: boolean,
  ) {
    this.visibilitySignal.set(value);
  }

  readonly visibilitySignal: WritableSignal<boolean>;

  constructor() {
    this.visibilitySignal = signal(true);
    this.closed = new EventEmitter<void>();
  }

  public close(): void {
    this.visibilitySignal.set(false);
    this.closed.emit();
  }

  public linkClick(link: string): void {
    window.open(link);
  }
}
