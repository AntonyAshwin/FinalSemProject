import React, { useState } from 'react';
import { postMarketData } from '../api/postMarketData';
import { MarketDataInput } from '../types/MarketDataInput';

const MarketDataForm: React.FC = () => {
    const [formData, setFormData] = useState<MarketDataInput>({
        providerCode: '',
        instrumentCode: '',
        marketDataProperty: '',
        marketDataCategory: '',
        marketDataSource: '',
        instrumentCodeDescription: '',
        key1: '',
        key2: '',
        fromFactor: 1,
        toFactor: 1,
        termInDays: '1',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await postMarketData(formData);
            alert('Market data submitted successfully!');
        } catch (error) {
            console.error('Error submitting market data:', error);
            alert('Failed to submit market data.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="providerCode" value={formData.providerCode} onChange={handleChange} placeholder="Provider Code" required />
            <input type="text" name="instrumentCode" value={formData.instrumentCode} onChange={handleChange} placeholder="Instrument Code" required />
            <input type="text" name="marketDataProperty" value={formData.marketDataProperty} onChange={handleChange} placeholder="Market Data Property" required />
            <input type="text" name="marketDataCategory" value={formData.marketDataCategory} onChange={handleChange} placeholder="Market Data Category" required />
            <input type="text" name="marketDataSource" value={formData.marketDataSource} onChange={handleChange} placeholder="Market Data Source" required />
            <input type="text" name="instrumentCodeDescription" value={formData.instrumentCodeDescription} onChange={handleChange} placeholder="Instrument Code Description" required />
            <input type="text" name="key1" value={formData.key1} onChange={handleChange} placeholder="Key 1" required />
            <input type="text" name="key2" value={formData.key2} onChange={handleChange} placeholder="Key 2" required />
            <input type="number" name="fromFactor" value={formData.fromFactor} onChange={handleChange} placeholder="From Factor" required />
            <input type="number" name="toFactor" value={formData.toFactor} onChange={handleChange} placeholder="To Factor" required />
            <input type="text" name="termInDays" value={formData.termInDays} onChange={handleChange} placeholder="Term In Days" required />
            <button type="submit">Submit</button>
        </form>
    );
};

export default MarketDataForm;