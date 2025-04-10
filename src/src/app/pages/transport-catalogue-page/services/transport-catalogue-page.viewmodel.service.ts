import { Injectable, signal, WritableSignal } from '@angular/core';
import { Advertisement } from '../types/advertisement';
import { TransportCharacteristic } from '../types/transport-characteristic';

@Injectable({
  providedIn: 'root',
})
export class TransportCataloguePageViewModel {
  private readonly _advertisements: WritableSignal<Advertisement[]> = signal(
    []
  );

  private readonly _characteristics: WritableSignal<TransportCharacteristic[]> =
    signal([]);

  private readonly _selectedAdvertisementForPhotoView: WritableSignal<Advertisement | null> =
    signal(null);

  public get selectedAdvertisementForPhotoView(): Advertisement | null {
    return this._selectedAdvertisementForPhotoView();
  }

  public selectAdvertisementForPhotoView(advertisement: Advertisement): void {
    this._selectedAdvertisementForPhotoView.set(advertisement);
  }

  public get advertisements(): Advertisement[] {
    return this._advertisements();
  }

  public get characteristics(): TransportCharacteristic[] {
    return this._characteristics();
  }

  public updateAdvertisements(advertisements: Advertisement[]): void {
    this._advertisements.set(advertisements);
  }

  public updateCharacteristics(
    characteristics: TransportCharacteristic[]
  ): void {
    this._characteristics.set(characteristics);
  }
}
