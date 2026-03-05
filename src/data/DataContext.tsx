import React, { createContext, useContext, useState, useMemo } from 'react';
import { Yarn, Product, MOCK_YARNS, MOCK_PRODUCTS } from './mock';

interface DataContextType {
  yarns: Yarn[];
  products: Product[];
  searchYarns: (query: string) => Yarn[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [yarns] = useState<Yarn[]>(MOCK_YARNS);
  const [products] = useState<Product[]>(MOCK_PRODUCTS);

  const searchYarns = (query: string) => {
    const lower = query.toLowerCase();
    return yarns.filter(y => 
      y.name.toLowerCase().includes(lower) || 
      y.code.toLowerCase().includes(lower) ||
      y.composition.toLowerCase().includes(lower)
    );
  };

  const value = useMemo(() => ({ yarns, products, searchYarns }), [yarns, products]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
