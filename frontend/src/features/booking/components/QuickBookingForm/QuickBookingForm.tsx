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
import { useAuthModal } from '@/features/auth';
import {
  useQuickBooking,
  useLocationInput,
  tripTypeOptions,
  timeOptions,
} from '../../hooks/useQuickBooking';
import type { DateRange } from 'react-day-picker';

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
  const {
    isOpen,
    searchQuery,
    containerRef,
    inputRef,
    filteredAddresses,
    setIsOpen,
    handleSelect,
    handleInputChange,
  } = useLocationInput(onChange);
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
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="bg-transparent flex-1 outline-none text-sm font-medium placeholder:text-gray-400 text-gray-800 min-w-0"
        />
        {variant === 'pickup' && (
          <Crosshair className="w-4 h-4 text-gray-400 flex-shrink-0 hover:text-blue-500 cursor-pointer transition-colors" />
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

export function QuickBookingForm() {
  const { openRegister } = useAuthModal();
  const {
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
  } = useQuickBooking();
  const CalendarIcon = needsRangeCalendar ? CalendarRange : CalendarDays;

  return (
    <div
      className="w-full max-w-full sm:max-w-sm p-5 sm:p-8 rounded-2xl sm:rounded-3xl animate-fade-in-up box-border"
      style={{
        background: 'rgba(255, 255, 255, 0.98)',
        boxShadow:
          '0 4px 24px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
        animationDelay: '0.4s',
        animationFillMode: 'both',
      }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Where to next?
      </h2>
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2 justify-center">
          {tripTypeOptions.map((option) => {
            const isSelected = tripType === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setTripType(option.id)}
                className={cn(
                  'flex-1 sm:flex-none px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border min-w-0',
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
        <LocationInput
          placeholder="Enter pickup location"
          value={fromLocation}
          onChange={setFromLocation}
          label="Pickup Location"
          variant="pickup"
        />
        {tripType !== 'rental' && (
          <LocationInput
            placeholder="Enter destination"
            value={toLocation}
            onChange={setToLocation}
            label="Drop-off Location"
            variant="dropoff"
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div ref={calendarRef} className="relative">
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Date
            </label>
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left bg-gray-50/80 border border-gray-200',
                showCalendar &&
                'ring-2 ring-blue-500/30 border-blue-300 bg-white'
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
            {showCalendar && (
              <div
                className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-3"
                style={{
                  minWidth: needsRangeCalendar ? 'min(560px, calc(100vw - 40px))' : '260px',
                  maxWidth: 'calc(100vw - 40px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
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
          <div ref={timeRef} className="relative">
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Time
            </label>
            <button
              type="button"
              onClick={() => setShowTimePicker(!showTimePicker)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left bg-gray-50/80 border border-gray-200',
                showTimePicker &&
                'ring-2 ring-blue-500/30 border-blue-300 bg-white'
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
            {showTimePicker && (
              <div
                className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
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
        <button
          onClick={() => openRegister()}
          className="w-full py-4 text-white rounded-xl transition-all duration-200 font-semibold text-base flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99]"
          style={{
            background: '#3B82F6',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
          }}
        >
          Search Cabs
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center gap-4 sm:gap-8 pt-2">
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
