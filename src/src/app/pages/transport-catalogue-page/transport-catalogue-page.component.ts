import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TransportCataloguePageService } from './services/transport-catalogue-page-service';
import { TransportItemsListComponent } from './components/transport-items-list/transport-items-list.component';
import { TransportItemsFilterFormComponent } from './components/transport-items-filter-form/transport-items-filter-form.component';
import { TransportItemPhotoGalleryDialogComponent } from './components/transport-item/transport-item-photo-gallery-dialog/transport-item-photo-gallery-dialog.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-transport-catalogue-page',
  imports: [
    PageHeaderComponent,
    PanelModule,
    ToolbarModule,
    SearchBarComponent,
    CardModule,
    ButtonModule,
    PaginatorModule,
    TransportItemsListComponent,
    TransportItemsFilterFormComponent,
    TransportItemPhotoGalleryDialogComponent,
    NgIf,
  ],
  templateUrl: './transport-catalogue-page.component.html',
  styleUrl: './transport-catalogue-page.component.scss',
  providers: [TransportCataloguePageService],
})
export class TransportCataloguePageComponent implements OnInit {
  public readonly cataloguePageService: TransportCataloguePageService;

  public constructor(cataloguePageService: TransportCataloguePageService) {
    this.cataloguePageService = cataloguePageService;
  }

  public ngOnInit(): void {
    this.cataloguePageService.initialize();
  }

  public acceptTextSearch(searchTerm: string): void {
    this.cataloguePageService.updateSearchTerm(searchTerm);
  }
}
