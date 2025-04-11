import { Injectable } from '@angular/core';
import { TransportItemPageViewModel } from './transport-item-page-viewmodel.service';
import { TransportItemHttpService } from './transport-item-http.service';
import { TransportItem } from '../types/transport-item';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'any',
})
export class TransportItemFacadeService {
  private readonly _viewModel: TransportItemPageViewModel;
  private readonly _http: TransportItemHttpService;

  public constructor(
    viewModel: TransportItemPageViewModel,
    http: TransportItemHttpService
  ) {
    this._viewModel = viewModel;
    this._http = http;
  }

  public initialize(id: number, title: Title) {
    this._http.getTransportItemById(id).subscribe((resp) => {
      if (resp.code == 404) return;
      const data = resp.data;
      this._viewModel.initialize(data);
      title.setTitle(data.title);
    });
  }

  public get transport(): TransportItem {
    return this._viewModel.item;
  }
}
