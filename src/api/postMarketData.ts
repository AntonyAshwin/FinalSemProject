import axios from 'axios';
import { MarketDataInput } from '../types/MarketDataInput';

const API_URL = '/instrumentCode';
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN || '';

export const postMarketData = async (data: MarketDataInput) => {
    try {
        // Send data as an array
        const response = await axios.post(API_URL, [data], {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error posting market data: ${error}`);
    }
};