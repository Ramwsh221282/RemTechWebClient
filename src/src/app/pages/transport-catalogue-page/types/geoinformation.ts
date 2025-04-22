export type GeoInformation = {
  id: string;
  details: string;
};

export class GeoInformationFactory {
  public static empty(): GeoInformation {
    return { id: '', details: '' };
  }
}
