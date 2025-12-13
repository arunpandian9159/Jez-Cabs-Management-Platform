import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import {
    MapPin,
    User,
    ArrowRight,
    Minus,
    Plus,
    Car,
    ArrowRightLeft,
    RefreshCw,
    Clock,
    ChevronDown,
    Sparkles,
    CalendarDays,
    CalendarRange,
} from 'lucide-react';
import { Calendar as CalendarComponent } from './Calendar';
import { cn } from '../../lib/utils';
import { ROUTES } from '../../lib/constants';
import type { DateRange } from 'react-day-picker';

// Trip type options
type TripType = 'oneway' | 'roundtrip' | 'rental' | 'trips';

interface TripTypeOption {
    id: TripType;
    label: string;
    icon: React.ElementType;
    description: string;
    gradient: string;
}

const tripTypeOptions: TripTypeOption[] = [
    {
        id: 'oneway',
        label: 'One Way',
        icon: ArrowRight,
        description: 'Single trip to destination',
        gradient: 'from-blue-500 to-blue-600',
    },
    {
        id: 'roundtrip',
        label: 'Round Trip',
        icon: RefreshCw,
        description: 'Return to starting point',
        gradient: 'from-teal-500 to-teal-600',
    },
    {
        id: 'rental',
        label: 'Rental',
        icon: Clock,
        description: 'Rent for hours or days',
        gradient: 'from-purple-500 to-purple-600',
    },
    {
        id: 'trips',
        label: 'Trips',
        icon: ArrowRightLeft,
        description: 'Multi-city journey',
        gradient: 'from-orange-500 to-orange-600',
    },
];

// Sample addresses for dropdown
const sampleAddresses = [
    {
        id: '1',
        name: 'Chennai Central Railway Station',
        address: 'Park Town, Chennai, Tamil Nadu 600003',
        icon: '🚂',
    },
    {
        id: '2',
        name: 'Chennai International Airport',
        address: 'GST Road, Meenambakkam, Chennai 600027',
        icon: '✈️',
    },
    {
        id: '3',
        name: 'T. Nagar Bus Stand',
        address: 'North Usman Road, T. Nagar, Chennai 600017',
        icon: '🚌',
    },
    {
        id: '4',
        name: 'Phoenix MarketCity',
        address: 'Velachery Main Road, Velachery, Chennai 600042',
        icon: '🛍️',
    },
    {
        id: '5',
        name: 'Marina Beach',
        address: 'Kamarajar Salai, Triplicane, Chennai 600005',
        icon: '🏖️',
    },
    {
        id: '6',
        name: 'IIT Madras',
        address: 'Sardar Patel Road, Adyar, Chennai 600036',
        icon: '🎓',
    },
    {
        id: '7',
        name: 'Apollo Hospital',
        address: 'Greams Road, Thousand Lights, Chennai 600006',
        icon: '🏥',
    },
    {
        id: '8',
        name: 'Express Avenue Mall',
        address: 'Whites Road, Royapettah, Chennai 600014',
        icon: '🏬',
    },
];

interface LocationDropdownProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    iconColor: string;
    iconGradient: string;
    label?: string;
}

function LocationDropdown({
    placeholder,
    value,
    onChange,
    iconColor,
    iconGradient,
    label,
}: LocationDropdownProps) {
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
        <div ref={containerRef} className="relative group/location">
            {label && (
                <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div
                className={cn(
                    'flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl transition-all duration-300 hover:shadow-lg cursor-text bg-gradient-to-br from-white to-gray-50/80 border border-gray-200/80',
                    isOpen && 'ring-2 ring-blue-500/50 ring-offset-2 shadow-lg border-blue-200'
                )}
                onClick={() => {
                    setIsOpen(true);
                    inputRef.current?.focus();
                }}
            >
                <div
                    className={cn(
                        'w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 bg-gradient-to-br transition-transform duration-300 group-hover/location:scale-105',
                        iconGradient
                    )}
                >
                    <MapPin className={cn('w-4 h-4 sm:w-5 sm:h-5', iconColor)} />
                </div>
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
                    className="bg-transparent flex-1 outline-none text-sm sm:text-base font-medium placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-0 border-none min-w-0 text-gray-900"
                />
                <ChevronDown
                    className={cn(
                        'w-4 h-4 text-gray-400 transition-all duration-300',
                        isOpen && 'rotate-180 text-blue-500'
                    )}
                />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50 max-h-72 overflow-y-auto animate-fade-in-up"
                    style={{
                        animationDuration: '0.2s',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)'
                    }}
                >
                    <div className="p-2 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-transparent">
                        <p className="text-xs font-medium text-gray-500 px-2">Popular Locations</p>
                    </div>
                    {filteredAddresses.length > 0 ? (
                        filteredAddresses.map((address, index) => (
                            <button
                                key={address.id}
                                type="button"
                                onClick={() => handleSelect(address)}
                                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50/50 transition-all duration-200 text-left border-b border-gray-50 last:border-0 group/item"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <span className="text-xl flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-200">{address.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate group-hover/item:text-blue-600 transition-colors">
                                        {address.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{address.address}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-sm font-medium">No locations found</p>
                            <p className="text-gray-400 text-xs mt-1">Try a different search term</p>
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
    const [passengers, setPassengers] = useState(1);
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleIncrementPassengers = () => {
        if (passengers < 8) setPassengers(passengers + 1);
    };

    const handleDecrementPassengers = () => {
        if (passengers > 1) setPassengers(passengers - 1);
    };

    // Check if rental type needs range calendar
    const needsRangeCalendar = tripType === 'rental' || tripType === 'roundtrip';

    const getDateDisplayText = () => {
        if (!dateRange?.from) return 'Select dates';
        if (!needsRangeCalendar || !dateRange.to) {
            return format(dateRange.from, 'EEE, MMM dd');
        }
        const days = differenceInDays(dateRange.to, dateRange.from) + 1;
        return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')} (${days} ${days === 1 ? 'day' : 'days'})`;
    };

    const getDateSubText = () => {
        if (!dateRange?.from) return 'Pick your travel date';
        if (!needsRangeCalendar) {
            return format(dateRange.from, 'yyyy');
        }
        if (dateRange.to) {
            return `${format(dateRange.from, 'yyyy')}`;
        }
        return 'Select end date';
    };

    const getCalendarIcon = () => {
        if (needsRangeCalendar) {
            return CalendarRange;
        }
        return CalendarDays;
    };

    const CalendarIcon = getCalendarIcon();

    return (
        <div
            className="p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl animate-fade-in-up group"
            style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(37, 99, 235, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                animationDelay: '0.4s',
                animationFillMode: 'both',
            }}
        >
            {/* Header with sparkle effect */}
            <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Quick Book</h3>
                    <p className="text-xs text-gray-500">Find your perfect ride in seconds</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Trip Type Selection - Enhanced */}
                <div className="grid grid-cols-4 gap-2 p-2 rounded-2xl bg-gradient-to-br from-gray-100/80 to-gray-50/80 border border-gray-200/50">
                    {tripTypeOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = tripType === option.id;
                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => setTripType(option.id)}
                                className={cn(
                                    'relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl transition-all duration-300 gap-1.5 group/trip overflow-hidden',
                                    isSelected
                                        ? 'bg-white shadow-lg text-blue-600 scale-[1.02]'
                                        : 'hover:bg-white/60 text-gray-600 hover:text-gray-800'
                                )}
                            >
                                {isSelected && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100/50 opacity-50" />
                                )}
                                <div
                                    className={cn(
                                        'relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300',
                                        isSelected
                                            ? `bg-gradient-to-br ${option.gradient} shadow-md`
                                            : 'bg-gray-100 group-hover/trip:bg-gray-200'
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            'w-4 h-4 sm:w-5 sm:h-5 transition-colors',
                                            isSelected ? 'text-white' : 'text-gray-500 group-hover/trip:text-gray-700'
                                        )}
                                    />
                                </div>
                                <span
                                    className={cn(
                                        'relative z-10 text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-colors',
                                        isSelected ? 'text-blue-600' : 'text-gray-600'
                                    )}
                                >
                                    {option.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Pickup Location */}
                <LocationDropdown
                    placeholder="Where from?"
                    value={fromLocation}
                    onChange={setFromLocation}
                    iconColor="text-white"
                    iconGradient="from-blue-500 to-blue-600"
                    label="Pickup Location"
                />

                {/* Drop Location - Show only if not rental type */}
                {tripType !== 'rental' && (
                    <LocationDropdown
                        placeholder="Where to?"
                        value={toLocation}
                        onChange={setToLocation}
                        iconColor="text-white"
                        iconGradient="from-teal-500 to-emerald-600"
                        label="Drop Location"
                    />
                )}

                {/* Date and Passengers Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Date Picker - Enhanced */}
                    <div ref={calendarRef} className="relative group/date">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
                            {needsRangeCalendar ? 'Travel Dates' : 'Travel Date'}
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowCalendar(!showCalendar)}
                            className={cn(
                                'flex items-center gap-3 p-3 sm:p-4 rounded-xl transition-all duration-300 hover:shadow-lg w-full text-left bg-gradient-to-br from-white to-gray-50/80 border border-gray-200/80',
                                showCalendar && 'ring-2 ring-blue-500/50 ring-offset-2 shadow-lg border-blue-200'
                            )}
                        >
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 shadow-md flex-shrink-0 transition-transform duration-300 group-hover/date:scale-105">
                                <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span
                                    className={cn(
                                        'block text-sm sm:text-base font-semibold truncate transition-colors',
                                        dateRange?.from ? 'text-gray-900' : 'text-gray-400'
                                    )}
                                >
                                    {getDateDisplayText()}
                                </span>
                                <span className="text-xs text-gray-500 truncate block">
                                    {getDateSubText()}
                                </span>
                            </div>
                            <ChevronDown
                                className={cn(
                                    'w-4 h-4 text-gray-400 transition-all duration-300 flex-shrink-0',
                                    showCalendar && 'rotate-180 text-blue-500'
                                )}
                            />
                        </button>

                        {/* Calendar Dropdown - Enhanced with shadcn styling */}
                        {showCalendar && (
                            <div
                                className="absolute top-full left-0 mt-2 z-50 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-4 animate-fade-in-up"
                                style={{
                                    minWidth: needsRangeCalendar ? 'min(600px, 95vw)' : '320px',
                                    animationDuration: '0.2s',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)'
                                }}
                            >
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-5 h-5 text-violet-600" />
                                        <span className="text-sm font-semibold text-gray-900">
                                            {needsRangeCalendar ? 'Select Date Range' : 'Select Date'}
                                        </span>
                                    </div>
                                    {dateRange?.from && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDateRange(undefined);
                                            }}
                                            className="text-xs text-gray-500 hover:text-red-500 transition-colors font-medium"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>

                                {needsRangeCalendar ? (
                                    // Range Calendar for Rental/Round Trip (shadcn style)
                                    <CalendarComponent
                                        mode="range"
                                        defaultMonth={dateRange?.from || new Date()}
                                        selected={dateRange}
                                        onSelect={(selected: DateRange | undefined) => {
                                            setDateRange(selected);
                                            if (selected?.from && selected?.to) {
                                                setTimeout(() => setShowCalendar(false), 300);
                                            }
                                        }}
                                        numberOfMonths={2}
                                        disabled={{ before: new Date() }}
                                        cellSize="lg"
                                        className="rounded-lg"
                                    />
                                ) : (
                                    // Single Date Calendar with Custom Cell Size (shadcn style)
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
                                        cellSize="lg"
                                        className="rounded-lg"
                                    />
                                )}

                                {/* Calendar Footer */}
                                {needsRangeCalendar && dateRange?.from && (
                                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <div className="text-xs text-gray-500">
                                            {dateRange.to ? (
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                    {differenceInDays(dateRange.to, dateRange.from) + 1} days selected
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                                                    Select end date
                                                </span>
                                            )}
                                        </div>
                                        {dateRange.to && (
                                            <button
                                                type="button"
                                                onClick={() => setShowCalendar(false)}
                                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                Done
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Passenger Counter - Enhanced */}
                    <div className="group/passenger">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
                            Passengers
                        </label>
                        <div
                            className="flex items-center gap-3 p-3 sm:p-4 rounded-xl transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white to-gray-50/80 border border-gray-200/80"
                        >
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600 shadow-md flex-shrink-0 transition-transform duration-300 group-hover/passenger:scale-105">
                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={handleDecrementPassengers}
                                    disabled={passengers <= 1}
                                    className={cn(
                                        'w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-200 font-medium',
                                        passengers <= 1
                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                            : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg active:scale-95'
                                    )}
                                >
                                    <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                                </button>
                                <div className="flex flex-col items-center px-4">
                                    <span className="text-xl sm:text-2xl font-bold text-gray-900 tabular-nums">
                                        {passengers}
                                    </span>
                                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium -mt-0.5">
                                        {passengers === 1 ? 'Guest' : 'Guests'}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleIncrementPassengers}
                                    disabled={passengers >= 8}
                                    className={cn(
                                        'w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-200 font-medium',
                                        passengers >= 8
                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                            : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg active:scale-95'
                                    )}
                                >
                                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Duration for Rental Type - Enhanced */}
                {tripType === 'rental' && (
                    <div className="group/duration">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
                            Rental Duration
                        </label>
                        <div
                            className="flex items-center gap-3 p-3 sm:p-4 rounded-xl transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white to-gray-50/80 border border-gray-200/80"
                        >
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 shadow-md flex-shrink-0 transition-transform duration-300 group-hover/duration:scale-105">
                                <Car className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <select
                                className="bg-transparent flex-1 outline-none text-sm sm:text-base font-semibold cursor-pointer focus:outline-none focus:ring-0 border-none min-w-0 text-gray-900 appearance-none"
                            >
                                <option value="hourly">Hourly Rental</option>
                                <option value="4hours">4 Hours Package</option>
                                <option value="8hours">8 Hours Package</option>
                                <option value="12hours">12 Hours Package</option>
                                <option value="daily">Full Day (24 Hours)</option>
                                <option value="weekly">Weekly Package</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </div>
                    </div>
                )}

                {/* Book Now Button - Enhanced */}
                <Link to={ROUTES.REGISTER} className="block mt-2">
                    <button
                        className="w-full py-4 sm:py-5 text-white rounded-xl sm:rounded-2xl transition-all duration-300 font-bold text-base sm:text-lg group/btn relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #0177c6 0%, #0055a4 100%)',
                            boxShadow: '0 8px 24px rgba(1, 119, 198, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                            e.currentTarget.style.boxShadow = '0 12px 32px rgba(1, 119, 198, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(1, 119, 198, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(0.99)';
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                        }}
                    >
                        {/* Animated background gradient */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                            style={{
                                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                            }}
                        />

                        {/* Shine effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <span className="relative z-10 flex items-center justify-center gap-2.5">
                            {tripType === 'rental' ? 'Find Rentals' : 'Book Now'}
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </span>
                    </button>
                </Link>

                {/* Trust indicators */}
                <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500">
                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>Free Cancellation</span>
                    </div>
                    <div className="w-px h-4 bg-gray-200" />
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500">
                        <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>Verified Drivers</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
