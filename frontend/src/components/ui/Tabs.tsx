import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

const TabsRoot = TabsPrimitive.Root;

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            'inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500',
            className
        )}
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm',
            className
        )}
        {...props}
    />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2',
            className
        )}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Convenience Tabs component
export interface TabItem {
    value: string;
    label: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export interface TabsProps {
    items: TabItem[];
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    tabsListClassName?: string;
}

export function Tabs({
    items,
    defaultValue,
    value,
    onValueChange,
    className,
    tabsListClassName,
}: TabsProps) {
    const defaultTab = defaultValue || items[0]?.value;

    return (
        <TabsRoot
            defaultValue={defaultTab}
            value={value}
            onValueChange={onValueChange}
            className={className}
        >
            <TabsList className={tabsListClassName}>
                {items.map((item) => (
                    <TabsTrigger
                        key={item.value}
                        value={item.value}
                        disabled={item.disabled}
                        className="gap-2"
                    >
                        {item.icon}
                        {item.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            {items.map((item) => (
                <TabsContent key={item.value} value={item.value}>
                    {item.content}
                </TabsContent>
            ))}
        </TabsRoot>
    );
}

// Underline variant tabs
const TabsListUnderline = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            'inline-flex h-10 items-center justify-start gap-4 border-b border-gray-200',
            className
        )}
        {...props}
    />
));
TabsListUnderline.displayName = 'TabsListUnderline';

const TabsTriggerUnderline = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            'inline-flex items-center justify-center whitespace-nowrap border-b-2 border-transparent px-1 pb-3 pt-2 text-sm font-medium text-gray-500 transition-all hover:text-gray-700 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600',
            className
        )}
        {...props}
    />
));
TabsTriggerUnderline.displayName = 'TabsTriggerUnderline';

export {
    TabsRoot,
    TabsList,
    TabsTrigger,
    TabsContent,
    TabsListUnderline,
    TabsTriggerUnderline,
};
