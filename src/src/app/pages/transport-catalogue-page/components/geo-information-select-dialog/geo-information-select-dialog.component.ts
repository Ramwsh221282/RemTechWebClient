import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeoInformation } from '../../types/geoinformation';
import { DialogContainerComponent } from '../../../../shared/components/dialog/dialog-container/dialog-container.component';
import { DialogContentComponent } from '../../../../shared/components/dialog/dialog-content/dialog-content.component';
import { DialogHeaderComponent } from '../../../../shared/components/dialog/dialog-header/dialog-header.component';
import { Select, SelectChangeEvent } from 'primeng/select';
import { DialogFooterComponent } from '../../../../shared/components/dialog/dialog-footer/dialog-footer.component';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-geo-information-select-dialog',
  imports: [
    DialogContainerComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    Select,
    DialogFooterComponent,
    Button,
  ],
  templateUrl: './geo-information-select-dialog.component.html',
  styleUrl: './geo-information-select-dialog.component.scss',
})
export class GeoInformationSelectDialogComponent {
  @Output() visibilityChanged: EventEmitter<boolean>;
  @Output() onCitySelected: EventEmitter<GeoInformation>;
  @Input({ required: true }) geoInformations: GeoInformation[];
  @Input() visibility: boolean;

  constructor() {
    this.geoInformations = [];
    this.visibility = false;
    this.visibilityChanged = new EventEmitter<boolean>();
    this.onCitySelected = new EventEmitter<GeoInformation>();
  }

  public citySelected($event: SelectChangeEvent): void {
    const city: GeoInformation = $event.value as GeoInformation;
    this.onCitySelected.emit(city);
    this.visibilityChanged.emit(false);
  }

  public selectAnyCity($event: MouseEvent): void {
    $event.stopPropagation();
    const city: GeoInformation = { id: '', details: 'Любой' };
    this.onCitySelected.emit(city);
    this.visibilityChanged.emit(false);
  }
}
