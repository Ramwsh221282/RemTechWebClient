import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { TransportItemFacadeService } from './services/transport-item-facade.service';
import { TransportItemHeaderPanelComponent } from './components/transport-item-header-panel/transport-item-header-panel.component';
import { TransportItemPhotoBlockComponent } from './components/transport-item-photo-block/transport-item-photo-block.component';
import { TransportItemDescriptionBlockComponent } from './components/transport-item-description-block/transport-item-description-block.component';
import { TransportItemCharacteristicsBlockComponent } from './components/transport-item-characteristics-block/transport-item-characteristics-block.component';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AdvertisementsHttpService } from '../transport-catalogue-page/services/advertisements-http.service';
import {
  Advertisement,
  AdvertisementsFactory,
} from '../transport-catalogue-page/types/advertisement';

@Component({
  selector: 'app-transport-item-page',
  imports: [
    TransportItemHeaderPanelComponent,
    TransportItemPhotoBlockComponent,
    TransportItemDescriptionBlockComponent,
    TransportItemCharacteristicsBlockComponent,
  ],
  templateUrl: './transport-item-page.component.html',
  styleUrl: './transport-item-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TransportItemFacadeService],
})
export class TransportItemPageComponent implements OnInit {
  private readonly _httpService: AdvertisementsHttpService;
  private readonly _titleService: Title;
  private readonly _activatedRoute: ActivatedRoute;
  advertisementSignal: WritableSignal<Advertisement>;

  public constructor(
    httpService: AdvertisementsHttpService,
    titleService: Title,
    activatedRoute: ActivatedRoute,
  ) {
    this._httpService = httpService;
    this._titleService = titleService;
    this._activatedRoute = activatedRoute;
    this.advertisementSignal = signal(AdvertisementsFactory.empty());
  }

  public ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      const categoryId = params['id'] as string;
      const brandId = params['brandid'] as string;
      const transportId = params['transportId'] as string;
      this._httpService
        .fetchAdvertisementByCategoryBrandId(categoryId, brandId, transportId)
        .subscribe((result) => {
          if (result.code === 200) {
            this._titleService.setTitle(result.data.title);
            this.advertisementSignal.set(result.data);
          }
        });
    });
  }
}
