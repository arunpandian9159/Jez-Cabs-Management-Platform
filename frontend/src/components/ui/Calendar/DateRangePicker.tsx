import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from './Calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/shared/utils';
import type { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
    value?: DateRange;
    onChange?: (range: DateRange | undefined) => void;
    placeholder?: string;
    className?: string;
    numberOfMonths?: number;
}

export function DateRangePicker({
    value,
    onChange,
    placeholder = 'Pick dates',
    className,
    numberOfMonths = 2,
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayText = value?.from
        ? value.to
            ? `${format(value.from, 'MMM dd')} - ${format(value.to, 'MMM dd, yyyy')}`
            : format(value.from, 'MMM dd, yyyy')
        : placeholder;

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-md w-full text-left',
                    isOpen && 'ring-2 ring-blue-500 ring-offset-1'
                )}
                style={{
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    border: '1px solid #e2e8f0',
                }}
            >
                <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-blue-600" />
                <span
                    className={cn(
                        'flex-1 text-xs sm:text-sm font-medium truncate',
                        value?.from ? 'text-gray-900' : 'text-gray-500'
                    )}
                >
                    {displayText}
                </span>
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-2"
                    style={{
                        minWidth: numberOfMonths === 1 ? '280px' : '550px',
                    }}
                >
                    <Calendar
                        mode="range"
                        defaultMonth={value?.from}
                        selected={value}
                        onSelect={(range) => {
                            onChange?.(range);
                            if (range?.from && range?.to) {
                                setIsOpen(false);
                            }
                        }}
                        numberOfMonths={numberOfMonths}
                        disabled={{ before: new Date() }}
                    />
                </div>
            )}
        </div>
    );
}
