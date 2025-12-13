import { useState, useRef, useEffect, useCallback } from 'react';
import { format, differenceInDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

export type TripType = 'oneway' | 'roundtrip' | 'rental';
export interface TripTypeOption {
  id: TripType;
  label: string;
}

export const tripTypeOptions: TripTypeOption[] = [
  { id: 'oneway', label: 'One Way' },
  { id: 'roundtrip', label: 'Round Trip' },
  { id: 'rental', label: 'Rental' },
];

export const sampleAddresses = [
  {
    id: '1',
    name: 'Chennai Central Railway Station',
    address: 'Park Town, Chennai, Tamil Nadu 600003',
  },
  {
    id: '2',
    name: 'Chennai International Airport',
    address: 'GST Road, Meenambakkam, Chennai 600027',
  },
  {
    id: '3',
    name: 'T. Nagar Bus Stand',
    address: 'North Usman Road, T. Nagar, Chennai 600017',
  },
  {
    id: '4',
    name: 'Phoenix MarketCity',
    address: 'Velachery Main Road, Velachery, Chennai 600042',
  },
  {
    id: '5',
    name: 'Marina Beach',
    address: 'Kamarajar Salai, Triplicane, Chennai 600005',
  },
  {
    id: '6',
    name: 'IIT Madras',
    address: 'Sardar Patel Road, Adyar, Chennai 600036',
  },
];

export const timeOptions = [
  'Now',
  '15 min',
  '30 min',
  '1 hour',
  '2 hours',
  'Pick time',
];

export function useQuickBooking() {
  const [tripType, setTripType] = useState<TripType>('oneway');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('Now');
  const calendarRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      )
        setShowCalendar(false);
      if (timeRef.current && !timeRef.current.contains(event.target as Node))
        setShowTimePicker(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const needsRangeCalendar = tripType === 'rental' || tripType === 'roundtrip';

  const getDateDisplayText = useCallback(() => {
    if (!dateRange?.from) return 'Today';
    if (!needsRangeCalendar || !dateRange.to)
      return format(dateRange.from, 'MMM dd');
    const days = differenceInDays(dateRange.to, dateRange.from) + 1;
    return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')} (${days}d)`;
  }, [dateRange, needsRangeCalendar]);

  const handleDateSelect = useCallback((selected: DateRange | undefined) => {
    setDateRange(selected);
    if (
      selected?.from &&
      selected?.to &&
      selected.from.getTime() !== selected.to.getTime()
    ) {
      setTimeout(() => setShowCalendar(false), 300);
    }
  }, []);

  const handleSingleDateSelect = useCallback((selected: Date | undefined) => {
    setDateRange({ from: selected, to: undefined });
    if (selected) setTimeout(() => setShowCalendar(false), 200);
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
    setShowTimePicker(false);
  }, []);

  return {
    tripType,
    fromLocation,
    toLocation,
    dateRange,
    showCalendar,
    showTimePicker,
    selectedTime,
    needsRangeCalendar,
    calendarRef,
    timeRef,
    setTripType,
    setFromLocation,
    setToLocation,
    setShowCalendar,
    setShowTimePicker,
    getDateDisplayText,
    handleDateSelect,
    handleSingleDateSelect,
    handleTimeSelect,
  };
}

export function useLocationInput(onChange: (value: string) => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      )
        setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAddresses = sampleAddresses.filter(
    (addr) =>
      addr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = useCallback(
    (address: (typeof sampleAddresses)[0]) => {
      onChange(address.name);
      setSearchQuery('');
      setIsOpen(false);
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      if (!isOpen) setIsOpen(true);
    },
    [isOpen]
  );

  return {
    isOpen,
    searchQuery,
    containerRef,
    inputRef,
    filteredAddresses,
    setIsOpen,
    handleSelect,
    handleInputChange,
  };
}
