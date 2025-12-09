import React from 'react';
import {
  Car,
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics.service';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { format, subDays } from 'date-fns';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgGradient, subtitle, trend, delay = 0 }) => {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${delay * 0.1}s` }}>
      <Card
        className="group cursor-pointer relative overflow-hidden h-full transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl border-0"
        style={{
          background: `linear-gradient(135deg, ${bgGradient})`,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="p-2.5 rounded-xl backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {React.cloneElement(icon as React.ReactElement, {
                    size: 24,
                    style: { color: 'white' },
                  } as any)}
                </div>
                <span className="text-white/80 font-medium text-sm">{title}</span>
              </div>

              <h3
                className="text-4xl sm:text-5xl font-black text-white leading-none mb-2 transition-transform duration-300 group-hover:scale-105"
                id={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {value}
              </h3>

              <div className="flex items-center gap-3">
                {subtitle && (
                  <p className="text-sm text-white/70 font-medium">
                    {subtitle}
                  </p>
                )}
                {trend && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${trend.isPositive ? 'bg-green-500/30 text-green-100' : 'bg-red-500/30 text-red-100'
                    }`}>
                    {trend.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {trend.value}%
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        {/* Bottom glow effect */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
        />
      </Card>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: analyticsService.getDashboardStats,
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenue-over-time'],
    queryFn: () =>
      analyticsService.getRevenueOverTime({
        startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
      }),
  });

  if (isLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
        <p className="text-red-700 font-medium">
          Failed to load dashboard data. Please try again later.
        </p>
      </div>
    );
  }

  const fleetData = [
    { name: 'Available', value: stats?.fleet.availableCabs || 0 },
    { name: 'Rented', value: stats?.fleet.rentedCabs || 0 },
    { name: 'Maintenance', value: stats?.fleet.maintenanceCabs || 0 },
  ];

  return (
    <div className="animate-fade-in-up space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                Overview
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-4 tracking-tight text-gradient-primary">
              Dashboard
            </h1>
            <p className="text-xl text-gray-600 font-medium max-w-2xl">
              Welcome back! Here's a summary of your fleet's performance today.
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl glass-effect border border-blue-100">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Live Updates</p>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <p className="text-sm">
                  {format(new Date(), 'MMM dd, yyyy • h:mm a')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl p-2.5 shadow-lg">
            <BarChart3 className="text-white h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Key Metrics</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Fleet"
            value={stats?.fleet.totalCabs || 0}
            icon={<Car />}
            color="#3b82f6"
            bgGradient="#2563eb, #1d4ed8"
            subtitle={`${stats?.fleet.utilizationRate?.toFixed(1) || 0}% utilization`}
            trend={{ value: 12, isPositive: true }}
            delay={0}
          />
          <StatCard
            title="Active Drivers"
            value={stats?.drivers.activeDrivers || 0}
            icon={<Users />}
            color="#10b981"
            bgGradient="#059669, #047857"
            subtitle={`${stats?.drivers.totalDrivers || 0} total drivers`}
            trend={{ value: 8, isPositive: true }}
            delay={1}
          />
          <StatCard
            title="Active Bookings"
            value={stats?.bookings.activeBookings || 0}
            icon={<BookOpen />}
            color="#f59e0b"
            bgGradient="#d97706, #b45309"
            subtitle={`${stats?.bookings.pendingBookings || 0} pending`}
            trend={{ value: 5, isPositive: true }}
            delay={2}
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats?.revenue.totalRevenue?.toLocaleString() || 0}`}
            icon={<DollarSign />}
            color="#8b5cf6"
            bgGradient="#7c3aed, #6d28d9"
            subtitle={`${stats?.revenue.collectionRate?.toFixed(1) || 0}% collected`}
            trend={{ value: 15, isPositive: true }}
            delay={3}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl p-2.5 shadow-lg">
            <TrendingUp className="text-white h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <Card className="relative overflow-hidden border-0 shadow-xl card-modern">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500" />

              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-3 border border-blue-200">
                      <TrendingUp className="text-blue-600 h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Revenue Trend
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Last 30 days performance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                    <ArrowUpRight className="h-4 w-4" />
                    +15%
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white p-4">
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={revenueData || []}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: 'none',
                          borderRadius: 16,
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                          padding: '12px 16px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="url(#colorRevenue)"
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
                        name="Revenue"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fleet Status */}
          <div>
            <Card className="relative overflow-hidden border-0 shadow-xl card-modern h-full">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500" />

              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl p-3 border border-teal-200">
                    <Car className="text-teal-600 h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Fleet Status
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Current distribution
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white p-4 mb-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={fleetData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="none"
                        paddingAngle={3}
                      >
                        {fleetData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: 'none',
                          borderRadius: 12,
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {fleetData.map((item, index) => (
                    <div
                      key={item.name}
                      className="group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:translate-x-2 cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS[index % COLORS.length]}15, ${COLORS[index % COLORS.length]}08)`,
                        border: `1px solid ${COLORS[index % COLORS.length]}30`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-125"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                            boxShadow: `0 4px 12px ${COLORS[index % COLORS.length]}50`,
                          }}
                        />
                        <span className="font-semibold text-gray-800">{item.name}</span>
                      </div>
                      <span
                        className="text-2xl font-black"
                        style={{ color: COLORS[index % COLORS.length] }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
