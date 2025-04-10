import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TransportCataloguePageService } from '../../../services/transport-catalogue-page-service';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AdvertisementFilterService } from '../../../dto/advertisement-filter';

@Component({
  selector: 'app-address-filter-input',
  imports: [InputTextModule, FormsModule],
  templateUrl: './address-filter-input.component.html',
  styleUrl: './address-filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFilterInputComponent {
  private readonly _pageService: TransportCataloguePageService;
  public addressInput: string = '';

  public constructor(pageService: TransportCataloguePageService) {
    this._pageService = pageService;
  }

  public get currentAddress(): string {
    return this._pageService.filter.addressFilter.address;
  }

  public handleAddressChange(event: string): void {
    const currentFilter = this._pageService.filter;
    const updated = AdvertisementFilterService.applyAddress(
      currentFilter,
      event
    );
    this._pageService.updateFilter(updated);
  }
}
