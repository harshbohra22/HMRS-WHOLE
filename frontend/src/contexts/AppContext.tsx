import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { citiesApi, jobPositionsApi } from '../services/api';
import type { City, JobPosition } from '../types';

interface AppContextType {
  cities: City[];
  jobPositions: JobPosition[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [citiesResult, positionsResult] = await Promise.all([
        citiesApi.getAll(),
        jobPositionsApi.getAll(),
      ]);

      // Handle backend typo: "succes" instead of "success"
      if (citiesResult.success || citiesResult.succes) {
        setCities(citiesResult.data);
      }
      if (positionsResult.success || positionsResult.succes) {
        setJobPositions(positionsResult.data);
      }
    } catch (error) {
      console.error('Error loading app data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider value={{ cities, jobPositions, loading, refreshData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

