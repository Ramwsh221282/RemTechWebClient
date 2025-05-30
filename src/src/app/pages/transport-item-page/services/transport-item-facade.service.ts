import { Injectable } from '@angular/core';
import { TransportItemPageViewModel } from './transport-item-page-viewmodel.service';
import { TransportItemHttpService } from './transport-item-http.service';
import {
  TransportItem,
  TransportItemCharacteristic,
  TransportItemPhoto,
} from '../types/transport-item';
import { Title } from '@angular/platform-browser';
import { Envelope } from '../../../shared/types/Envelope';
import {
  AdvertisementsViewModelResponseConverter,
  AdvertisementViewModelResponse,
} from '../../transport-catalogue-page/types/AdvertisementsPageViewModelResponse';

@Injectable({
  providedIn: 'any',
})
export class TransportItemFacadeService {
  private readonly _viewModel: TransportItemPageViewModel;
  private readonly _http: TransportItemHttpService;

  public constructor(
    viewModel: TransportItemPageViewModel,
    http: TransportItemHttpService,
  ) {
    this._viewModel = viewModel;
    this._http = http;
  }

  public initialize(id: number, title: Title) {
    this._http
      .getTransportItemById(id)
      .subscribe((resp: Envelope<AdvertisementViewModelResponse>) => {
        if (resp.code == 404) return;
        const data = resp.data;
        const advertisementAttributes = data.advertisement;
        const characteristics = data.characteristics;
        const geoInformation = data.geoInformation;
        const transportItem: TransportItem = {
          id: Number(advertisementAttributes.id),
          address: geoInformation.details,
          characteristics: characteristics.map(
            (item): TransportItemCharacteristic => {
              return { name: item.name, value: item.value };
            },
          ),
          photos: advertisementAttributes.photos.map(
            (item): TransportItemPhoto => {
              return { sourceUrl: item };
            },
          ),
          priceExtra: advertisementAttributes.priceExtra,
          title: advertisementAttributes.title,
          priceValue: advertisementAttributes.priceValue,
          description: advertisementAttributes.description,
          sourceUrl: advertisementAttributes.sourceUrl,
          publishedBy: '',
          scraperName: advertisementAttributes.sourceName,
        };
        this._viewModel.initialize(transportItem);
        title.setTitle(transportItem.title);
      });
  }

  public get transport(): TransportItem {
    return this._viewModel.item;
  }
}
