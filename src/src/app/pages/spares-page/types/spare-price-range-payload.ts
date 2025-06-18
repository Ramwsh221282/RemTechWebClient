export type SparePriceRangePayload = {
    From?: PriceFromPayload | null
    To?: PriceToPayload | null
}

export type PriceFromPayload = {
    from: number;
}

export type PriceToPayload = {
    to: number;
}