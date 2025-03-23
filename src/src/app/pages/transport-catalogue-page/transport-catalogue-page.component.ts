import { Pagination } from './../../shared/types/Pagination';
import { Envelope } from './../../shared/types/Envelope';
import {
  Advertisement,
  AdvertisementCharacteristic,
} from './types/advertisement';
import { Component, resource, signal, WritableSignal } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { createEmptyAdvertisementDto } from './dto/advertisement-dto';
import { apiUrl } from '../../shared/api/api-endpoint';
import { HttpRequestBuilder } from '../../shared/types/Http-Request';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TransportItemsListComponent } from './components/transport-items-list/transport-items-list.component';
import { PaginatorModule } from 'primeng/paginator';
import { TransportItemsFilterFormComponent } from './components/transport-items-filter-form/transport-items-filter-form.component';

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
  ],
  templateUrl: './transport-catalogue-page.component.html',
  styleUrl: './transport-catalogue-page.component.scss',
})
export class TransportCataloguePageComponent {
  private readonly _pagination: WritableSignal<Pagination> = signal({
    page: 1,
    pageSize: 10,
  });

  public readonly fetchAdvertisements = resource<Advertisement[], Pagination>({
    request: () => this._pagination(),
    loader: async ({ request, abortSignal }) =>
      await HttpRequestBuilder.create(`${apiUrl}/advertisements`, 'POST')
        .addAbortSignal(abortSignal)
        .addBody(createEmptyAdvertisementDto())
        .addParameter('page', String(request.page))
        .addParameter('pageSize', String(request.pageSize))
        .addHeader('Content-Type', 'application/json')
        .createFetchFunction()
        .then((resp: Response) => resp.json())
        .then((envelope: Envelope<Advertisement[]>) => envelope.data),
  });

  public acceptSearchText(text: string): void {
    console.log(text);
  }

  public acceptNewPagination(pagination: Pagination): void {
    this._pagination.update((previous) => {
      return { ...pagination };
    });
  }

  public identifyCharacteristic(
    index: number,
    characteristic: AdvertisementCharacteristic
  ): string {
    return characteristic.name;
  }
}
