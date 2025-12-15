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
  AlertTriangle,
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
import { Select } from '@/components/ui/Select';
import { PageLoader } from '@/components/ui/Loading';
import { formatCurrency, formatDate } from '@/shared/utils';
import { useOwnerEarnings } from '../hooks/useOwnerEarnings';
import { OwnerPageHeader } from '../components/OwnerPageHeader';

export function OwnerEarnings() {
  const {
    activeTab,
    dateFilter,
    earningsSummary,
    cabEarnings,
    transactions,
    monthlyData,
    maxEarning,
    isLoading,
    error,
    setActiveTab,
    setDateFilter,
  } = useOwnerEarnings();

  if (isLoading) {
    return <PageLoader message="Loading earnings data..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-error-100 to-error-200 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-error-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OwnerPageHeader
        title="Fleet Earnings"
        subtitle="Track revenue across your fleet"
        icon={DollarSign}
        iconColor="success"
        action={
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
        }
      />

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card
            padding="md"
            className="bg-gradient-to-br from-success-500 via-success-600 to-success-700 text-white overflow-hidden relative"
          >
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/80 text-xs font-medium">Net Earnings</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(earningsSummary.netEarnings)}
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
        >
          <Card padding="md" className="bg-primary-100 border-transparent overflow-hidden relative">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Gross Revenue</p>
                <p className="text-2xl font-bold text-primary-700">
                  {formatCurrency(earningsSummary.month)}
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
        >
          <Card padding="md" className="bg-warning-100 border-transparent overflow-hidden relative">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Pending Settlements</p>
                <p className="text-2xl font-bold text-warning-700">
                  {formatCurrency(earningsSummary.pendingSettlements)}
                </p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-warning-500 to-warning-600 opacity-20 blur-xl" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card padding="md" className="bg-error-100 border-transparent overflow-hidden relative">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-error-500 to-error-600 flex items-center justify-center shadow-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Platform Fees</p>
                <p className="text-2xl font-bold text-error-700">
                  {formatCurrency(earningsSummary.platformFee)}
                </p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-error-500 to-error-600 opacity-20 blur-xl" />
          </Card>
        </motion.div>
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

          <TabsContent value="overview" className="mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card padding="md" className="overflow-hidden">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  Monthly Revenue
                </h3>
                <div className="flex items-end gap-3 h-48">
                  {monthlyData.map((month, index) => {
                    const heightPercent =
                      maxEarning > 0 ? (month.earnings / maxEarning) * 100 : 0;
                    const minHeightPx = month.earnings > 0 ? 8 : 4;
                    return (
                      <motion.div
                        key={month.month}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="flex-1 flex flex-col items-center gap-1 h-full origin-bottom"
                      >
                        <p className="text-xs font-medium text-gray-900">
                          {month.earnings >= 1000
                            ? `${formatCurrency(month.earnings / 1000)}K`
                            : formatCurrency(month.earnings)}
                        </p>
                        <div className="flex-1 w-full flex items-end">
                          <motion.div
                            whileHover={{ opacity: 0.8 }}
                            className="w-full bg-gradient-to-t from-primary-600 via-primary-500 to-accent-400 rounded-t-lg shadow-md transition-all"
                            style={{
                              height:
                                heightPercent > 0
                                  ? `${Math.max(heightPercent, 5)}%`
                                  : `${minHeightPx}px`,
                              minHeight: `${minHeightPx}px`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {month.month}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
              <Card padding="md">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-success-600" />
                  Revenue Breakdown
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-success-500 to-success-600" />
                      <span className="text-gray-600">Gross Revenue</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(earningsSummary.month)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-error-500 to-error-600" />
                      <span className="text-gray-600">Platform Fee (15%)</span>
                    </div>
                    <span className="font-medium text-error-600">
                      -{formatCurrency(earningsSummary.platformFee)}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      Net Earnings
                    </span>
                    <span className="font-bold text-success-600 text-lg">
                      {formatCurrency(earningsSummary.netEarnings)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="by-cab" className="mt-4">
            <div className="space-y-3">
              {cabEarnings.map((cab, index) => (
                <motion.div
                  key={cab.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.005 }}
                >
                  <Card padding="md" interactive className="hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">
                          {cab.vehicle}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{cab.registration}</span>
                          <span>•</span>
                          <span>{cab.driver}</span>
                        </div>
                      </div>
                      <div className="text-center px-3 py-2 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500">Trips</p>
                        <p className="font-bold text-gray-900">
                          {cab.trips}
                        </p>
                      </div>
                      <div className="text-right min-w-[120px]">
                        <p className="font-bold text-gray-900 text-lg">
                          {formatCurrency(cab.thisMonth)}
                        </p>
                        <div
                          className={`flex items-center justify-end gap-1 text-sm ${cab.growth >= 0 ? 'text-success-600' : 'text-error-600'}`}
                        >
                          {cab.growth >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownLeft className="w-3 h-3" />
                          )}
                          <span className="font-medium">{Math.abs(cab.growth)}%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
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
                >
                  <Card padding="md" interactive className="hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${tx.type === 'earning' ? 'bg-gradient-to-br from-success-500 to-success-600' : tx.type === 'payout' ? 'bg-gradient-to-br from-primary-500 to-primary-600' : tx.type === 'settlement' ? 'bg-gradient-to-br from-accent-500 to-accent-600' : 'bg-gradient-to-br from-error-500 to-error-600'}`}
                      >
                        {tx.type === 'earning' ? (
                          <ArrowDownLeft className="w-5 h-5 text-white" />
                        ) : tx.type === 'payout' ? (
                          <Wallet className="w-5 h-5 text-white" />
                        ) : tx.type === 'settlement' ? (
                          <Users className="w-5 h-5 text-white" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {tx.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(tx.date)}
                        </p>
                      </div>
                      <p
                        className={`font-bold text-lg ${tx.type === 'earning' ? 'text-success-600' : 'text-gray-900'}`}
                      >
                        {tx.type === 'deduction' || tx.type === 'settlement'
                          ? '-'
                          : tx.type === 'earning'
                            ? '+'
                            : ''}
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
                      {formatCurrency(earningsSummary.pendingSettlements)}
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
                <h3 className="font-semibold text-gray-900 mb-4">
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
                    <p className="text-sm text-gray-500">Current Account</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </Card>
              <Card padding="md">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Payout History
                </h3>
                <div className="space-y-3">
                  {[
                    { amount: 45000, date: 'Dec 5, 2025' },
                    { amount: 52000, date: 'Nov 28, 2025' },
                    { amount: 48500, date: 'Nov 21, 2025' },
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
                      <Badge variant="success">Completed</Badge>
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
