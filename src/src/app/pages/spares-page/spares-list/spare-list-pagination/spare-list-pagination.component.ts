import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { Paginator, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-spare-list-pagination',
  imports: [Paginator],
  templateUrl: './spare-list-pagination.component.html',
  styleUrl: './spare-list-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpareListPaginationComponent {
  @Output() pageChangeEvent: EventEmitter<number>;

  @Input({ required: true, alias: 'totalCount' }) set _totalCount(value: number) {
    this.totalCount.set(value);
  }

  @Input({ required: true, alias: 'pageSize' }) set _pageSize(value: number) {
    this.pageSize.set(value);
  }

  readonly totalCount: WritableSignal<number>;
  readonly pageSize: WritableSignal<number>;

  constructor() {
    this.pageChangeEvent = new EventEmitter();
    this.totalCount = signal(0);
    this.pageSize = signal(0);
  }

  public handlePageChange(state: PaginatorState): void {
    if (this.isPageZero(state)) {
      this.updatePagination(1);
      return;
    }
    this.updatePagination(state.page! + 1);
  }

  public isPageZero(state: PaginatorState): boolean {
    return !state.page;
  }

  public updatePagination(page: number): void {
    this.pageChangeEvent.emit(page);
  }
}
