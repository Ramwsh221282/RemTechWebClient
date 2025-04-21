import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sort-criteria-filter-input',
  imports: [ChipModule, ButtonModule],
  templateUrl: './sort-criteria-filter-input.component.html',
  styleUrl: './sort-criteria-filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortCriteriaFilterInputComponent {
  public sortLabel: string = 'Сортировка по цене';
  public chipWidth: string = 'auto';

  public constructor() {}

  public get sortMode(): string {
    return '';
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
    (this.sortLabel = 'Сортировка по цене'), (this.chipWidth = 'auto');
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

  public setSortMode(mode: string): void {}
}
