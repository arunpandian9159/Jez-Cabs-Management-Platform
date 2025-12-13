import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import {
    MapPin,
    ArrowRight,
    Clock,
    ChevronDown,
    CalendarDays,
    CalendarRange,
    CircleDot,
    Crosshair,
    Bookmark,
    History,
} from 'lucide-react';
import { Calendar as CalendarComponent } from './Calendar';
import { cn } from '@/shared/utils';
import { ROUTES } from '@/shared/constants';
import type { DateRange } from 'react-day-picker';


// Trip type options - simplified without icons for quick book
type TripType = 'oneway' | 'roundtrip' | 'rental';

interface TripTypeOption {
    id: TripType;
    label: string;
}

const tripTypeOptions: TripTypeOption[] = [
    {
        id: 'oneway',
        label: 'One Way',
    },
    {
        id: 'roundtrip',
        label: 'Round Trip',
    },
    {
        id: 'rental',
        label: 'Rental',
    },
];

// Sample addresses for dropdown
const sampleAddresses = [
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

interface LocationInputProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    label: string;
    variant: 'pickup' | 'dropoff';
}

function LocationInput({
    placeholder,
    value,
    onChange,
    label,
    variant,
}: LocationInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredAddresses = sampleAddresses.filter(
        (addr) =>
            addr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            addr.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (address: typeof sampleAddresses[0]) => {
        onChange(address.name);
        setSearchQuery('');
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {label}
            </label>
            <div
                className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-text bg-gray-50/80 border border-gray-200',
                    isOpen && 'ring-2 ring-blue-500/30 border-blue-300 bg-white'
                )}
                onClick={() => {
                    setIsOpen(true);
                    inputRef.current?.focus();
                }}
            >
                {/* Icon based on variant */}
                {variant === 'pickup' ? (
                    <CircleDot className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                )}

                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={isOpen ? searchQuery : value || ''}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="bg-transparent flex-1 outline-none text-sm font-medium placeholder:text-gray-400 text-gray-800 min-w-0"
                />

                {/* Target icon for pickup */}
                {variant === 'pickup' && (
                    <Crosshair className="w-4 h-4 text-gray-400 flex-shrink-0 hover:text-blue-500 cursor-pointer transition-colors" />
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-64 overflow-y-auto"
                    style={{
                        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.12)'
                    }}
                >
                    <div className="p-2 border-b border-gray-100">
                        <p className="text-xs font-medium text-gray-400 px-2">Popular Locations</p>
                    </div>
                    {filteredAddresses.length > 0 ? (
                        filteredAddresses.map((address) => (
                            <button
                                key={address.id}
                                type="button"
                                onClick={() => handleSelect(address)}
                                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-blue-50/50 transition-colors text-left"
                            >
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {address.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{address.address}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-6 text-center">
                            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No locations found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export function QuickBookingForm() {
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
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
            if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
                setShowTimePicker(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Check if rental type needs range calendar
    const needsRangeCalendar = tripType === 'rental' || tripType === 'roundtrip';

    const getDateDisplayText = () => {
        if (!dateRange?.from) return 'Today';
        if (!needsRangeCalendar || !dateRange.to) {
            return format(dateRange.from, 'MMM dd');
        }
        const days = differenceInDays(dateRange.to, dateRange.from) + 1;
        return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')} (${days}d)`;
    };

    const CalendarIcon = needsRangeCalendar ? CalendarRange : CalendarDays;

    // Time options
    const timeOptions = ['Now', '15 min', '30 min', '1 hour', '2 hours', 'Pick time'];

    return (
        <div
            className="max-w-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl animate-fade-in-up"
            style={{
                background: 'rgba(255, 255, 255, 0.98)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
                animationDelay: '0.4s',
                animationFillMode: 'both',
            }}
        >
            {/* Simple Header */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Where to next?
            </h2>

            <div className="space-y-5">
                {/* Trip Type Buttons */}
                <div className="flex gap-2 justify-center">
                    {tripTypeOptions.map((option) => {
                        const isSelected = tripType === option.id;
                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => setTripType(option.id)}
                                className={cn(
                                    'px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
                                    isSelected
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                )}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>

                {/* Pickup Location */}
                <LocationInput
                    placeholder="Enter pickup location"
                    value={fromLocation}
                    onChange={setFromLocation}
                    label="Pickup Location"
                    variant="pickup"
                />

                {/* Drop-off Location - Show only if not rental type */}
                {tripType !== 'rental' && (
                    <LocationInput
                        placeholder="Enter destination"
                        value={toLocation}
                        onChange={setToLocation}
                        label="Drop-off Location"
                        variant="dropoff"
                    />
                )}

                {/* Date and Time Row */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Date Picker */}
                    <div ref={calendarRef} className="relative">
                        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Date
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowCalendar(!showCalendar)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left bg-gray-50/80 border border-gray-200',
                                showCalendar && 'ring-2 ring-blue-500/30 border-blue-300 bg-white'
                            )}
                        >
                            <CalendarIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-800 flex-1 truncate">
                                {getDateDisplayText()}
                            </span>
                            <ChevronDown
                                className={cn(
                                    'w-4 h-4 text-gray-400 transition-transform',
                                    showCalendar && 'rotate-180'
                                )}
                            />
                        </button>

                        {/* Calendar Dropdown */}
                        {showCalendar && (
                            <div
                                className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-3"
                                style={{
                                    minWidth: needsRangeCalendar ? 'min(560px, 90vw)' : '280px',
                                    boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.15)'
                                }}
                            >
                                {needsRangeCalendar ? (
                                    <CalendarComponent
                                        mode="range"
                                        defaultMonth={dateRange?.from || new Date()}
                                        selected={dateRange}
                                        onSelect={(selected: DateRange | undefined) => {
                                            // Update the date range state
                                            setDateRange(selected);

                                            // Only close the calendar when both from and to are selected
                                            // Compare using getTime() to properly compare Date objects
                                            if (selected?.from && selected?.to &&
                                                selected.from.getTime() !== selected.to.getTime()) {
                                                setTimeout(() => setShowCalendar(false), 300);
                                            }
                                        }}
                                        numberOfMonths={2}
                                        disabled={{ before: new Date() }}
                                        cellSize="sm"
                                        className="rounded-lg"
                                    />
                                ) : (
                                    <CalendarComponent
                                        mode="single"
                                        defaultMonth={dateRange?.from || new Date()}
                                        selected={dateRange?.from}
                                        onSelect={(selected: Date | undefined) => {
                                            setDateRange({ from: selected, to: undefined });
                                            if (selected) {
                                                setTimeout(() => setShowCalendar(false), 200);
                                            }
                                        }}
                                        numberOfMonths={1}
                                        disabled={{ before: new Date() }}
                                        cellSize="sm"
                                        className="rounded-lg"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Time Picker */}
                    <div ref={timeRef} className="relative">
                        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Time
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowTimePicker(!showTimePicker)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left bg-gray-50/80 border border-gray-200',
                                showTimePicker && 'ring-2 ring-blue-500/30 border-blue-300 bg-white'
                            )}
                        >
                            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-800 flex-1">
                                {selectedTime}
                            </span>
                            <ChevronDown
                                className={cn(
                                    'w-4 h-4 text-gray-400 transition-transform',
                                    showTimePicker && 'rotate-180'
                                )}
                            />
                        </button>

                        {/* Time Dropdown */}
                        {showTimePicker && (
                            <div
                                className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                                style={{
                                    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.12)'
                                }}
                            >
                                {timeOptions.map((time) => (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => {
                                            setSelectedTime(time);
                                            setShowTimePicker(false);
                                        }}
                                        className={cn(
                                            'w-full px-4 py-2.5 text-left text-sm transition-colors',
                                            selectedTime === time
                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        )}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Button */}
                <Link to={ROUTES.REGISTER} className="block">
                    <button
                        className="w-full py-4 text-white rounded-xl transition-all duration-200 font-semibold text-base flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99]"
                        style={{
                            background: '#3B82F6',
                            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
                        }}
                    >
                        Search Cabs
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </Link>

                {/* Footer Links with Lucide Icons */}
                <div className="flex items-center justify-center gap-8 pt-2">
                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        <Bookmark className="w-4 h-4" />
                        <span>Saved Places</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        <History className="w-4 h-4" />
                        <span>Recent Trips</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
