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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { useAdminReports, ReportType } from '../hooks/useAdminReports';

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

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Reports</h1>
                    <p className="text-gray-500">
                        Analytics and insights for your business
                    </p>
                </div>
                <div className="flex items-center gap-3">
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
                    <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                        Export Report
                    </Button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-2 border-b border-gray-200"
            >
                {reportTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveReport(tab.key)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeReport === tab.key
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-4 gap-4"
            >
                {currentReport.metrics.map((metric, index) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                    >
                        <Card padding="lg">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-500">{metric.label}</p>
                                <div
                                    className={`flex items-center gap-1 text-xs font-medium ${metric.trending === 'up' ? 'text-success-600' : 'text-error-600'
                                        }`}
                                >
                                    {metric.trending === 'up' ? (
                                        <ArrowUpRight className="w-3 h-3" />
                                    ) : (
                                        <ArrowDownRight className="w-3 h-3" />
                                    )}
                                    {metric.change}
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card padding="lg">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-600" />
                            <h2 className="font-semibold text-gray-900">
                                {activeReport === 'revenue' && 'Revenue Trend'}
                                {activeReport === 'trips' && 'Weekly Trip Distribution'}
                                {activeReport === 'users' && 'User Growth'}
                                {activeReport === 'drivers' && 'Driver Growth'}
                            </h2>
                        </div>
                    </div>
                    <div className="h-64 flex items-end gap-2">
                        {currentReport.chart.map((data, index) => {
                            const height = (data.value / maxChartValue) * 100;
                            return (
                                <motion.div
                                    key={data.label}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                                    className="flex-1 flex flex-col items-center gap-2"
                                >
                                    <div
                                        className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md hover:from-primary-700 hover:to-primary-500 transition-colors cursor-pointer group relative"
                                        style={{ height: '100%' }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {typeof data.value === 'number' && data.value > 1000
                                                ? `₹${(data.value / 1000).toFixed(0)}K`
                                                : data.value}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">{data.label}</span>
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
                className="grid grid-cols-2 gap-4"
            >
                <Card padding="lg">
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Peak Hours</span>
                            <span className="text-sm font-medium text-gray-900">9 AM - 11 AM</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Most Popular Route</span>
                            <span className="text-sm font-medium text-gray-900">
                                Airport - City Center
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Avg. Wait Time</span>
                            <span className="text-sm font-medium text-gray-900">4.5 min</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Customer Satisfaction</span>
                            <span className="text-sm font-medium text-success-600">92%</span>
                        </div>
                    </div>
                </Card>
                <Card padding="lg">
                    <h3 className="font-semibold text-gray-900 mb-4">Top Performing Areas</h3>
                    <div className="space-y-3">
                        {[
                            { area: 'Chennai Central', trips: 1245, percentage: 75 },
                            { area: 'T. Nagar', trips: 982, percentage: 60 },
                            { area: 'Anna Nagar', trips: 876, percentage: 55 },
                            { area: 'Velachery', trips: 654, percentage: 40 },
                        ].map((item) => (
                            <div key={item.area}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-600">{item.area}</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {item.trips} trips
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.percentage}%` }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                        className="h-full bg-primary-600 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
