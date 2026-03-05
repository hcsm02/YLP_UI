export interface Yarn {
  id: string;
  code: string;
  name: string;
  composition: string; // e.g., "100% Cotton", "60% Cotton 40% Poly"
  count: string; // e.g., "32S", "40S"
  craft: string; // e.g., "Combed", "Carded", "Open End"
  stockLevel: number; // in kg
  stockStatus: 'Normal' | 'High' | 'Low' | 'Stagnant';
  pricePerKg: number;
  tags: ('Core' | 'Critical' | 'Pressure')[];
  
  // Stats
  relatedProductCount: number;
  totalConsumption: number; // in kg
  isFlagship: boolean;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  yarnIds: string[];
  isFlagship: boolean;
}

export const MOCK_YARNS: Yarn[] = [
  {
    id: 'Y001',
    code: 'C-32S-CM',
    name: '32S Combed Cotton',
    composition: '100% Cotton',
    count: '32S',
    craft: 'Combed',
    stockLevel: 5000,
    stockStatus: 'Normal',
    pricePerKg: 28.5,
    tags: ['Core'],
    relatedProductCount: 12,
    totalConsumption: 15000,
    isFlagship: true,
  },
  {
    id: 'Y002',
    code: 'TC-40S-CD',
    name: '40S TC Blend',
    composition: '65% Poly 35% Cotton',
    count: '40S',
    craft: 'Carded',
    stockLevel: 12000,
    stockStatus: 'High',
    pricePerKg: 18.0,
    tags: ['Pressure'],
    relatedProductCount: 5,
    totalConsumption: 2000,
    isFlagship: false,
  },
  {
    id: 'Y003',
    code: 'M-60S-CM',
    name: '60S Modal',
    composition: '100% Modal',
    count: '60S',
    craft: 'Combed',
    stockLevel: 200,
    stockStatus: 'Low',
    pricePerKg: 45.0,
    tags: ['Critical'],
    relatedProductCount: 3,
    totalConsumption: 800,
    isFlagship: true,
  },
  {
    id: 'Y004',
    code: 'C-20S-OE',
    name: '20S OE Cotton',
    composition: '100% Cotton',
    count: '20S',
    craft: 'Open End',
    stockLevel: 8500,
    stockStatus: 'Stagnant',
    pricePerKg: 16.5,
    tags: ['Pressure'],
    relatedProductCount: 1,
    totalConsumption: 150,
    isFlagship: false,
  },
  {
    id: 'Y005',
    code: 'SP-40D',
    name: '40D Spandex',
    composition: '100% Spandex',
    count: '40D',
    craft: 'Filament',
    stockLevel: 1000,
    stockStatus: 'Normal',
    pricePerKg: 60.0,
    tags: ['Core', 'Critical'],
    relatedProductCount: 25,
    totalConsumption: 5000,
    isFlagship: true,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'P001', name: 'Classic T-Shirt', code: 'TS-001', yarnIds: ['Y001'], isFlagship: true },
  { id: 'P002', name: 'Stretch Leggings', code: 'LG-002', yarnIds: ['Y002', 'Y005'], isFlagship: false },
  { id: 'P003', name: 'Premium Polo', code: 'PL-003', yarnIds: ['Y003'], isFlagship: true },
];
