import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface CarListing {
  id: string;
  name: string;
  make: string;
  model: string;
  year: string;
  pricePerDay: string;
  location: string;
  image: string;
  nftId: string;
  owner: string;
  isAvailable: boolean;
  description?: string;
  images?: string[];
  metadataCid?: string;
  transactionHash?: string;
}

interface CarDataContextType {
  cars: CarListing[];
  addCar: (car: CarListing) => void;
  updateCar: (id: string, updates: Partial<CarListing>) => void;
  removeCar: (id: string) => void;
  getCarById: (id: string) => CarListing | undefined;
  getNewestCar: () => CarListing | undefined;
}

const CarDataContext = createContext<CarDataContextType | undefined>(undefined);

// Initial mock data
const initialCars: CarListing[] = [
  {
    id: '1',
    name: 'Toyota Camry 2020',
    make: 'Toyota',
    model: 'Camry',
    year: '2020',
    pricePerDay: '45',
    location: 'San Francisco, CA',
    image: 'https://api.a0.dev/assets/image?text=Toyota%20Camry&aspect=16:9',
    nftId: '#2',
    owner: '0x8f4a2c...9e3f1',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Honda Civic 2021',
    make: 'Honda',
    model: 'Civic',
    year: '2021',
    pricePerDay: '40',
    location: 'Los Angeles, CA',
    image: 'https://api.a0.dev/assets/image?text=Honda%20Civic&aspect=16:9',
    nftId: '#3',
    owner: '0x1a2b3c...7d8e9',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Tesla Model 3 2022',
    make: 'Tesla',
    model: 'Model 3',
    year: '2022',
    pricePerDay: '80',
    location: 'New York, NY',
    image: 'https://api.a0.dev/assets/image?text=Tesla%20Model%203&aspect=16:9',
    nftId: '#4',
    owner: '0x1a2b3c...7d8e9',
    isAvailable: false
  }
];

export function CarDataProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<CarListing[]>(initialCars);

  const addCar = (car: CarListing) => {
    setCars(prev => [car, ...prev]); // Add new car at the beginning
  };

  const updateCar = (id: string, updates: Partial<CarListing>) => {
    setCars(prev => prev.map(car => 
      car.id === id ? { ...car, ...updates } : car
    ));
  };

  const removeCar = (id: string) => {
    setCars(prev => prev.filter(car => car.id !== id));
  };

  const getCarById = (id: string) => {
    return cars.find(car => car.id === id);
  };

  const getNewestCar = () => {
    return cars[0]; // First car is the newest
  };

  return (
    <CarDataContext.Provider value={{
      cars,
      addCar,
      updateCar,
      removeCar,
      getCarById,
      getNewestCar
    }}>
      {children}
    </CarDataContext.Provider>
  );
}

export function useCarData() {
  const context = useContext(CarDataContext);
  if (context === undefined) {
    throw new Error('useCarData must be used within a CarDataProvider');
  }
  return context;
} 