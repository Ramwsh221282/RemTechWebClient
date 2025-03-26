import {
  AdvertisementCharacteristic,
  CharacteristicResponse,
} from './../../../types/advertisement';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogContainerComponent } from '../../../../../shared/components/dialog/dialog-container/dialog-container.component';
import { DialogContentComponent } from '../../../../../shared/components/dialog/dialog-content/dialog-content.component';
import { DialogHeaderComponent } from '../../../../../shared/components/dialog/dialog-header/dialog-header.component';
import { DialogInputComponent } from '../../../../../shared/components/dialog/dialog-input/dialog-input.component';
import { DialogFooterComponent } from '../../../../../shared/components/dialog/dialog-footer/dialog-footer.component';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transport-items-filter-characteristics-dialog',
  imports: [
    ButtonModule,
    DialogContainerComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogInputComponent,
    DialogFooterComponent,
    SelectModule,
    FormsModule,
  ],
  templateUrl: './transport-items-filter-characteristics-dialog.component.html',
  styleUrl: './transport-items-filter-characteristics-dialog.component.scss',
})
export class TransportItemsFilterCharacteristicsDialogComponent {
  private readonly _userSetupCharacteristics: WritableSignal<
    AdvertisementCharacteristic[]
  > = signal([]);
  @Input({ required: true }) characteristics: CharacteristicResponse[] = [];
  @Input({ required: true }) visibility: boolean = false;
  @Output() onClose: EventEmitter<MouseEvent> = new EventEmitter();
  public selectedCharacteristic: CharacteristicResponse | null = null;
  @Output() submittedUserCharacteristics: EventEmitter<
    AdvertisementCharacteristic[]
  > = new EventEmitter();

  public get userCharacteristics(): AdvertisementCharacteristic[] {
    return this._userSetupCharacteristics();
  }

  public closeClick($event: MouseEvent): void {
    $event.stopPropagation();
    this.onClose.emit($event);
  }

  public onSelect($event: SelectChangeEvent): void {
    const selectedCharacteristic: CharacteristicResponse =
      $event.value as CharacteristicResponse;
    const converted: AdvertisementCharacteristic = {
      name: selectedCharacteristic.name,
      value: '',
    };
    if (this.containsCharacteristicAlready(converted)) return;
    this._userSetupCharacteristics.update((current) => {
      const newArray = [converted, ...current];
      newArray.sort((a, b) => a.name.localeCompare(b.name));
      return newArray;
    });
  }

  public containsCharacteristicAlready(
    characteristic: AdvertisementCharacteristic
  ) {
    const current = this._userSetupCharacteristics();
    const index = current.findIndex((ctx) => ctx.name === characteristic.name);
    return index !== -1;
  }

  public removeCharacteristic(characteristic: AdvertisementCharacteristic) {
    const current = this._userSetupCharacteristics();
    const index = current.findIndex((ctx) => ctx.name === characteristic.name);
    if (index !== -1) current.splice(index, 1);
    this._userSetupCharacteristics.set(current);
  }

  public onClearClick($event: MouseEvent): void {
    $event.stopPropagation();
    this._userSetupCharacteristics.set([]);
    this.submittedUserCharacteristics.emit(this._userSetupCharacteristics());
  }

  public onSubmitClick($event: MouseEvent): void {
    $event.stopPropagation();
    this.submittedUserCharacteristics.emit(this._userSetupCharacteristics());
  }
}
