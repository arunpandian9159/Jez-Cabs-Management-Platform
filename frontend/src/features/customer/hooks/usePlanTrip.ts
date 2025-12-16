import { useState } from 'react';

export interface Stop {
  id: string;
  address: string;
  duration: number;
}

export function usePlanTrip() {
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [stops, setStops] = useState<Stop[]>([
    { id: '1', address: '', duration: 0 },
  ]);

  const addStop = () =>
    setStops([
      ...stops,
      { id: Date.now().toString(), address: '', duration: 30 },
    ]);
  const removeStop = (id: string) => {
    if (stops.length > 1) setStops(stops.filter((s) => s.id !== id));
  };
  const updateStop = (id: string, field: keyof Stop, value: string | number) =>
    setStops(stops.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  const canProceed = tripName && startDate && stops.every((s) => s.address);
  const totalStopsDuration = stops.reduce((acc, s) => acc + s.duration, 0);
  const stopsWithAddress = stops.filter((s) => s.address).length;

  return {
    tripName,
    startDate,
    passengers,
    stops,
    canProceed,
    totalStopsDuration,
    stopsWithAddress,
    setTripName,
    setStartDate,
    setPassengers,
    addStop,
    removeStop,
    updateStop,
  };
}
