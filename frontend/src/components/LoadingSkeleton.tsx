import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';

interface LoadingSkeletonProps {
  variant?: 'dashboard' | 'list' | 'form' | 'card';
  count?: number;
}

const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-lg ${className}`}
  />
);

const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8 animate-fade-in">
    {/* Header */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Shimmer className="h-8 w-24 rounded-full" />
        </div>
        <Shimmer className="h-14 w-80 mb-3" />
        <Shimmer className="h-6 w-96" />
      </div>
      <Shimmer className="h-20 w-48 rounded-2xl" />
    </div>

    {/* Section header */}
    <div className="flex items-center gap-3 mb-6">
      <Shimmer className="h-10 w-10 rounded-xl" />
      <Shimmer className="h-8 w-40" />
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden border-0 shadow-lg">
          <div className="h-1 bg-gradient-to-r from-slate-200 to-slate-300" />
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shimmer className="h-10 w-10 rounded-xl" />
                <Shimmer className="h-4 w-20" />
              </div>
            </div>
            <Shimmer className="h-12 w-24 mb-2" />
            <div className="flex items-center gap-2">
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-5 w-12 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Section header */}
    <div className="flex items-center gap-3 mb-6">
      <Shimmer className="h-10 w-10 rounded-xl" />
      <Shimmer className="h-8 w-48" />
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 overflow-hidden border-0 shadow-lg">
        <div className="h-1 bg-gradient-to-r from-slate-200 to-slate-300" />
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Shimmer className="h-12 w-12 rounded-xl" />
            <div>
              <Shimmer className="h-6 w-32 mb-2" />
              <Shimmer className="h-4 w-40" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Shimmer className="h-80 w-full rounded-xl" />
        </CardContent>
      </Card>
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="h-1 bg-gradient-to-r from-slate-200 to-slate-300" />
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Shimmer className="h-12 w-12 rounded-xl" />
            <div>
              <Shimmer className="h-6 w-28 mb-2" />
              <Shimmer className="h-4 w-36" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Shimmer className="h-48 w-full rounded-xl mb-6" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Shimmer key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ListSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <div className="space-y-8 animate-fade-in">
    {/* Header */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div className="flex items-center gap-4">
        <Shimmer className="h-16 w-16 rounded-2xl" />
        <div>
          <Shimmer className="h-6 w-16 rounded-full mb-2" />
          <Shimmer className="h-12 w-64 mb-2" />
          <Shimmer className="h-5 w-80" />
        </div>
      </div>
      <Shimmer className="h-14 w-40 rounded-xl" />
    </div>

    {/* Filter Card */}
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="h-1 bg-gradient-to-r from-slate-200 to-slate-300" />
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shimmer className="h-10 w-10 rounded-xl" />
          <div>
            <Shimmer className="h-5 w-32 mb-1" />
            <Shimmer className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <Shimmer className="h-12 w-full rounded-xl" />
          </div>
          <Shimmer className="h-12 w-full rounded-xl" />
        </div>
      </CardContent>
    </Card>

    {/* Table */}
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="h-1 bg-gradient-to-r from-slate-200 to-slate-300" />
      <CardContent className="p-0">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-5 border-b">
          <div className="grid grid-cols-7 gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Shimmer key={i} className="h-5 w-full" />
            ))}
          </div>
        </div>

        {/* Table Rows */}
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-5 border-b last:border-b-0">
            <div className="grid grid-cols-7 gap-4 items-center">
              <div className="flex items-center gap-3">
                <Shimmer className="h-12 w-12 rounded-xl" />
                <div>
                  <Shimmer className="h-5 w-24 mb-1" />
                  <Shimmer className="h-4 w-20" />
                </div>
              </div>
              <Shimmer className="h-7 w-24 rounded-full" />
              <Shimmer className="h-7 w-20 rounded-full" />
              <Shimmer className="h-5 w-12" />
              <Shimmer className="h-6 w-16" />
              <Shimmer className="h-6 w-16 rounded-lg" />
              <div className="flex gap-2 justify-end">
                <Shimmer className="h-9 w-16 rounded-lg" />
                <Shimmer className="h-9 w-10 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

const FormSkeleton: React.FC = () => (
  <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
    {/* Header */}
    <div className="flex items-center gap-4 mb-8">
      <Shimmer className="h-16 w-16 rounded-2xl" />
      <div>
        <Shimmer className="h-10 w-48 mb-2" />
        <Shimmer className="h-5 w-64" />
      </div>
    </div>

    {/* Form Card */}
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="h-1 bg-gradient-to-r from-slate-200 to-slate-300" />
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Shimmer className="h-5 w-24" />
              <Shimmer className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t flex justify-end gap-4">
          <Shimmer className="h-12 w-24 rounded-xl" />
          <Shimmer className="h-12 w-32 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  </div>
);

const CardSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i} className="overflow-hidden border-0 shadow-lg">
        <div className="h-1 bg-gradient-to-r from-slate-200 to-slate-300" />
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Shimmer className="h-14 w-14 rounded-xl" />
            <div className="flex-1">
              <Shimmer className="h-6 w-3/4 mb-2" />
              <Shimmer className="h-4 w-1/2" />
            </div>
          </div>
          <div className="space-y-3">
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-5/6" />
            <Shimmer className="h-4 w-4/6" />
          </div>
          <div className="mt-6 pt-4 border-t flex justify-between">
            <Shimmer className="h-9 w-20 rounded-lg" />
            <Shimmer className="h-9 w-20 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 3,
}) => {
  switch (variant) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'list':
      return <ListSkeleton count={count} />;
    case 'form':
      return <FormSkeleton />;
    case 'card':
    default:
      return <CardSkeleton count={count} />;
  }
};
