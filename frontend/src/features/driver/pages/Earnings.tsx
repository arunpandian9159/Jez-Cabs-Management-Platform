import { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { PageLoader } from '@/components/ui/Loading';
import { formatCurrency, formatDate, formatTime } from '@/shared/utils';
import { driverService } from '@/services';

// Types for earnings display
interface EarningsSummaryDisplay {
    today: number;
    week: number;
    month: number;
    pendingPayout: number;
    lastPayout: number;
    lastPayoutDate: string;
}

interface TransactionDisplay {
    id: string;
    type: string;
    description: string;
    amount: number;
    date: string;
    status: string;
}

interface DayBreakdownDisplay {
    day: string;
    earnings: number;
    trips: number;
}

export function Earnings() {
    const [activeTab, setActiveTab] = useState('overview');
    const [earningsSummary, setEarningsSummary] = useState<EarningsSummaryDisplay>({
        today: 0,
        week: 0,
        month: 0,
        pendingPayout: 0,
        lastPayout: 0,
        lastPayoutDate: '',
    });
    const [transactions, setTransactions] = useState<TransactionDisplay[]>([]);
    const [weeklyBreakdown, setWeeklyBreakdown] = useState<DayBreakdownDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch earnings data on mount
    useEffect(() => {
        const fetchEarningsData = async () => {
            try {
                setIsLoading(true);

                const earnings = await driverService.getEarnings();

                // Set summary with proper number parsing
                setEarningsSummary({
                    today: Number(earnings.today) || 0,
                    week: Number(earnings.thisWeek) || 0,
                    month: Number(earnings.thisMonth) || 0,
                    pendingPayout: 0, // This should come from a payout endpoint
                    lastPayout: 0,
                    lastPayoutDate: '',
                });

                // Set transactions with null check
                const formattedTxns: TransactionDisplay[] = (earnings.transactions || []).map(t => ({
                    id: t.id,
                    type: t.type,
                    description: t.description,
                    amount: t.amount,
                    date: t.created_at,
                    status: 'completed',
                }));
                setTransactions(formattedTxns);

                // Set weekly breakdown with null check and number parsing
                const formattedBreakdown: DayBreakdownDisplay[] = (earnings.weeklyBreakdown || []).map(d => ({
                    day: d.day,
                    earnings: Number(d.earnings) || 0,
                    trips: Number(d.trips) || 0,
                }));
                setWeeklyBreakdown(formattedBreakdown);
            } catch (error) {
                console.error('Error fetching earnings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEarningsData();
    }, []);

    const maxEarning = Math.max(...weeklyBreakdown.map((d) => d.earnings), 1);

    if (isLoading) {
        return <PageLoader message="Loading earnings..." />;
    }

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
                        <div className="space-y-4">
                            {/* Weekly Chart - Full Width */}
                            <Card padding="md">
                                <h3 className="font-semibold text-gray-900 mb-4">Weekly Earnings</h3>
                                <div className="flex items-end gap-2 h-48">
                                    {weeklyBreakdown.map((day) => (
                                        <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                                            <div className="relative w-full group">
                                                <div
                                                    className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t transition-all hover:from-primary-700 hover:to-primary-500"
                                                    style={{ height: `${(day.earnings / maxEarning) * 100}%`, minHeight: day.earnings > 0 ? '8px' : '0' }}
                                                />
                                                {/* Tooltip on hover */}
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                    {formatCurrency(day.earnings)}
                                                    <div className="text-gray-300">{day.trips} trips</div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1">{day.day}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Total: {formatCurrency(earningsSummary.week)}</span>
                                    <span className="text-gray-500">{weeklyBreakdown.reduce((acc, d) => acc + d.trips, 0)} trips</span>
                                </div>
                            </Card>

                            {/* Performance Insights Grid */}
                            <div className="grid md:grid-cols-3 gap-4">
                                {/* Avg per Trip */}
                                <Card padding="md" className="border-l-4 border-primary-500">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Avg per Trip</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {weeklyBreakdown.reduce((acc, d) => acc + d.trips, 0) > 0
                                                    ? formatCurrency(earningsSummary.week / weeklyBreakdown.reduce((acc, d) => acc + d.trips, 0))
                                                    : formatCurrency(0)}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-primary-600" />
                                        </div>
                                    </div>
                                </Card>

                                {/* Avg per Day */}
                                <Card padding="md" className="border-l-4 border-accent-500">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Avg per Day</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {formatCurrency(earningsSummary.week / 7)}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-accent-600" />
                                        </div>
                                    </div>
                                </Card>

                                {/* Best Day */}
                                <Card padding="md" className="border-l-4 border-success-500">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Best Day</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {(() => {
                                                    if (weeklyBreakdown.length === 0) return 'N/A';
                                                    const bestDay = weeklyBreakdown.reduce((max, day) =>
                                                        day.earnings > max.earnings ? day : max
                                                    );
                                                    return bestDay?.day || 'N/A';
                                                })()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {weeklyBreakdown.length > 0
                                                    ? formatCurrency(Math.max(...weeklyBreakdown.map(d => d.earnings)))
                                                    : formatCurrency(0)}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center">
                                            <DollarSign className="w-6 h-6 text-success-600" />
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Earning Trend */}
                            <Card padding="md" className="bg-gradient-to-br from-primary-50 to-accent-50">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Earnings Trend</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            You're earning well this week! Keep up the great work.
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">vs Last Week</p>
                                                <p className="text-lg font-semibold text-success-600 flex items-center gap-1">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                    +15%
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">vs Last Month</p>
                                                <p className="text-lg font-semibold text-success-600 flex items-center gap-1">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                    +8%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                                        <TrendingUp className="w-8 h-8 text-success-600" />
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
