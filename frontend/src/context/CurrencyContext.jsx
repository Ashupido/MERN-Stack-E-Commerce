import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { formatCurrency } from '../utils/currency';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem('currency');
    return savedCurrency || 'ETB';
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const value = useMemo(() => ({
    currency,
    setCurrency,
    formatCurrency: (amount) => formatCurrency(amount, currency),
  }), [currency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }

  return context;
};
