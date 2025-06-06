import React, { useState } from 'react';
import { postMarketData } from '../api/postMarketData';
import { MarketDataInput } from '../types/MarketDataInput';

const emptyMarketData: MarketDataInput = {
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
};

const PREFILL_MARKET_DATA = process.env.REACT_APP_PREFILL_MARKET_DATA === 'true';

const getRandomInstrumentCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

const MarketDataForm: React.FC = () => {
    const [marketDataList, setMarketDataList] = useState<MarketDataInput[]>([
        PREFILL_MARKET_DATA
            ? {
                providerCode: 'SAPTHR',
                instrumentCode: getRandomInstrumentCode(),
                marketDataProperty: 'CLOSE',
                marketDataCategory: '01',
                marketDataSource: 'ST',
                instrumentCodeDescription: 'Test Rics',
                key1: 'INR',
                key2: 'PJK',
                fromFactor: 1,
                toFactor: 1,
                termInDays: '1',
            }
            : { ...emptyMarketData }
    ]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedList = marketDataList.map((item, i) =>
            i === index ? { ...item, [name]: value } : item
        );
        setMarketDataList(updatedList);
    };

    const handleAddCard = () => {
        setMarketDataList([
            ...marketDataList,
            PREFILL_MARKET_DATA
                ? {
                    providerCode: 'SAPTHR',
                    instrumentCode: getRandomInstrumentCode(),
                    marketDataProperty: 'CLOSE',
                    marketDataCategory: '01',
                    marketDataSource: 'ST',
                    instrumentCodeDescription: 'Test Rics',
                    key1: 'INR',
                    key2: 'PJK',
                    fromFactor: 1,
                    toFactor: 1,
                    termInDays: '1',
                }
                : { ...emptyMarketData }
        ]);
    };

    const handleRemoveCard = (index: number) => {
        if (marketDataList.length === 1) return;
        setMarketDataList(marketDataList.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await postMarketData(marketDataList); // send all cards as array
            alert('Market data submitted successfully!');
        } catch (error) {
            console.error('Error submitting market data:', error);
            alert('Failed to submit market data.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                {marketDataList.map((formData, idx) => (
                    <div key={idx} style={{
                        border: '1px solid #ccc',
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 16,
                        boxShadow: '0 2px 8px #eee',
                        position: 'relative',
                        minWidth: 320,
                        maxWidth: 340,
                        flex: '1 1 340px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                    }}>
                        <button type="button" onClick={() => handleRemoveCard(idx)} style={{ position: 'absolute', top: 8, right: 8, background: '#f44336', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' }} disabled={marketDataList.length === 1}>×</button>
                        <input type="text" name="providerCode" value={formData.providerCode} onChange={e => handleChange(idx, e)} placeholder="Provider Code" required style={{ marginBottom: 8 }} />
                        <input type="text" name="instrumentCode" value={formData.instrumentCode} onChange={e => handleChange(idx, e)} placeholder="Instrument Code" required style={{ marginBottom: 8 }} />
                        <input type="text" name="marketDataProperty" value={formData.marketDataProperty} onChange={e => handleChange(idx, e)} placeholder="Market Data Property" required style={{ marginBottom: 8 }} />
                        <input type="text" name="marketDataCategory" value={formData.marketDataCategory} onChange={e => handleChange(idx, e)} placeholder="Market Data Category" required style={{ marginBottom: 8 }} />
                        <input type="text" name="marketDataSource" value={formData.marketDataSource} onChange={e => handleChange(idx, e)} placeholder="Market Data Source" required style={{ marginBottom: 8 }} />
                        <input type="text" name="instrumentCodeDescription" value={formData.instrumentCodeDescription} onChange={e => handleChange(idx, e)} placeholder="Instrument Code Description" required style={{ marginBottom: 8 }} />
                        <input type="text" name="key1" value={formData.key1} onChange={e => handleChange(idx, e)} placeholder="Key 1" required style={{ marginBottom: 8 }} />
                        <input type="text" name="key2" value={formData.key2} onChange={e => handleChange(idx, e)} placeholder="Key 2" required style={{ marginBottom: 8 }} />
                        <input type="number" name="fromFactor" value={formData.fromFactor} onChange={e => handleChange(idx, e)} placeholder="From Factor" required style={{ marginBottom: 8 }} />
                        <input type="number" name="toFactor" value={formData.toFactor} onChange={e => handleChange(idx, e)} placeholder="To Factor" required style={{ marginBottom: 8 }} />
                        <input type="text" name="termInDays" value={formData.termInDays} onChange={e => handleChange(idx, e)} placeholder="Term In Days" required style={{ marginBottom: 8 }} />
                    </div>
                ))}
            </div>
            <button type="button" onClick={handleAddCard} style={{ margin: '16px 0', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Add Card</button>
            <button type="submit">Submit</button>
        </form>
    );
};

export default MarketDataForm;