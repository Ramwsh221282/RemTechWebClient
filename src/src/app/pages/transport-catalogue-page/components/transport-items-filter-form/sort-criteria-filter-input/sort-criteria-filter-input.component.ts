import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { Sorting, SortingFactory } from '../../../../../shared/types/Sorting';

@Component({
  selector: 'app-sort-criteria-filter-input',
  imports: [ChipModule, ButtonModule],
  templateUrl: './sort-criteria-filter-input.component.html',
  styleUrl: './sort-criteria-filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortCriteriaFilterInputComponent implements OnInit {
  @Output() sortChange: EventEmitter<Sorting>;
  @Input({ required: true }) sort: Sorting;
  sortSignal: WritableSignal<Sorting>;
  public sortLabel: string;
  public chipWidth: string;

  public constructor() {
    this.sort = SortingFactory.default();
    this.sortLabel = 'Сортировка по цене';
    this.chipWidth = 'auto';
    this.sortSignal = signal(SortingFactory.default());
    this.sortChange = new EventEmitter<Sorting>();
  }

  public ngOnInit(): void {
    this.sortSignal.set(this.sort);
  }

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.resizeChip();
    this.resizeSortLabel();
  }

  public resizeSortLabel(): void {
    if (window.innerWidth < 900) {
      this.sortLabel = '';
      this.chipWidth = '40px';
      return;
    }
    this.sortLabel = 'Сортировка по цене';
    this.chipWidth = 'auto';
    return;
  }

  public resizeChip() {
    if (window.innerWidth < 900) {
      this.chipWidth = '40px';
      return;
    }
    this.chipWidth = 'auto';
    return;
  }

  public setSortMode(mode: string): void {
    const currentMode = this.sortSignal().mode;
    if (currentMode === mode) return;
    this.sortSignal.update((prev: Sorting): Sorting => {
      return { ...prev, mode: mode };
    });
    this.sortChange.emit(this.sortSignal());
  }
}
