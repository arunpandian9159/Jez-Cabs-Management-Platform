import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/shared/utils';
import { AlertCircle } from 'lucide-react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      hint,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            'flex w-full rounded-lg border bg-white px-3 py-2 text-sm transition-all duration-200 placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[80px]',
            error
              ? 'border-error-500 focus-visible:border-error-500 focus-visible:ring-2 focus-visible:ring-error-500/20'
              : 'border-gray-300 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20',
            className
          )}
          {...props}
        />
        {(error || hint) && (
          <p
            className={cn(
              'flex items-center gap-1 text-xs',
              error ? 'text-error-600' : 'text-gray-500'
            )}
          >
            {error && <AlertCircle className="h-3 w-3" />}
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
