import {Pagination} from '../../shared/types/Pagination';
import {Envelope} from '../../shared/types/Envelope';
import {
  Advertisement,
  AdvertisementResponse,
  CharacteristicResponse,
} from './types/advertisement';
import {Component, resource, signal, WritableSignal} from '@angular/core';
import {PageHeaderComponent} from '../../shared/components/page-header/page-header.component';
import {PanelModule} from 'primeng/panel';
import {ToolbarModule} from 'primeng/toolbar';
import {SearchBarComponent} from '../../shared/components/search-bar/search-bar.component';
import {
  AdvertisementDto,
  createEmptyAdvertisementDto,
} from './dto/advertisement-dto';
import {apiUrl} from '../../shared/api/api-endpoint';
import {HttpRequestBuilder} from '../../shared/types/Http-Request';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {TransportItemsListComponent} from './components/transport-items-list/transport-items-list.component';
import {PaginatorModule} from 'primeng/paginator';
import {
  TransportItemsFilterFormComponent
} from './components/transport-items-filter-form/transport-items-filter-form.component';
import {Sorting} from '../../shared/types/Sorting';
import {PriceCriteria} from '../../shared/types/PriceCriteria';
import {Title} from '@angular/platform-browser';
import {
  TransportItemPhotoGalleryDialogComponent
} from './components/transport-item/transport-item-photo-gallery-dialog/transport-item-photo-gallery-dialog.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-transport-catalogue-page',
  imports: [
    PageHeaderComponent,
    PanelModule,
    ToolbarModule,
    SearchBarComponent,
    CardModule,
    ButtonModule,
    TransportItemsListComponent,
    PaginatorModule,
    TransportItemsFilterFormComponent,
    TransportItemPhotoGalleryDialogComponent,
    NgIf,
  ],
  templateUrl: './transport-catalogue-page.component.html',
  styleUrl: './transport-catalogue-page.component.scss',
})
export class TransportCataloguePageComponent {
  private readonly _filterBody: WritableSignal<AdvertisementDto> = signal(
    createEmptyAdvertisementDto()
  );
  private readonly _totals: WritableSignal<number> = signal(0);
  private readonly _pagination: WritableSignal<Pagination> = signal({
    page: 1,
    pageSize: 10,
  });
  private readonly _sortMode: WritableSignal<Sorting> = signal({
    mode: 'NONE',
  });
  private readonly _priceMode: WritableSignal<PriceCriteria> = signal({
    priceValueA: null,
    priceValueB: null,
  });
  private readonly _textSearchTerm: WritableSignal<string> = signal('');

  private readonly _selectedAdvertisementForPhotoView: WritableSignal<Advertisement | null> = signal(null);

  public constructor(titleService: Title) {
    titleService.setTitle('Список спец. техники')
  }

  public get selectedAdvertisementForPhotoView(): Advertisement | null {
    return this._selectedAdvertisementForPhotoView();
  }

  public hideAdvertisementPhotoView(): void {
    this._selectedAdvertisementForPhotoView.set(null);
  }

  public readonly fetchAdvertisements = resource<
    Advertisement[],
    {
      pagination: Pagination;
      filter: AdvertisementDto;
      sorting: Sorting;
      price: PriceCriteria;
      textSearch: string
    }
  >({
    request: () => ({
      pagination: this._pagination(),
      filter: this._filterBody(),
      sorting: this._sortMode(),
      price: this._priceMode(),
      textSearch: this._textSearchTerm()
    }),
    loader: async ({request, abortSignal}) =>
      await HttpRequestBuilder.create(`${apiUrl}/advertisements`, 'POST')
        .addAbortSignal(abortSignal)
        .addBody(request.filter)
        .addParameter('sort', String(request.sorting.mode))
        .addParameter('page', String(request.pagination.page))
        .addParameter('pageSize', String(request.pagination.pageSize))
        .addParameter('priceStart', String(request.price.priceValueA))
        .addParameter('priceEnd', String(request.price.priceValueB))
        .addParameter('textSearchTerm', String(request.textSearch))
        .addHeader('Content-Type', 'application/json')
        .createFetchFunction()
        .then((resp: Response) => resp.json())
        .then((envelope: Envelope<AdvertisementResponse>) => envelope.data)
        .then((response: AdvertisementResponse) => {
          this._totals.set(response.count);
          return response.items;
        }),
  });

  public readonly fetchCharacteristics = resource<
    CharacteristicResponse[],
    unknown
  >({
    loader: async ({abortSignal}) =>
      await HttpRequestBuilder.create(`${apiUrl}/characteristics`, 'GET')
        .addHeader('Content-Type', 'application/json')
        .addAbortSignal(abortSignal)
        .createFetchFunction()
        .then((resp: Response) => resp.json())
        .then((envelope: Envelope<CharacteristicResponse[]>) => envelope.data)
        .then((ctx: CharacteristicResponse[]) => ctx),
  });

  public get totalCount(): number {
    return this._totals();
  }

  public acceptSearchText(text: string): void {
    this._textSearchTerm.set(text);
  }

  public acceptFilters(newDto: AdvertisementDto): void {
    this._filterBody.set(newDto);
  }

  public acceptPrice(price: PriceCriteria) {
    this._priceMode.set(price);
  }

  public acceptNewPagination(page: number): void {
    this._pagination.update((previous) => {
      return {pageSize: previous.pageSize, page: page};
    });
  }

  public acceptSortMode(sort: Sorting): void {
    this._sortMode.set(sort);
  }

  public acceptAdvertisementForPhotoView(advertisement: Advertisement): void {
    this._selectedAdvertisementForPhotoView.set(advertisement);
  }
}
