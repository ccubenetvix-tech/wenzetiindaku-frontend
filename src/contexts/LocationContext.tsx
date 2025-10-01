import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Location interface
export interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

// Location context interface
interface LocationContextType {
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  availableLocations: Location[];
  isLoading: boolean;
}

// Create the context
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Predefined locations - 10 major African cities
const defaultLocations: Location[] = [
  {
    id: '1',
    name: 'Lagos, Nigeria',
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
    postalCode: '100001'
  },
  {
    id: '2',
    name: 'Nairobi, Kenya',
    city: 'Nairobi',
    state: 'Nairobi County',
    country: 'Kenya',
    postalCode: '00100'
  },
  {
    id: '3',
    name: 'Cape Town, South Africa',
    city: 'Cape Town',
    state: 'Western Cape',
    country: 'South Africa',
    postalCode: '8001'
  },
  {
    id: '4',
    name: 'Accra, Ghana',
    city: 'Accra',
    state: 'Greater Accra',
    country: 'Ghana',
    postalCode: 'GA-100-0000'
  },
  {
    id: '5',
    name: 'Kigali, Rwanda',
    city: 'Kigali',
    state: 'Kigali',
    country: 'Rwanda',
    postalCode: '00000'
  },
  {
    id: '6',
    name: 'Addis Ababa, Ethiopia',
    city: 'Addis Ababa',
    state: 'Addis Ababa',
    country: 'Ethiopia',
    postalCode: '1000'
  },
  {
    id: '7',
    name: 'Cairo, Egypt',
    city: 'Cairo',
    state: 'Cairo Governorate',
    country: 'Egypt',
    postalCode: '11511'
  },
  {
    id: '8',
    name: 'Casablanca, Morocco',
    city: 'Casablanca',
    state: 'Casablanca-Settat',
    country: 'Morocco',
    postalCode: '20000'
  },
  {
    id: '9',
    name: 'Tunis, Tunisia',
    city: 'Tunis',
    state: 'Tunis Governorate',
    country: 'Tunisia',
    postalCode: '1000'
  },
  {
    id: '10',
    name: 'Dakar, Senegal',
    city: 'Dakar',
    state: 'Dakar Region',
    country: 'Senegal',
    postalCode: '10000'
  }
];

// Location provider component
interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [availableLocations] = useState<Location[]>(defaultLocations);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setSelectedLocation(location);
      } catch (error) {
        console.error('Error parsing saved location:', error);
        localStorage.removeItem('selectedLocation');
      }
    } else {
      // Set default location if none is saved
      setSelectedLocation(defaultLocations[0]);
    }
  }, []);

  // Save location to localStorage when it changes
  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
    }
  }, [selectedLocation]);

  const value: LocationContextType = {
    selectedLocation,
    setSelectedLocation,
    availableLocations,
    isLoading
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use the location context
export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

