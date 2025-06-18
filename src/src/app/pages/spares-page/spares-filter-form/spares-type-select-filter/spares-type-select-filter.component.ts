import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { SpareTypeResponse } from '../../types/spare-type-response';
import { SparesHttpService } from '../../services/spares-http.service';
import { Envelope } from '../../../../shared/types/Envelope';
import { Chip } from 'primeng/chip';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Select, SelectChangeEvent } from 'primeng/select';
import { SparesTypePayload } from '../../types/spares-type-payload';


@Component({
  selector: 'app-spares-type-select-filter',
  imports: [Chip, Button, TableModule, FormsModule, Select],
  templateUrl: './spares-type-select-filter.component.html',
  styleUrl: './spares-type-select-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparesTypeSelectFilterComponent implements OnInit {
  @Output() spareTypeSelectedEvent: EventEmitter<SparesTypePayload | null>;
  readonly spareTypes: WritableSignal<string[]>;
  selectedSpareType: string | null

  constructor(private readonly _httpService: SparesHttpService) {
    this.spareTypes = signal([]);
    this.selectedSpareType = null;
    this.spareTypeSelectedEvent = new EventEmitter();
  }

  public ngOnInit(): void {
    this._httpService.fetchSpareTypes().subscribe({
      next: (envelope: Envelope<SpareTypeResponse[]>): void => {
        if (envelope.code === 200) {
          const data = envelope.data;
          this.spareTypes.set(data.map((t) => t.type))
        }
      }
    })
  }

  public chipLabel: string = 'Типы запчастей:';
  public chipWidth: string = 'auto';

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.updateChipLabel();
  }

  public updateChipLabel() {
    if (window.innerWidth < 900) {
      this.chipLabel = '';
      this.chipWidth = '40px';
      return;
    }
    this.chipLabel = 'Указать характеристику';
    this.chipWidth = 'auto';
    return;
  }

  public spareTypeSelected($event: SelectChangeEvent): void {
    const value = $event.value as string;
    const spareTypePayload: SparesTypePayload = { type: value }
    this.spareTypeSelectedEvent.emit(spareTypePayload);
  }

  public spareTypeFlushed($event: MouseEvent): void {
    $event.stopPropagation();
    this.selectedSpareType = null;
    this.spareTypeSelectedEvent.emit(null);
  }
}
