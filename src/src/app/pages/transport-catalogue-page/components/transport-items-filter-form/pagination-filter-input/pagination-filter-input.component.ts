import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TransportCataloguePageService } from '../../../services/transport-catalogue-page-service';
import { PaginationService } from '../../../../../shared/types/Pagination';

@Component({
  selector: 'app-pagination-filter-input',
  imports: [PaginatorModule],
  templateUrl: './pagination-filter-input.component.html',
  styleUrl: './pagination-filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationFilterInputComponent {
  private readonly _pageService: TransportCataloguePageService;

  public constructor(pageService: TransportCataloguePageService) {
    this._pageService = pageService;
  }

  public get totalCount(): number {
    return this._pageService.totalCount;
  }

  public handlePageChange(event: PaginatorState): void {
    const page = this.resolvePageNumber(event);
    const pagination = this._pageService.pagination;
    const updated = PaginationService.updatePage(pagination, page);
    this._pageService.updatePagination(updated);
  }

  private resolvePageNumber(event: PaginatorState): number {
    if (event.page) return event.page + 1;
    return 1;
  }
}
