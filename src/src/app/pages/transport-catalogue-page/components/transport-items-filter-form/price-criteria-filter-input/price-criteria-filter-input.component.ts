import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TransportCataloguePageService } from '../../../services/transport-catalogue-page-service';
import { InputNumberInputEvent, InputNumberModule } from 'primeng/inputnumber';
import { AdvertisementFilterService } from '../../../dto/advertisement-filter';

@Component({
  selector: 'app-price-criteria-filter-input',
  imports: [InputNumberModule],
  templateUrl: './price-criteria-filter-input.component.html',
  styleUrl: './price-criteria-filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceCriteriaFilterInputComponent {
  private readonly _pageService: TransportCataloguePageService;

  public constructor(pageService: TransportCataloguePageService) {
    this._pageService = pageService;
  }

  public get priceFrom(): string {
    return this._pageService.filter.priceFilter.priceFrom;
  }

  public get priceTo(): string {
    return this._pageService.filter.priceFilter.priceTo;
  }

  public handlePriceFromChange(event: InputNumberInputEvent): void {
    const value = this.getPriceValue(event);
    const currentFilter = this._pageService.filter;
    const updatedFilter = AdvertisementFilterService.applyPriceFrom(
      currentFilter,
      value as string
    );

    this._pageService.updateFilter(updatedFilter);
  }

  public handlePriceToChange(event: InputNumberInputEvent): void {
    const value = this.getPriceValue(event);
    const currentFilter = this._pageService.filter;
    const updatedFilter = AdvertisementFilterService.applyPriceTo(
      currentFilter,
      value as string
    );

    this._pageService.updateFilter(updatedFilter);
  }

  private getPriceValue(event: InputNumberInputEvent): string {
    const value = event.value ? event.value : '';
    return value as string;
  }
}
