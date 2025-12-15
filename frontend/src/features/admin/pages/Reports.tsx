import { motion } from 'framer-motion';
import {
    Download,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Car,
    Users,
    UserCheck,
    TrendingUp,
    BarChart3,
    PieChart,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { useAdminReports, ReportType } from '../hooks/useAdminReports';
import { AdminPageHeader } from '../components';

export function AdminReports() {
    const {
        activeReport,
        dateRange,
        currentReport,
        maxChartValue,
        setActiveReport,
        setDateRange,
    } = useAdminReports();

    const reportTabs: { key: ReportType; label: string; icon: React.ReactNode }[] = [
        { key: 'revenue', label: 'Revenue', icon: <DollarSign className="w-4 h-4" /> },
        { key: 'trips', label: 'Trips', icon: <Car className="w-4 h-4" /> },
        { key: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
        { key: 'drivers', label: 'Drivers', icon: <UserCheck className="w-4 h-4" /> },
    ];

    const chartColors = {
        revenue: 'from-success-500 to-success-600',
        trips: 'from-primary-500 to-primary-600',
        users: 'from-accent-500 to-accent-600',
        drivers: 'from-warning-500 to-warning-600',
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Reports"
                subtitle="Analytics and insights for your business"
                icon={BarChart3}
                iconColor="success"
                action={
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        <Select
                            options={[
                                { value: 'today', label: 'Today' },
                                { value: 'week', label: 'This Week' },
                                { value: 'month', label: 'This Month' },
                                { value: 'quarter', label: 'This Quarter' },
                                { value: 'year', label: 'This Year' },
                            ]}
                            value={dateRange}
                            onValueChange={(value) => setDateRange(value as typeof dateRange)}
                        />
                        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} className="hidden sm:flex">
                            Export Report
                        </Button>
                        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} className="sm:hidden">
                            Export
                        </Button>
                    </div>
                }
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto"
            >
                {reportTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveReport(tab.key)}
                        className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeReport === tab.key
                            ? 'bg-white shadow-md text-primary-600'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {currentReport.metrics.map((metric, index) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <Card padding="lg" className="bg-gradient-to-br from-white to-gray-50 overflow-hidden relative">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                                <p className="text-xs sm:text-sm font-medium text-gray-500">{metric.label}</p>
                                <div
                                    className={`flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${metric.trending === 'up' ? 'text-success-600 bg-success-100' : 'text-error-600 bg-error-100'
                                        }`}
                                >
                                    {metric.trending === 'up' ? (
                                        <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    ) : (
                                        <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    )}
                                    {metric.change}
                                </div>
                            </div>
                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{metric.value}</p>
                            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br ${chartColors[activeReport]} opacity-10 blur-xl`} />
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card padding="lg" className="overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${chartColors[activeReport]} flex items-center justify-center`}>
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    {activeReport === 'revenue' && 'Revenue Trend'}
                                    {activeReport === 'trips' && 'Weekly Trip Distribution'}
                                    {activeReport === 'users' && 'User Growth'}
                                    {activeReport === 'drivers' && 'Driver Growth'}
                                </h2>
                                <p className="text-sm text-gray-500">Last 7 days performance</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-64 flex items-end gap-3">
                        {currentReport.chart.map((data, index) => {
                            const height = (data.value / maxChartValue) * 100;
                            return (
                                <motion.div
                                    key={data.label}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ delay: 0.4 + index * 0.05, duration: 0.5, type: 'spring' }}
                                    className="flex-1 flex flex-col items-center gap-2"
                                >
                                    <div
                                        className={`w-full bg-gradient-to-t ${chartColors[activeReport]} rounded-t-lg hover:opacity-90 transition-opacity cursor-pointer group relative shadow-lg`}
                                        style={{ height: '100%' }}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            whileHover={{ opacity: 1, y: 0 }}
                                            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap"
                                        >
                                            {typeof data.value === 'number' && data.value > 1000
                                                ? `₹${(data.value / 1000).toFixed(0)}K`
                                                : data.value}
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                                        </motion.div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">{data.label}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
                <Card padding="lg" className="bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                            <PieChart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600" />
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Quick Stats</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'Peak Hours', value: '9 AM - 11 AM', color: 'text-primary-600' },
                            { label: 'Most Popular Route', value: 'Airport - City Center', color: 'text-accent-600' },
                            { label: 'Avg. Wait Time', value: '4.5 min', color: 'text-warning-600' },
                            { label: 'Customer Satisfaction', value: '92%', color: 'text-success-600' },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-sm text-gray-600">{stat.label}</span>
                                <span className={`text-sm font-semibold ${stat.color}`}>{stat.value}</span>
                            </motion.div>
                        ))}
                    </div>
                </Card>
                <Card padding="lg" className="bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-success-100 flex items-center justify-center">
                            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success-600" />
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Top Performing Areas</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { area: 'Chennai Central', trips: 1245, percentage: 75 },
                            { area: 'T. Nagar', trips: 982, percentage: 60 },
                            { area: 'Anna Nagar', trips: 876, percentage: 55 },
                            { area: 'Velachery', trips: 654, percentage: 40 },
                        ].map((item, index) => (
                            <motion.div
                                key={item.area}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium text-gray-700">{item.area}</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {item.trips} trips
                                    </span>
                                </div>
                                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.percentage}%` }}
                                        transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                                        className={`h-full bg-gradient-to-r ${chartColors[activeReport]} rounded-full`}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
