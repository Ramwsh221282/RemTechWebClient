export type TransportCharacteristic = {
  id: string;
  name: string;
  values: string[];
};

export class TransportCharacteristicFactory {
  public static default(): TransportCharacteristic {
    return { id: '', name: '', values: [] };
  }
}
