import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import L from 'leaflet';
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
  CheckCircle,
  Car,
} from 'lucide-react';
import { Calendar as CalendarComponent } from '../../booking/components/QuickBookingForm/Calendar';
import { cn } from '@/shared/utils';
import { ROUTES, MAP_CONFIG } from '@/shared/constants';
import {
  useQuickBooking,
  tripTypeOptions,
  timeOptions,
} from '../../booking/hooks/useQuickBooking';
import type { DateRange } from 'react-day-picker';

// Fix for default marker icon in Leaflet with React
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const pickupIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Popular locations for dropdown
const popularLocations = [
  { id: '1', name: 'Bangalore Airport', address: 'Kempegowda International Airport' },
  { id: '2', name: 'MG Road', address: 'MG Road Metro Station, Bangalore' },
  { id: '3', name: 'Koramangala', address: 'Koramangala 4th Block, Bangalore' },
  { id: '4', name: 'Whitefield', address: 'Whitefield, Bangalore' },
  { id: '5', name: 'Electronic City', address: 'Electronic City Phase 1, Bangalore' },
];

interface LocationState {
  address: string;
  lat: number | null;
  lng: number | null;
}

// Map click handler component
function MapClickHandler({
  onLocationSelect,
  activeField,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  activeField: 'pickup' | 'destination' | null;
}) {
  useMapEvents({
    click(e) {
      if (activeField) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Location Input Component matching QuickBookingForm style
interface LocationInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string, lat?: number, lng?: number) => void;
  label: string;
  variant: 'pickup' | 'dropoff';
  isActive: boolean;
  onFocus: () => void;
}

function LocationInput({
  placeholder,
  value,
  onChange,
  label,
  variant,
  isActive,
  onFocus,
}: LocationInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter locations based on search
  const filteredAddresses = popularLocations.filter(
    (addr) =>
      addr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (address: { name: string; address: string }) => {
    onChange(address.name);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleInputChange = (val: string) => {
    setSearchQuery(val);
    onChange(val);
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">
        {label}
      </label>
      <div
        className={cn(
          'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 cursor-text bg-gray-50/80 border border-gray-200',
          (isOpen || isActive) && 'ring-2 ring-blue-500/30 border-blue-300 bg-white'
        )}
        onClick={() => {
          setIsOpen(true);
          onFocus();
          inputRef.current?.focus();
        }}
      >
        {variant === 'pickup' ? (
          <CircleDot className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
        ) : (
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={isOpen ? searchQuery : value || ''}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setIsOpen(true);
            onFocus();
          }}
          className="bg-transparent flex-1 outline-none text-xs sm:text-sm font-medium placeholder:text-gray-400 text-gray-800 min-w-0"
        />
        {variant === 'pickup' && (
          <Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 hover:text-blue-500 cursor-pointer transition-colors" />
        )}
      </div>
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-64 overflow-y-auto"
          style={{ boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.12)' }}
        >
          <div className="p-2 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-400 px-2">
              Popular Locations
            </p>
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
                  <p className="text-xs text-gray-500 truncate">
                    {address.address}
                  </p>
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

export function LocationEntry() {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<'pickup' | 'destination' | null>('pickup');

  const [pickup, setPickup] = useState<LocationState>({
    address: '',
    lat: null,
    lng: null,
  });

  const [destination, setDestination] = useState<LocationState>({
    address: '',
    lat: null,
    lng: null,
  });

  // Use the quick booking hook for trip type, date, time
  const {
    tripType,
    dateRange,
    showCalendar,
    showTimePicker,
    selectedTime,
    needsRangeCalendar,
    calendarRef,
    timeRef,
    setTripType,
    setShowCalendar,
    setShowTimePicker,
    getDateDisplayText,
    handleDateSelect,
    handleSingleDateSelect,
    handleTimeSelect,
  } = useQuickBooking();

  const CalendarIcon = needsRangeCalendar ? CalendarRange : CalendarDays;

  // Handle map click
  const handleMapLocationSelect = async (lat: number, lng: number) => {
    const address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    if (activeField === 'pickup') {
      setPickup({ address, lat, lng });
      setActiveField('destination');
    } else if (activeField === 'destination') {
      setDestination({ address, lat, lng });
      setActiveField(null);
    }
  };

  // Check if we can proceed
  const canProceed = pickup.address && destination.address;

  // Handle continue
  const handleContinue = () => {
    if (canProceed) {
      navigate(ROUTES.CUSTOMER.BOOK_SELECT_CAB, {
        state: { pickup, destination },
      });
    }
  };

  return (
    <section
      className="relative min-h-[calc(100vh-4rem)] flex items-center py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 rounded-full opacity-40 animate-float"
          style={{
            background: 'radial-gradient(circle, #bfdbfe 0%, transparent 70%)',
            animationDelay: '0s',
            animationDuration: '8s',
          }}
        />
        <div
          className="absolute top-1/4 -right-10 sm:-right-20 w-48 h-48 sm:w-96 sm:h-96 rounded-full opacity-30 animate-float"
          style={{
            background: 'radial-gradient(circle, #99f6e4 0%, transparent 70%)',
            animationDelay: '2s',
            animationDuration: '10s',
          }}
        />
        <div
          className="absolute -bottom-10 sm:-bottom-20 left-1/4 w-36 h-36 sm:w-72 sm:h-72 rounded-full opacity-35 animate-float"
          style={{
            background: 'radial-gradient(circle, #dbeafe 0%, transparent 70%)',
            animationDelay: '4s',
            animationDuration: '7s',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 sm:w-48 sm:h-48 rounded-full opacity-25 animate-float"
          style={{
            background: 'radial-gradient(circle, #a5f3fc 0%, transparent 70%)',
            animationDelay: '1s',
            animationDuration: '9s',
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(#1e293b 1px, transparent 1px),
            linear-gradient(90deg, #1e293b 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 px-0 sm:px-4 lg:px-12 items-start">
          {/* Left Content - Title and Animation */}
          <div className="space-y-4 sm:space-y-6 mb-6 lg:mb-8 lg:-ml-32">
            {/* Badge with animation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md"
              style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)',
                color: '#1d4ed8',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Book Your Ride
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold leading-tight"
              style={{ color: '#0f172a' }}
            >
              Your Journey
              <span className="block mt-1 sm:mt-2 text-[#2563eb]">
                Your Way
              </span>
            </motion.h1>

            {/* Subheading - Hidden on very small screens */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-md hidden sm:block"
            >
              Book instant rides, rent cabs for any duration, or plan trips with
              complete transparency and safety.
            </motion.p>

            {/* Animation - Below Title (Desktop Only) */}
            <div
              className="relative hidden lg:block animate-fade-in mt-4 lg:-ml-12"
              style={{
                animationDelay: '0.3s',
                animationFillMode: 'both',
              }}
            >
              {/* Background glow for animation */}
              <div
                className="absolute inset-0 rounded-full opacity-30 blur-3xl animate-pulse"
                style={{
                  background: 'radial-gradient(circle, #60a5fa 0%, transparent 60%)',
                  transform: 'scale(0.8)',
                }}
              />

              <div
                className="relative w-full max-w-md rounded-3xl overflow-visible animate-float"
                style={{ animationDuration: '6s' }}
              >
                <DotLottiePlayer
                  src="/Man waiting car.lottie"
                  autoplay
                  loop
                  className="w-full h-full drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Floating cards - Desktop only */}
            <div className="relative hidden lg:block">
              {/* Safe Rides - Top Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-96 right-0 p-4 rounded-2xl shadow-xl animate-float-subtle"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>
                      Safe Rides
                    </p>
                    <p className="text-xs" style={{ color: '#64748b' }}>
                      Verified drivers only
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 10+ Cabs - Bottom Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-8 left-0 p-4 rounded-2xl shadow-xl animate-float-subtle-delayed"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>
                      10+ Cabs
                    </p>
                    <p className="text-xs" style={{ color: '#64748b' }}>
                      Available nearby
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Content - Booking Form (Same as QuickBookingForm) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative w-full"
          >
            {/* Booking Card */}
            <div
              className="w-full max-w-sm mx-auto lg:mx-0 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl animate-fade-in-up"
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
                animationDelay: '0.4s',
                animationFillMode: 'both',
              }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                Where to next?
              </h2>

              <div className="space-y-4 sm:space-y-5">
                {/* Trip Type Selection */}
                <div className="flex gap-2 justify-center">
                  {tripTypeOptions.map((option) => {
                    const isSelected = tripType === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setTripType(option.id)}
                        className={cn(
                          'px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border',
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
                  value={pickup.address}
                  onChange={(value) => setPickup({ ...pickup, address: value })}
                  label="Pickup Location"
                  variant="pickup"
                  isActive={activeField === 'pickup'}
                  onFocus={() => setActiveField('pickup')}
                />

                {/* Destination Location (hide for rentals) */}
                {tripType !== 'rental' && (
                  <LocationInput
                    placeholder="Enter destination"
                    value={destination.address}
                    onChange={(value) => setDestination({ ...destination, address: value })}
                    label="Drop-off Location"
                    variant="dropoff"
                    isActive={activeField === 'destination'}
                    onFocus={() => setActiveField('destination')}
                  />
                )}

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {/* Date Picker */}
                  <div ref={calendarRef} className="relative">
                    <label className="block text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">
                      Date
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className={cn(
                        'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 w-full text-left bg-gray-50/80 border border-gray-200',
                        showCalendar && 'ring-2 ring-blue-500/30 border-blue-300 bg-white'
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-800 flex-1 truncate">
                        {getDateDisplayText()}
                      </span>
                      <ChevronDown
                        className={cn(
                          'w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform',
                          showCalendar && 'rotate-180'
                        )}
                      />
                    </button>
                    {showCalendar && (
                      <div
                        className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-3"
                        style={{
                          minWidth: needsRangeCalendar ? 'min(560px, 90vw)' : '280px',
                          boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        {needsRangeCalendar ? (
                          <CalendarComponent
                            mode="range"
                            defaultMonth={dateRange?.from || new Date()}
                            selected={dateRange}
                            onSelect={(selected: DateRange | undefined) =>
                              handleDateSelect(selected)
                            }
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
                            onSelect={(selected: Date | undefined) =>
                              handleSingleDateSelect(selected)
                            }
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
                    <label className="block text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">
                      Time
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowTimePicker(!showTimePicker)}
                      className={cn(
                        'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 w-full text-left bg-gray-50/80 border border-gray-200',
                        showTimePicker && 'ring-2 ring-blue-500/30 border-blue-300 bg-white'
                      )}
                    >
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-800 flex-1">
                        {selectedTime}
                      </span>
                      <ChevronDown
                        className={cn(
                          'w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform',
                          showTimePicker && 'rotate-180'
                        )}
                      />
                    </button>
                    {showTimePicker && (
                      <div
                        className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto"
                        style={{ boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.12)' }}
                      >
                        {timeOptions.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => handleTimeSelect(time)}
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

                {/* Map Preview - Smaller on mobile */}
                <div className="relative h-28 sm:h-40 rounded-xl overflow-hidden border border-gray-200">
                  <MapContainer
                    center={[MAP_CONFIG.defaultCenter.lat, MAP_CONFIG.defaultCenter.lng]}
                    zoom={MAP_CONFIG.defaultZoom}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution={MAP_CONFIG.attribution}
                      url={MAP_CONFIG.tileLayer}
                    />
                    <MapClickHandler
                      onLocationSelect={handleMapLocationSelect}
                      activeField={activeField}
                    />
                    {pickup.lat && pickup.lng && (
                      <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />
                    )}
                    {destination.lat && destination.lng && (
                      <Marker
                        position={[destination.lat, destination.lng]}
                        icon={destinationIcon}
                      />
                    )}
                  </MapContainer>

                  {/* Map instructions overlay */}
                  {activeField && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg"
                    >
                      <p className="text-xs font-medium text-gray-700">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        Tap to set{' '}
                        <span
                          className={
                            activeField === 'pickup' ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          {activeField}
                        </span>
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Search Button */}
                <button
                  onClick={handleContinue}
                  disabled={!canProceed}
                  className={cn(
                    'w-full py-3 sm:py-4 text-white rounded-xl transition-all duration-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99]',
                    !canProceed && 'opacity-50 cursor-not-allowed'
                  )}
                  style={{
                    background: '#3B82F6',
                    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
                  }}
                >
                  Search Cabs
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Saved Places & Recent Trips */}
                <div className="flex items-center justify-center gap-4 sm:gap-8 pt-1 sm:pt-2">
                  <button className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Saved</span>
                  </button>
                  <button className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Recent</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
