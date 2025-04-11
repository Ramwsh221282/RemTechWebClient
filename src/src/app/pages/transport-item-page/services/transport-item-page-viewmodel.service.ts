import { Injectable, signal, WritableSignal } from '@angular/core';
import { TransportItem, TransportItemFactory } from '../types/transport-item';

@Injectable({
  providedIn: 'any',
})
export class TransportItemPageViewModel {
  private readonly _item: WritableSignal<TransportItem> = signal(
    TransportItemFactory.empty()
  );

  public initialize(item: TransportItem): void {
    this._item.set(item);
  }

  public get item(): TransportItem {
    return this._item();
  }
}
