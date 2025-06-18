export type SpareViewModel = {
    id: string;
    title: string;
    price: number;
    serviceName: string;
    sourceUrl: string;
    oem: string;
    type: string;
    photos: string[]
}

export class SpareViewModelFactory {
    public static empty(): SpareViewModel {
        return {
            id: '',
            oem: '',
            photos: [],
            price: 0,
            serviceName: '',
            sourceUrl: '',
            title: '',
            type: ''
        }
    }
}