import React, { useState, useEffect } from 'react';
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
const MARKET_DATA_PROPERTIES = ["ASK", "MID", "BID", "CLOSE"];

const getRandomInstrumentCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

const validate = (data: MarketDataInput) => {
    const errors: { [key: string]: string } = {};
    if (!data.providerCode) errors.providerCode = 'Provider Code is required.';
    else if (data.providerCode.length > 15) errors.providerCode = 'Provider Code must be at most 15 characters.';
    if (!data.instrumentCode) errors.instrumentCode = 'Instrument Code is required.';
    else if (data.instrumentCode.length > 30) errors.instrumentCode = 'Instrument Code must be at most 30 characters.';
    if (!data.marketDataCategory) errors.marketDataCategory = 'Market Data Category is required.';
    else if (data.marketDataCategory.length > 15) errors.marketDataCategory = 'Market Data Category must be at most 15 characters.';
    if (!data.marketDataProperty || !MARKET_DATA_PROPERTIES.includes(data.marketDataProperty)) errors.marketDataProperty = 'Market Data Property must be one of ASK, MID, BID, CLOSE.';
    if (!data.marketDataSource) errors.marketDataSource = 'Market Data Source is required.';
    else if (data.marketDataSource.length > 15) errors.marketDataSource = 'Market Data Source must be at most 15 characters.';
    if (data.instrumentCodeDescription && data.instrumentCodeDescription.length > 1024) errors.instrumentCodeDescription = 'Instrument Code Description must be at most 1024 characters.';
    if (!data.key1) errors.key1 = 'Key 1 is required.';
    else if (data.key1.length > 20) errors.key1 = 'Key 1 must be at most 20 characters.';
    if (!data.key2) errors.key2 = 'Key 2 is required.';
    else if (data.key2.length > 20) errors.key2 = 'Key 2 must be at most 20 characters.';
    return errors;
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
    const [errorsList, setErrorsList] = useState<{ [key: string]: string }[]>([{}]);
    const [success, setSuccess] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successFade, setSuccessFade] = useState(true);

    useEffect(() => {
        if (success) {
            setShowSuccess(true);
            setSuccessFade(true);
            const fadeTimer = setTimeout(() => setSuccessFade(false), 2000); // Start fade after 2s
            const hideTimer = setTimeout(() => setShowSuccess(false), 2500); // Hide after fade
            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [success]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedList = marketDataList.map((item, i) =>
            i === index ? { ...item, [name]: value } : item
        );
        setMarketDataList(updatedList);
        // Validate on change
        const newErrors = errorsList.slice();
        newErrors[index] = validate(updatedList[index]);
        setErrorsList(newErrors);
    };

    const handleAddCard = () => {
        const newCard = PREFILL_MARKET_DATA
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
            : { ...emptyMarketData };
        setMarketDataList([...marketDataList, newCard]);
        setErrorsList([...errorsList, {}]);
    };

    const handleRemoveCard = (index: number) => {
        if (marketDataList.length === 1) return;
        setMarketDataList(marketDataList.filter((_, i) => i !== index));
        setErrorsList(errorsList.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate all cards before submit
        const allErrors = marketDataList.map(validate);
        setErrorsList(allErrors);
        if (allErrors.some(err => Object.keys(err).length > 0)) {
            setSuccess(false);
            alert('Please fix validation errors before submitting.');
            return;
        }
        try {
            await postMarketData(marketDataList); // send all cards as array
            setSuccess(true);
        } catch (error) {
            setSuccess(false);
            console.error('Error submitting market data:', error);
            alert('Failed to submit market data.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 style={{
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 28,
                margin: '24px 0 32px 0',
                letterSpacing: 1,
                color: '#1976d2',
                fontFamily: 'Segoe UI, Arial, sans-serif',
                textShadow: '0 2px 8px #e3e3e3'
            }}>
                Instrument Code Synchronization Form
            </h2>
            {showSuccess && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#e8f5e9',
                    color: '#388e3c',
                    border: '1px solid #c8e6c9',
                    borderRadius: 8,
                    padding: '12px 20px',
                    margin: '0 auto 24px auto',
                    maxWidth: 500,
                    fontWeight: 500,
                    fontSize: 18,
                    boxShadow: '0 2px 8px #e3e3e3',
                    gap: 12,
                    opacity: successFade ? 1 : 0,
                    transition: 'opacity 0.5s',
                }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#4caf50',
                        color: '#fff',
                        fontSize: 22,
                        marginRight: 8
                    }}>
                        ✓
                    </span>
                    Instrument codes are ready for synchronization
                </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
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
                        <label style={{ fontWeight: 500, marginBottom: 2 }}>Provider Code</label>
                        <input type="text" name="providerCode" value={formData.providerCode} onChange={e => handleChange(idx, e)} placeholder="Provider Code" required style={{ marginBottom: 8, borderColor: errorsList[idx]?.providerCode ? 'red' : undefined }} />
                        {errorsList[idx]?.providerCode && <span style={{ color: 'red', fontSize: 12 }}>{errorsList[idx].providerCode}</span>}
                        <label style={{ fontWeight: 500, marginBottom: 2 }}>Instrument Code</label>
                        <input type="text" name="instrumentCode" value={formData.instrumentCode} onChange={e => handleChange(idx, e)} placeholder="Instrument Code" required style={{ marginBottom: 8, borderColor: errorsList[idx]?.instrumentCode ? 'red' : undefined }} />
                        {errorsList[idx]?.instrumentCode && <span style={{ color: 'red', fontSize: 12 }}>{errorsList[idx].instrumentCode}</span>}
                        <label style={{ fontWeight: 500, marginBottom: 2 }}>Market Data Property</label>
                        <select name="marketDataProperty" value={formData.marketDataProperty} onChange={e => handleChange(idx, e)} required style={{ marginBottom: 8, borderColor: errorsList[idx]?.marketDataProperty ? 'red' : undefined }}>
                            {MARKET_DATA_PROPERTIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        {errorsList[idx]?.marketDataProperty && <span style={{ color: 'red', fontSize: 12 }}>{errorsList[idx].marketDataProperty}</span>}
                        <label style={{ fontWeight: 500, marginBottom: 2 }}>Market Data Category</label>
                        <input type="text" name="marketDataCategory" value={formData.marketDataCategory} onChange={e => handleChange(idx, e)} placeholder="Market Data Category" required style={{ marginBottom: 8, borderColor: errorsList[idx]?.marketDataCategory ? 'red' : undefined }} />
                        {errorsList[idx]?.marketDataCategory && <span style={{ color: 'red', fontSize: 12 }}>{errorsList[idx].marketDataCategory}</span>}
                        <label style={{ fontWeight: 500, marginBottom: 2 }}>Market Data Source</label>
                        <input type="text" name="marketDataSource" value={formData.marketDataSource} onChange={e => handleChange(idx, e)} placeholder="Market Data Source" required style={{ marginBottom: 8, borderColor: errorsList[idx]?.marketDataSource ? 'red' : undefined }} />
                        {errorsList[idx]?.marketDataSource && <span style={{ color: 'red', fontSize: 12 }}>{errorsList[idx].marketDataSource}</span>}
                        <label style={{ fontWeight: 500, marginBottom: 2 }}>Instrument Code Description</label>
                        <input type="text" name="instrumentCodeDescription" value={formData.instrumentCodeDescription} onChange={e => handleChange(idx, e)} placeholder="Instrument Code Description" required style={{ marginBottom: 8 }} />
                        <label style={{ fontWeight: 500, marginBottom: 2 }}>Key 1</label>
                        <input type="text" name="key1" value={formData.key1} onChange={e => handleChange(idx, e)} placeholder="Key 1" required style={{ marginBottom: 8, borderColor: errorsList[idx]?.key1 ? 'red' : undefined }} />
                        {errorsList[idx]?.key1 && <span style={{ color: 'red', fontSize: 12 }}>{errorsList[idx].key1}</span>}
                        <label style={{ fontWeight: 500, marginBottom: 2 }}>Key 2</label>
                        <input type="text" name="key2" value={formData.key2} onChange={e => handleChange(idx, e)} placeholder="Key 2" required style={{ marginBottom: 8, borderColor: errorsList[idx]?.key2 ? 'red' : undefined }} />
                        {errorsList[idx]?.key2 && <span style={{ color: 'red', fontSize: 12 }}>{errorsList[idx].key2}</span>}
                        <label style={{ fontWeight: 500, marginBottom: 2 }}>From Factor</label>
                        <input type="number" name="fromFactor" value={formData.fromFactor} onChange={e => handleChange(idx, e)} placeholder="From Factor" required style={{ marginBottom: 8 }} />
                        <label style={{ fontWeight: 500, marginBottom: 2 }}>To Factor</label>
                        <input type="number" name="toFactor" value={formData.toFactor} onChange={e => handleChange(idx, e)} placeholder="To Factor" required style={{ marginBottom: 8 }} />
                        <label style={{ fontWeight: 500, marginBottom: 2 }}>Term In Days</label>
                        <input type="text" name="termInDays" value={formData.termInDays} onChange={e => handleChange(idx, e)} placeholder="Term In Days" required style={{ marginBottom: 8 }} />
                    </div>
                ))}
                {/* Add Card Button as a green circle with + icon */}
                <button type="button" onClick={handleAddCard} aria-label="Add Card" style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#4caf50',
                    color: '#fff',
                    border: 'none',
                    fontSize: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 16,
                    marginBottom: 16,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #eee',
                }}>
                    +
                </button>
            </div>
            <button type="submit" style={{
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '12px 32px',
                fontWeight: 600,
                fontSize: 18,
                letterSpacing: 1,
                margin: '24px auto 0 auto',
                display: 'block',
                boxShadow: '0 2px 8px #e3e3e3',
                cursor: 'pointer',
                transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#125ea2')}
            onMouseOut={e => (e.currentTarget.style.background = '#1976d2')}
            >
                Save Instrument Codes
            </button>
        </form>
    );
};

export default MarketDataForm;