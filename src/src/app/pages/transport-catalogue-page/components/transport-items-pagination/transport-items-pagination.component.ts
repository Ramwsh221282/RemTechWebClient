import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  Pagination,
  PaginationService,
} from '../../../../shared/types/Pagination';
import { Paginator, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-transport-items-pagination',
  imports: [Paginator],
  templateUrl: './transport-items-pagination.component.html',
  styleUrl: './transport-items-pagination.component.scss',
})
export class TransportItemsPaginationComponent implements OnInit {
  @Output() onPageChanged: EventEmitter<Pagination>;
  @Input({ required: true }) pagination: Pagination;
  @Input({ required: true }) total: number;
  paginationSignal: WritableSignal<Pagination>;

  constructor() {
    this.pagination = PaginationService.initialized(1, 10);
    this.paginationSignal = signal(this.pagination);
    this.total = 0;
    this.onPageChanged = new EventEmitter();
  }

  ngOnInit(): void {
    this.paginationSignal.set(this.pagination);
  }

  handlePageChange(state: PaginatorState): void {
    if (this.isPageZero(state)) {
      this.updatePagination(1);
      return;
    }
    this.updatePagination(state.page! + 1);
  }

  isPageZero(state: PaginatorState): boolean {
    return !state.page;
  }

  updatePagination(page: number): void {
    this.paginationSignal.update((prev: Pagination): Pagination => {
      return { ...prev, page: page };
    });
    this.onPageChanged.emit(this.paginationSignal());
  }
}
