import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TransportCataloguePageService } from '../../../services/transport-catalogue-page-service';
import { CharacteristicFilterOption } from '../../../dto/advertisement-filter';

@Component({
  selector: 'app-characteristics-filter-input',
  imports: [TableModule],
  templateUrl: './characteristics-filter-input.component.html',
  styleUrl: './characteristics-filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacteristicsFilterInputComponent {
  private readonly _pageService: TransportCataloguePageService;

  public constructor(pageService: TransportCataloguePageService) {
    this._pageService = pageService;
  }

  public get userCharacteristics(): CharacteristicFilterOption[] {
    return this._pageService.filter.characteristicsFilter.characteristics;
  }
}
