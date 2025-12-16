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
  Car,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/Tabs';
import { PageLoader } from '@/components/ui/Loading';
import { formatCurrency, formatDate, formatTime } from '@/shared/utils';
import { useDriverEarnings } from '../hooks/useDriverEarnings';
import { DriverPageHeader } from '../components/DriverPageHeader';

export function Earnings() {
  const {
    activeTab,
    earningsSummary,
    transactions,
    weeklyBreakdown,
    isLoading,
    maxEarning,
    totalWeeklyTrips,
    avgPerTrip,
    avgPerDay,
    bestDay,
    setActiveTab,
  } = useDriverEarnings();

  if (isLoading) {
    return <PageLoader message="Loading earnings..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DriverPageHeader
        title="Earnings"
        subtitle="Track your income and payouts"
        icon={DollarSign}
        iconColor="success"
        action={
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Download Report
          </Button>
        }
      />

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="h-full"
        >
          <Card
            padding="sm"
            className="bg-gradient-to-br from-success-500 via-success-600 to-success-700 text-white overflow-hidden relative h-full sm:p-4"
          >
            <div className="flex items-center gap-2 sm:gap-3 relative z-10">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white/80 text-[10px] sm:text-xs font-medium">Today</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                  {formatCurrency(earningsSummary.today)}
                </p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10 blur-2xl" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="h-full"
        >
          <Card padding="sm" className="bg-primary-100 border-transparent overflow-hidden relative h-full sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-600 text-[10px] sm:text-xs font-medium">This Week</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary-700 truncate">
                  {formatCurrency(earningsSummary.week)}
                </p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 opacity-20 blur-xl" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="h-full"
        >
          <Card padding="sm" className="bg-accent-100 border-transparent overflow-hidden relative h-full sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-600 text-[10px] sm:text-xs font-medium">This Month</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-accent-700 truncate">
                  {formatCurrency(earningsSummary.month)}
                </p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 opacity-20 blur-xl" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="h-full"
        >
          <Card padding="sm" className="bg-warning-100 border-transparent overflow-hidden relative h-full sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-600 text-[10px] sm:text-xs font-medium">Pending</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-warning-700 truncate">
                  {formatCurrency(earningsSummary.pendingPayout)}
                </p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-warning-500 to-warning-600 opacity-20 blur-xl" />
          </Card>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TabsRoot value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-1.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <DollarSign className="w-4 h-4 mr-1.5" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="payouts">
              <Wallet className="w-4 h-4 mr-1.5" />
              Payouts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="space-y-4">
              <Card padding="md" className="overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Weekly Earnings
                  </h3>
                </div>
                <div className="flex items-end gap-3 h-48">
                  {weeklyBreakdown.map((day, index) => {
                    const heightPercent =
                      maxEarning > 0 ? (day.earnings / maxEarning) * 100 : 0;
                    const minHeightPx = day.earnings > 0 ? 8 : 4;
                    return (
                      <motion.div
                        key={day.day}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ delay: 0.35 + index * 0.05 }}
                        className="flex-1 flex flex-col items-center gap-1 h-full origin-bottom"
                      >
                        <p className="text-xs font-medium text-gray-900">
                          {formatCurrency(day.earnings)}
                        </p>
                        <div className="flex-1 w-full flex items-end group">
                          <motion.div
                            whileHover={{ opacity: 0.8 }}
                            className="w-full bg-gradient-to-t from-primary-600 via-primary-500 to-accent-400 rounded-t-lg shadow-md transition-all relative"
                            style={{
                              height:
                                heightPercent > 0
                                  ? `${Math.max(heightPercent, 5)}%`
                                  : `${minHeightPx}px`,
                              minHeight: `${minHeightPx}px`,
                            }}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                              {day.trips} trips
                            </div>
                          </motion.div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium mt-1">
                          {day.day}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900 flex items-center gap-1">
                    <Car className="w-4 h-4 text-gray-400" />
                    {totalWeeklyTrips} trips
                  </span>
                  <span className="font-bold text-primary-600">
                    Total: {formatCurrency(earningsSummary.week)}
                  </span>
                </div>
              </Card>

              <div className="grid md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card padding="md" className="border-l-4 border-primary-500 h-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Avg per Trip</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(avgPerTrip)}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card padding="md" className="border-l-4 border-accent-500 h-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Avg per Day</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(avgPerDay)}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-accent-600" />
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card padding="md" className="border-l-4 border-success-500 h-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Best Day</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {bestDay?.day || 'N/A'}
                        </p>
                        <p className="text-xs text-success-600 font-medium">
                          {bestDay
                            ? formatCurrency(bestDay.earnings)
                            : formatCurrency(0)}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success-100 to-success-200 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-success-600" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              <Card
                padding="lg"
                className="bg-gradient-to-br from-primary-50 via-accent-50 to-success-50 border-0 overflow-hidden relative"
              >
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-success-600" />
                      <h3 className="font-semibold text-gray-900">
                        Earnings Trend
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      You're earning well this week! Keep up the great work.
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <p className="text-xs text-gray-500 mb-0.5">vs Last Week</p>
                        <p className="text-lg font-bold text-success-600 flex items-center gap-1">
                          <ArrowUpRight className="w-4 h-4" />
                          +15%
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <p className="text-xs text-gray-500 mb-0.5">vs Last Month</p>
                        <p className="text-lg font-bold text-success-600 flex items-center gap-1">
                          <ArrowUpRight className="w-4 h-4" />
                          +8%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-8 h-8 text-success-600" />
                  </div>
                </div>
                <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-gradient-to-br from-success-200 to-accent-200 opacity-50 blur-3xl" />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.005 }}
                >
                  <Card padding="md" interactive className="hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${tx.type === 'earning' || tx.type === 'tip' ? 'bg-gradient-to-br from-success-500 to-success-600' : tx.type === 'payout' ? 'bg-gradient-to-br from-primary-500 to-primary-600' : 'bg-gradient-to-br from-error-500 to-error-600'}`}
                      >
                        {tx.type === 'earning' || tx.type === 'tip' ? (
                          <ArrowDownLeft className="w-5 h-5 text-white" />
                        ) : tx.type === 'payout' ? (
                          <Wallet className="w-5 h-5 text-white" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-white" />
                        )}
                      </motion.div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {tx.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(tx.date)} at {formatTime(tx.date)}
                        </p>
                      </div>
                      <p
                        className={`font-bold text-lg ${tx.type === 'deduction' || tx.type === 'payout' ? 'text-gray-900' : 'text-success-600'}`}
                      >
                        {tx.type === 'deduction'
                          ? '-'
                          : tx.type === 'payout'
                            ? ''
                            : '+'}
                        {formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payouts" className="mt-4">
            <div className="space-y-4">
              <Card padding="lg" className="bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white overflow-hidden relative">
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Next Payout</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(earningsSummary.pendingPayout)}
                    </p>
                    <p className="text-white/70 text-sm mt-1">
                      Estimated: Dec 12, 2025
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Wallet className="w-8 h-8" />
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              </Card>

              <Card padding="md">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  Payment Method
                </h3>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div className="w-12 h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      HDFC Bank ••••4567
                    </p>
                    <p className="text-sm text-gray-500">Savings Account</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </Card>

              <Card padding="md">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  Payout History
                </h3>
                <div className="space-y-3">
                  {[
                    { amount: 15000, date: 'Dec 5, 2025' },
                    { amount: 18500, date: 'Nov 28, 2025' },
                    { amount: 12800, date: 'Nov 21, 2025' },
                  ].map((payout, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(payout.amount)}
                        </p>
                        <p className="text-sm text-gray-500">{payout.date}</p>
                      </div>
                      <Badge variant="success">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    </motion.div>
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
