import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    Download,
    Car,
    Users,
    Wallet,
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Select } from '../../components/ui/Select';
import { formatCurrency, formatDate } from '../../lib/utils';

// Mock earnings data
const earningsSummary = {
    today: 7500,
    week: 52000,
    month: 215000,
    totalRevenue: 2850000,
    pendingSettlements: 45000,
    platformFee: 32250,
    netEarnings: 182750,
};

const cabEarnings = [
    {
        id: 'c1',
        vehicle: 'Maruti Swift Dzire',
        registration: 'KA 01 AB 1234',
        driver: 'Rajesh K.',
        thisMonth: 42500,
        lastMonth: 38000,
        trips: 156,
        growth: 12,
    },
    {
        id: 'c2',
        vehicle: 'Hyundai Creta',
        registration: 'KA 01 CD 5678',
        driver: 'Suresh M.',
        thisMonth: 58000,
        lastMonth: 52000,
        trips: 89,
        growth: 11,
    },
    {
        id: 'c3',
        vehicle: 'Toyota Innova Crysta',
        registration: 'KA 05 EF 9012',
        driver: 'Under Maintenance',
        thisMonth: 0,
        lastMonth: 45000,
        trips: 0,
        growth: -100,
    },
    {
        id: 'c4',
        vehicle: 'Honda City',
        registration: 'KA 09 GH 3456',
        driver: 'Mahesh R.',
        thisMonth: 38500,
        lastMonth: 35000,
        trips: 112,
        growth: 10,
    },
];

const transactions = [
    {
        id: 'tx1',
        type: 'earning',
        description: 'Daily earnings - 4 cabs',
        amount: 7500,
        date: '2025-12-10',
        status: 'completed',
    },
    {
        id: 'tx2',
        type: 'payout',
        description: 'Weekly payout - Bank Transfer',
        amount: 45000,
        date: '2025-12-05',
        status: 'completed',
    },
    {
        id: 'tx3',
        type: 'deduction',
        description: 'Platform Fee (15%)',
        amount: 6750,
        date: '2025-12-05',
        status: 'completed',
    },
    {
        id: 'tx4',
        type: 'settlement',
        description: 'Driver settlement - Rajesh K.',
        amount: 12500,
        date: '2025-12-05',
        status: 'completed',
    },
    {
        id: 'tx5',
        type: 'earning',
        description: 'Daily earnings - 4 cabs',
        amount: 8200,
        date: '2025-12-09',
        status: 'completed',
    },
];

const monthlyData = [
    { month: 'Jul', earnings: 180000 },
    { month: 'Aug', earnings: 195000 },
    { month: 'Sep', earnings: 188000 },
    { month: 'Oct', earnings: 210000 },
    { month: 'Nov', earnings: 225000 },
    { month: 'Dec', earnings: 215000 },
];

export function OwnerEarnings() {
    const [activeTab, setActiveTab] = useState('overview');
    const [dateFilter, setDateFilter] = useState('month');

    const maxEarning = Math.max(...monthlyData.map((d) => d.earnings));

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Fleet Earnings</h1>
                    <p className="text-gray-500">Track revenue across your fleet</p>
                </div>
                <div className="flex gap-3">
                    <Select
                        options={[
                            { value: 'week', label: 'This Week' },
                            { value: 'month', label: 'This Month' },
                            { value: 'quarter', label: 'This Quarter' },
                            { value: 'year', label: 'This Year' },
                        ]}
                        value={dateFilter}
                        onValueChange={setDateFilter}
                    />
                    <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                        Export
                    </Button>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <Card padding="md" className="bg-gradient-to-br from-success-500 to-success-600 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-white/80 text-xs">Net Earnings</p>
                            <p className="text-xl font-bold">{formatCurrency(earningsSummary.netEarnings)}</p>
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs">Gross Revenue</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(earningsSummary.month)}</p>
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-warning-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs">Pending Settlements</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(earningsSummary.pendingSettlements)}</p>
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-error-100 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-error-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs">Platform Fees</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(earningsSummary.platformFee)}</p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <TabsRoot value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="by-cab">By Vehicle</TabsTrigger>
                        <TabsTrigger value="transactions">Transactions</TabsTrigger>
                        <TabsTrigger value="payouts">Payouts</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Monthly Chart */}
                            <Card padding="md">
                                <h3 className="font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
                                <div className="flex items-end gap-3 h-48">
                                    {monthlyData.map((month) => (
                                        <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                                            <p className="text-xs font-medium text-gray-900">
                                                {formatCurrency(month.earnings / 1000)}K
                                            </p>
                                            <div
                                                className="w-full bg-gradient-to-t from-primary-500 to-accent-500 rounded-t transition-all hover:opacity-80"
                                                style={{ height: `${(month.earnings / maxEarning) * 100}%` }}
                                            />
                                            <span className="text-xs text-gray-500">{month.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Revenue Breakdown */}
                            <Card padding="md">
                                <h3 className="font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-success-500" />
                                            <span className="text-gray-600">Gross Revenue</span>
                                        </div>
                                        <span className="font-medium text-gray-900">{formatCurrency(earningsSummary.month)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-error-500" />
                                            <span className="text-gray-600">Platform Fee (15%)</span>
                                        </div>
                                        <span className="font-medium text-error-600">-{formatCurrency(earningsSummary.platformFee)}</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                                        <span className="font-semibold text-gray-900">Net Earnings</span>
                                        <span className="font-bold text-success-600">{formatCurrency(earningsSummary.netEarnings)}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* By Vehicle Tab */}
                    <TabsContent value="by-cab" className="mt-4">
                        <div className="space-y-3">
                            {cabEarnings.map((cab, index) => (
                                <motion.div
                                    key={cab.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card padding="md" interactive>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                                                <Car className="w-6 h-6 text-primary-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900">{cab.vehicle}</p>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span>{cab.registration}</span>
                                                    <span>•</span>
                                                    <span>{cab.driver}</span>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-500">Trips</p>
                                                <p className="font-semibold text-gray-900">{cab.trips}</p>
                                            </div>
                                            <div className="text-right min-w-[120px]">
                                                <p className="font-bold text-gray-900">{formatCurrency(cab.thisMonth)}</p>
                                                <div className={`flex items-center justify-end gap-1 text-sm ${cab.growth >= 0 ? 'text-success-600' : 'text-error-600'
                                                    }`}>
                                                    {cab.growth >= 0 ? (
                                                        <ArrowUpRight className="w-3 h-3" />
                                                    ) : (
                                                        <ArrowDownLeft className="w-3 h-3" />
                                                    )}
                                                    <span>{Math.abs(cab.growth)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Transactions Tab */}
                    <TabsContent value="transactions" className="mt-4">
                        <div className="space-y-3">
                            {transactions.map((tx, index) => (
                                <motion.div
                                    key={tx.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <Card padding="md" interactive>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'earning' ? 'bg-success-100' :
                                                tx.type === 'payout' ? 'bg-primary-100' :
                                                    tx.type === 'settlement' ? 'bg-accent-100' :
                                                        'bg-error-100'
                                                }`}>
                                                {tx.type === 'earning' ? (
                                                    <ArrowDownLeft className="w-5 h-5 text-success-600" />
                                                ) : tx.type === 'payout' ? (
                                                    <Wallet className="w-5 h-5 text-primary-600" />
                                                ) : tx.type === 'settlement' ? (
                                                    <Users className="w-5 h-5 text-accent-600" />
                                                ) : (
                                                    <ArrowUpRight className="w-5 h-5 text-error-600" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{tx.description}</p>
                                                <p className="text-sm text-gray-500">{formatDate(tx.date)}</p>
                                            </div>
                                            <p className={`font-semibold ${tx.type === 'earning' ? 'text-success-600' :
                                                tx.type === 'deduction' || tx.type === 'settlement' ? 'text-gray-900' :
                                                    'text-gray-900'
                                                }`}>
                                                {tx.type === 'deduction' || tx.type === 'settlement' ? '-' :
                                                    tx.type === 'earning' ? '+' : ''}
                                                {formatCurrency(tx.amount)}
                                            </p>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Payouts Tab */}
                    <TabsContent value="payouts" className="mt-4">
                        <div className="space-y-4">
                            <Card padding="lg" className="bg-primary-50 border-primary-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-primary-600 mb-1">Next Payout</p>
                                        <p className="text-2xl font-bold text-primary-900">
                                            {formatCurrency(earningsSummary.pendingSettlements)}
                                        </p>
                                        <p className="text-sm text-primary-600 mt-1">
                                            Estimated: Dec 12, 2025
                                        </p>
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                                        <Wallet className="w-8 h-8 text-primary-600" />
                                    </div>
                                </div>
                            </Card>

                            <Card padding="md">
                                <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-12 h-8 rounded bg-gray-200 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">HDFC Bank ••••4567</p>
                                        <p className="text-sm text-gray-500">Current Account</p>
                                    </div>
                                    <Button variant="outline" size="sm">Change</Button>
                                </div>
                            </Card>

                            <Card padding="md">
                                <h3 className="font-semibold text-gray-900 mb-4">Payout History</h3>
                                <div className="space-y-3">
                                    {[
                                        { amount: 45000, date: 'Dec 5, 2025' },
                                        { amount: 52000, date: 'Nov 28, 2025' },
                                        { amount: 48500, date: 'Nov 21, 2025' },
                                    ].map((payout, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                                            <div>
                                                <p className="font-medium text-gray-900">{formatCurrency(payout.amount)}</p>
                                                <p className="text-sm text-gray-500">{payout.date}</p>
                                            </div>
                                            <Badge variant="success">Completed</Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                </TabsRoot>
            </motion.div>
        </div>
    );
}
