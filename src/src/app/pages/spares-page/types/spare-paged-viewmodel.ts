import { SpareViewModel } from "./spare-viewmodel"

export type SparePagedViewModel = {
    totalCount: number,
    pagesCount: number,
    spares: SpareViewModel[],
    priceMax: number;
    priceMin: number;
    priceAvg: number;
    prices: SparePriceViewModel[]
}

export type SparePriceViewModel = {
    price: number
}