import { useState } from 'react';
import { PropertyDetails } from '../../types';
import { defaultPropertyDetails } from '../../config/defaults';
import { getStoredState } from '../useFormPersistence';

export function usePropertyState() {
  const storedState = getStoredState();
  
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>(
    storedState?.propertyDetails || defaultPropertyDetails
  );

  return {
    propertyDetails,
    setPropertyDetails,
  };
}
