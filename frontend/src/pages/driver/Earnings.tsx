import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    Calendar,
    Download,
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    CreditCard,
    Clock,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { formatCurrency, formatDate, formatTime } from '../../lib/utils';

// TODO: Fetch driver earnings from API
// API endpoint: GET /api/v1/driver/earnings
interface EarningsSummary {
    today: number;
    week: number;
    month: number;
    pendingPayout: number;
    lastPayout: number;
    lastPayoutDate: string;
}
const earningsSummary: EarningsSummary = {
    today: 0,
    week: 0,
    month: 0,
    pendingPayout: 0,
    lastPayout: 0,
    lastPayoutDate: '',
};

// TODO: Fetch transactions from API
// API endpoint: GET /api/v1/driver/transactions
interface Transaction {
    id: string;
    type: string;
    description: string;
    amount: number;
    date: string;
    status: string;
}
const transactions: Transaction[] = [];

// TODO: Fetch weekly breakdown from API
// API endpoint: GET /api/v1/driver/earnings/weekly
interface DayBreakdown {
    day: string;
    earnings: number;
    trips: number;
}
const weeklyBreakdown: DayBreakdown[] = [];

export function Earnings() {
    const [activeTab, setActiveTab] = useState('overview');

    const maxEarning = Math.max(...weeklyBreakdown.map((d) => d.earnings));

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Earnings</h1>
                    <p className="text-gray-500">Track your income and payouts</p>
                </div>
                <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                    Download Report
                </Button>
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
                            <p className="text-white/80 text-xs">Today</p>
                            <p className="text-xl font-bold">{formatCurrency(earningsSummary.today)}</p>
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs">This Week</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(earningsSummary.week)}</p>
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-accent-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs">This Month</p>
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
                            <p className="text-gray-500 text-xs">Pending Payout</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(earningsSummary.pendingPayout)}</p>
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
                        <TabsTrigger value="transactions">Transactions</TabsTrigger>
                        <TabsTrigger value="payouts">Payouts</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Weekly Chart */}
                            <Card padding="md">
                                <h3 className="font-semibold text-gray-900 mb-4">Weekly Earnings</h3>
                                <div className="flex items-end gap-2 h-40">
                                    {weeklyBreakdown.map((day) => (
                                        <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                                            <div
                                                className="w-full bg-primary-500 rounded-t transition-all hover:bg-primary-600"
                                                style={{ height: `${(day.earnings / maxEarning) * 100}%` }}
                                            />
                                            <span className="text-xs text-gray-500">{day.day}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Total: {formatCurrency(earningsSummary.week)}</span>
                                    <span className="text-gray-500">{weeklyBreakdown.reduce((acc, d) => acc + d.trips, 0)} trips</span>
                                </div>
                            </Card>

                            {/* Breakdown */}
                            <Card padding="md">
                                <h3 className="font-semibold text-gray-900 mb-4">Earnings Breakdown</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Trip Fares</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(16500)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Tips</span>
                                        <span className="font-medium text-success-600">+{formatCurrency(850)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Incentives & Bonuses</span>
                                        <span className="font-medium text-success-600">+{formatCurrency(1150)}</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                                        <span className="text-gray-600">Platform Fee (15%)</span>
                                        <span className="font-medium text-error-600">-{formatCurrency(2775)}</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                                        <span className="font-semibold text-gray-900">Net Earnings</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(15725)}</span>
                                    </div>
                                </div>
                            </Card>
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
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'earning' || tx.type === 'tip'
                                                ? 'bg-success-100'
                                                : tx.type === 'payout'
                                                    ? 'bg-primary-100'
                                                    : 'bg-error-100'
                                                }`}>
                                                {tx.type === 'earning' || tx.type === 'tip' ? (
                                                    <ArrowDownLeft className="w-5 h-5 text-success-600" />
                                                ) : tx.type === 'payout' ? (
                                                    <Wallet className="w-5 h-5 text-primary-600" />
                                                ) : (
                                                    <ArrowUpRight className="w-5 h-5 text-error-600" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{tx.description}</p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(tx.date)} at {formatTime(tx.date)}
                                                </p>
                                            </div>
                                            <p className={`font-semibold ${tx.type === 'deduction' || tx.type === 'payout'
                                                ? 'text-gray-900'
                                                : 'text-success-600'
                                                }`}>
                                                {tx.type === 'deduction' ? '-' : tx.type === 'payout' ? '' : '+'}
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
                                            {formatCurrency(earningsSummary.pendingPayout)}
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
                                        <p className="text-sm text-gray-500">Savings Account</p>
                                    </div>
                                    <Button variant="outline" size="sm">Change</Button>
                                </div>
                            </Card>

                            <Card padding="md">
                                <h3 className="font-semibold text-gray-900 mb-4">Payout History</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium text-gray-900">{formatCurrency(15000)}</p>
                                            <p className="text-sm text-gray-500">Dec 5, 2025</p>
                                        </div>
                                        <Badge variant="success">Completed</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium text-gray-900">{formatCurrency(18500)}</p>
                                            <p className="text-sm text-gray-500">Nov 28, 2025</p>
                                        </div>
                                        <Badge variant="success">Completed</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium text-gray-900">{formatCurrency(12800)}</p>
                                            <p className="text-sm text-gray-500">Nov 21, 2025</p>
                                        </div>
                                        <Badge variant="success">Completed</Badge>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                </TabsRoot>
            </motion.div>
        </div>
    );
}
