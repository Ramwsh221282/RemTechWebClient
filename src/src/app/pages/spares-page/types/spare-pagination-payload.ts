export type SparePaginationPayload = {
    page: number;
    pageSize: number;
}

export class SparePaginationPayloadFactory {
    public static empty(): SparePaginationPayload {
        return { page: 1, pageSize: 10 }
    }
}