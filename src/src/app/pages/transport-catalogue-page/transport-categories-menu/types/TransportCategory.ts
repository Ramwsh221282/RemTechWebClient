export type TransportCategory = {
  id: string
  name: string
}

export class TransportCategoryFactory {
  public static default(): TransportCategory {
    return {id: '', name: ''}
  }
}
