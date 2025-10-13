import React from 'react';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'table' | 'dashboard' | 'form';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 6,
}) => {
  if (variant === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-72" />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-14 w-14 rounded-full" />
                </div>
                <Skeleton className="h-10 w-3/5 mb-2" />
                <Skeleton className="h-5 w-4/5 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-[300px] w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-36 mb-4" />
                <Skeleton className="h-48 w-48 rounded-full mx-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-72" />
        </div>

        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-7 w-36 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-md" />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <Skeleton className="h-8 w-48" />
          </div>
          {[...Array(count)].map((_, i) => (
            <div key={i} className="flex gap-4 mb-4 items-center">
              <Skeleton className="h-10 w-[30%]" />
              <Skeleton className="h-10 w-[25%]" />
              <Skeleton className="h-10 w-[20%]" />
              <Skeleton className="h-10 w-[15%]" />
              <Skeleton className="h-10 w-[10%]" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-6 w-60" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-14 w-full rounded-md" />
              <Skeleton className="h-14 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(count)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between mb-4">
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-5 w-3/5" />
                </div>
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1 rounded-md" />
                  <Skeleton className="h-9 w-10 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-3/5 mb-2" />
            <Skeleton className="h-6 w-4/5 mb-4" />
            <Skeleton className="h-[120px] w-full mb-4 rounded-md" />
            <Skeleton className="h-7 w-2/5" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

