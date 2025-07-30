import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { VehicleKind } from '../../data/types/vehiclekind';
import { VehicleKindSource } from '../../data/sources/vehiclekindssource';
import { ApiVehicleKindSource } from '../../data/sources/apivehiclekindsource';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Panel } from 'primeng/panel';
import { DataView } from 'primeng/dataview';
import { NgForOf } from '@angular/common';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { ScrollPanel } from 'primeng/scrollpanel';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-vehicle-kinds-select-page-panel',
  imports: [Panel, DataView, NgForOf, Tag, Button, ScrollPanel],
  templateUrl: './vehicle-kinds-select-page-panel.component.html',
  styleUrl: './vehicle-kinds-select-page-panel.component.scss',
})
export class VehicleKindsSelectPagePanelComponent implements OnInit {
  @Output() kindSelected: EventEmitter<VehicleKind> =
    new EventEmitter<VehicleKind>();
  private readonly _kinds: WritableSignal<VehicleKind[]>;
  private readonly _kindsLoading: WritableSignal<boolean>;
  private readonly _kindsSource: VehicleKindSource;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  constructor(kindsSource: ApiVehicleKindSource) {
    this._kinds = signal<VehicleKind[]>([]);
    this._kindsLoading = signal<boolean>(false);
    this._kindsSource = kindsSource;
  }

  ngOnInit(): void {
    this.fetchKinds();
  }

  private fetchKinds(): void {
    this._kindsLoading.set(true);
    this._kindsSource
      .retrieve()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        finalize(() => {
          this._kindsLoading.set(false);
        }),
      )
      .subscribe({
        next: (data: VehicleKind[]) => this._kinds.set(data),
        error: (_: HttpErrorResponse): void => this._kinds.set([]),
      });
  }

  public get kinds(): VehicleKind[] {
    return this._kinds();
  }

  public selectKind(kind: VehicleKind): void {
    this.kindSelected.emit(kind);
  }
}
