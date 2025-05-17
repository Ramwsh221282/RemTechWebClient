import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-admin-mailing-service-yandex-instructions',
  imports: [Button, Dialog],
  templateUrl: './admin-mailing-service-yandex-instructions.component.html',
  styleUrl: './admin-mailing-service-yandex-instructions.component.scss',
})
export class AdminMailingServiceYandexInstructionsComponent {
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
