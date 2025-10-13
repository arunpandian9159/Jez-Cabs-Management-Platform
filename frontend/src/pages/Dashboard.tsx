import React from 'react';
import {
  Car,
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics.service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell} from 'recharts';
import { format, subDays } from 'date-fns';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#f44336'];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle, delay = 0 }) => {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${delay * 0.1}s` }}>
      <Card
        className="group cursor-pointer relative overflow-hidden h-full transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${color}08, ${color}15)`,
          borderColor: `${color}20`,
        }}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
        />

        {/* Background decoration */}
        <div
          className="absolute -top-5 -right-5 w-24 h-24 rounded-full opacity-30 transition-all duration-500 group-hover:opacity-100 group-hover:scale-125"
          style={{ background: `radial-gradient(circle, ${color}20, transparent)` }}
        />

        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3
                className="text-3xl sm:text-4xl md:text-5xl font-black leading-none transition-transform duration-300 group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, #1f2937, ${color}cc)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                id={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {value}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-500 font-medium mt-1">
                  {subtitle}
                </p>
              )}
            </div>

            <div
              className="stat-icon p-3 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 backdrop-blur-sm shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${color}25, ${color}40)`,
                border: `2px solid ${color}30`,
                boxShadow: `0 8px 20px ${color}25`,
              }}
              aria-hidden="true"
            >
              {React.cloneElement(icon as React.ReactElement, {
                size: 40,
                style: { color },
              } as any)}
            </div>
          </div>
        </CardContent>
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
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
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
    <div className="animate-fade-in-up">
      <div>
        {/* Header Section */}
        <div className="mb-12">
          <div className="animate-scale-in mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-4 tracking-tight bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-xl text-gray-600 font-medium mb-4 max-w-2xl">
              Welcome back! Here's what's happening with your fleet today.
            </p>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100 w-fit">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-sm text-gray-600 font-medium">
                Last updated: {format(new Date(), 'MMM dd, yyyy \'at\' h:mm a')}
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards Section */}
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl p-3 flex items-center justify-center mr-4 shadow-lg">
              <BarChart3 className="text-white h-7 w-7" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                Key Performance Indicators
              </h2>
              <p className="text-lg text-gray-600 font-medium">
                Real-time insights into your business performance
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Fleet"
              value={stats?.fleet.totalCabs || 0}
              icon={<Car />}
              color="#1976d2"
              subtitle={`${stats?.fleet.utilizationRate?.toFixed(1) || 0}% utilization`}
              delay={0}
            />
            <StatCard
              title="Active Drivers"
              value={stats?.drivers.activeDrivers || 0}
              icon={<Users />}
              color="#4caf50"
              subtitle={`${stats?.drivers.totalDrivers || 0} total drivers`}
              delay={1}
            />
            <StatCard
              title="Active Bookings"
              value={stats?.bookings.activeBookings || 0}
              icon={<BookOpen />}
              color="#ff9800"
              subtitle={`${stats?.bookings.pendingBookings || 0} pending`}
              delay={2}
            />
            <StatCard
              title="Total Revenue"
              value={`$${stats?.revenue.totalRevenue?.toLocaleString() || 0}`}
              icon={<DollarSign />}
              color="#4caf50"
              subtitle={`${stats?.revenue.collectionRate?.toFixed(1) || 0}% collected`}
              delay={3}
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-xl p-3 flex items-center justify-center mr-4 shadow-lg">
              <TrendingUp className="text-white h-7 w-7" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                Analytics & Insights
              </h2>
              <p className="text-lg text-gray-600 font-medium">
                Detailed performance metrics and trends
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white border border-blue-100">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-green-500" />

              <CardHeader>
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-3 flex items-center justify-center mr-4 border-2 border-blue-200">
                    <TrendingUp className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Revenue Over Time
                    </CardTitle>
                    <p className="text-sm text-gray-600 font-medium">
                      Last 30 days performance
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="rounded-lg overflow-hidden bg-white/50 p-4">
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={revenueData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: 12,
                          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: '#2563eb', strokeWidth: 2 }}
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fleet Status */}
          <div>
            <Card className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-white border border-teal-100">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 to-orange-500" />

              <CardHeader>
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl p-3 flex items-center justify-center mr-4 border-2 border-teal-200">
                    <Car className="text-teal-600 h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Fleet Status
                    </CardTitle>
                    <p className="text-sm text-gray-600 font-medium">
                      Current cab distribution
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="rounded-lg overflow-hidden bg-white/50 p-4 mb-6">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={fleetData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="none"
                      >
                        {fleetData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: 12,
                          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6">
                  {fleetData.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-3 mb-2 rounded-lg transition-all duration-200 hover:translate-x-1"
                      style={{
                        background: `${COLORS[index % COLORS.length]}20`,
                        border: `1px solid ${COLORS[index % COLORS.length]}40`,
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-3 shadow-sm"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                            boxShadow: `0 2px 8px ${COLORS[index % COLORS.length]}50`,
                          }}
                        />
                        <span className="font-semibold text-gray-900">{item.name}</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{item.value}</span>
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
