import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

import 'react-day-picker/dist/style.css';

export type CalendarProps = DayPickerProps & {
    cellSize?: 'sm' | 'md' | 'lg';
};

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    cellSize = 'md',
    ...props
}: CalendarProps) {
    // Define cell size classes
    const cellSizeClasses = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-9 w-9 text-sm',
        lg: 'h-11 w-11 text-sm md:h-12 md:w-12',
    };

    const headCellSizeClasses = {
        sm: 'w-8 text-[0.7rem]',
        md: 'w-9 text-[0.8rem]',
        lg: 'w-11 text-[0.8rem] md:w-12',
    };

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('p-3', className)}
            classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-semibold text-gray-900',
                nav: 'space-x-1 flex items-center',
                nav_button: cn(
                    'h-8 w-8 bg-transparent p-0 opacity-60 hover:opacity-100 inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-50 active:scale-95'
                ),
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: cn(
                    'text-gray-500 rounded-md font-medium',
                    headCellSizeClasses[cellSize]
                ),
                row: 'flex w-full mt-2',
                cell: cn(
                    'text-center p-0 relative',
                    cellSizeClasses[cellSize],
                    '[&:has([aria-selected].day-range-end)]:rounded-r-lg',
                    '[&:has([aria-selected].day-range-start)]:rounded-l-lg',
                    '[&:has([aria-selected].day-outside)]:bg-blue-100/50',
                    '[&:has([aria-selected])]:bg-blue-100',
                    'first:[&:has([aria-selected])]:rounded-l-lg',
                    'last:[&:has([aria-selected])]:rounded-r-lg',
                    'focus-within:relative focus-within:z-20'
                ),
                day: cn(
                    'p-0 font-normal aria-selected:opacity-100 inline-flex items-center justify-center rounded-lg ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 hover:bg-blue-100 hover:text-blue-800 active:scale-95',
                    cellSizeClasses[cellSize]
                ),
                day_range_start: 'day-range-start aria-selected:!bg-blue-400 aria-selected:!text-white',
                day_range_end: 'day-range-end aria-selected:!bg-blue-400 aria-selected:!text-white',
                day_selected:
                    'bg-blue-400 !text-white hover:bg-blue-400 focus:bg-blue-400',
                day_today: 'bg-blue-50 text-blue-600 font-semibold ring-1 ring-blue-200',
                day_outside:
                    'day-outside text-gray-300 opacity-50 aria-selected:bg-blue-100/50 aria-selected:text-gray-400 aria-selected:opacity-40',
                day_disabled: 'text-gray-300 opacity-50 cursor-not-allowed',
                day_range_middle:
                    'aria-selected:!bg-blue-100 aria-selected:!text-blue-900 hover:aria-selected:!bg-blue-200 hover:aria-selected:!text-blue-900',
                day_hidden: 'invisible',
                ...classNames,
            }}
            components={{
                IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                IconRight: () => <ChevronRight className="h-4 w-4" />,
            }}
            {...props}
        />
    );
}
Calendar.displayName = 'Calendar';

export { Calendar };
