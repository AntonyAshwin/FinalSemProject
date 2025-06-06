export interface MarketDataInput {
    providerCode: string;
    instrumentCode: string;
    marketDataProperty: string;
    marketDataCategory: string;
    marketDataSource: string;
    instrumentCodeDescription: string;
    key1: string;
    key2: string;
    fromFactor: number;
    toFactor: number;
    termInDays: string;
}