import { motion, AnimatePresence } from 'framer-motion';
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
  Target,
  Receipt,
  Plus,
  FileText,
  Trash2,
  Fuel,
  Wrench,
  Shield,
  FileCheck,
  BarChart3,
  CheckCircle2,
  Calendar,
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
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Loading';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, formatDate } from '@/shared/utils';
import { useOwnerEarnings } from '../hooks/useOwnerEarnings';
import { type CreateExpenseDto, type CreateGoalDto } from '@/services/owner.service';
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
    // New features
    driverEarnings,
    expenses,
    goals,
    totalExpenses,
    netProfit,
    // Expense modal
    showAddExpenseModal,
    newExpense,
    isCreatingExpense,
    expenseError,
    // Goal modal
    showAddGoalModal,
    newGoal,
    isCreatingGoal,
    goalError,
    // Export
    isExporting,
    // Actions
    setActiveTab,
    setDateFilter,
    setShowAddExpenseModal,
    setShowAddGoalModal,
    updateNewExpense,
    updateNewGoal,
    handleAddExpense,
    handleDeleteExpense,
    handleAddGoal,
    handleDeleteGoal,
    handleExport,
  } = useOwnerEarnings();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fuel':
        return <Fuel className="w-5 h-5 text-warning-600" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-primary-600" />;
      case 'insurance':
        return <Shield className="w-5 h-5 text-success-600" />;
      case 'taxes':
        return <FileCheck className="w-5 h-5 text-error-600" />;
      case 'toll':
        return <Receipt className="w-5 h-5 text-accent-600" />;
      default:
        return <Receipt className="w-5 h-5 text-gray-600" />;
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'primary';
      case 'ahead':
        return 'success';
      case 'behind':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

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
        subtitle="Track revenue, expenses, and analytics"
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
            <Button
              variant="outline"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => handleExport('csv')}
              loading={isExporting}
            >
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
        className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4"
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
                <p className="text-white/80 text-[10px] sm:text-xs font-medium">Revenue</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                  {formatCurrency(earningsSummary.month)}
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
          <Card padding="sm" className="bg-error-100 border-transparent overflow-hidden relative h-full sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-error-500 to-error-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-600 text-[10px] sm:text-xs font-medium">Expenses</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-error-700 truncate">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-error-500 to-error-600 opacity-20 blur-xl" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="h-full"
        >
          <Card padding="sm" className="bg-primary-100 border-transparent overflow-hidden relative h-full sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-600 text-[10px] sm:text-xs font-medium">Profit</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary-700 truncate">
                  {formatCurrency(netProfit)}
                </p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 opacity-20 blur-xl" />
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
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="h-full hidden sm:block col-span-2 md:col-span-1"
        >
          <Card padding="sm" className="bg-accent-100 border-transparent overflow-hidden relative h-full sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Car className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-600 text-[10px] sm:text-xs font-medium">Trips</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-accent-700">
                  {cabEarnings.reduce((sum, cab) => sum + cab.trips, 0)}
                </p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 opacity-20 blur-xl" />
          </Card>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10"
      >
        <TabsRoot value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap gap-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-3">
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="by-driver" className="text-xs sm:text-sm px-2 sm:px-3">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">By Driver</span>
            </TabsTrigger>
            <TabsTrigger value="by-cab" className="text-xs sm:text-sm px-2 sm:px-3">
              <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Vehicle</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs sm:text-sm px-2 sm:px-3">
              <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="text-xs sm:text-sm px-2 sm:px-3">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs sm:text-sm px-2 sm:px-3">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Txns</span>
            </TabsTrigger>
            <TabsTrigger value="payouts" className="text-xs sm:text-sm px-2 sm:px-3">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Payouts</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-3 sm:mt-4">
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
                      <span className="text-gray-600">Expenses</span>
                    </div>
                    <span className="font-medium text-error-600">
                      -{formatCurrency(totalExpenses)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent-500 to-accent-600" />
                      <span className="text-gray-600">Driver Payments</span>
                    </div>
                    <span className="font-medium text-accent-600">
                      -{formatCurrency(earningsSummary.month * 0.7)}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      Net Profit
                    </span>
                    <span className="font-bold text-success-600 text-lg">
                      {formatCurrency(netProfit)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* By Driver Tab */}
          <TabsContent value="by-driver" className="mt-3 sm:mt-4">
            <div className="space-y-2 sm:space-y-3">
              {driverEarnings.map((driver, index) => (
                <motion.div
                  key={driver.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.005 }}
                >
                  <Card padding="sm" interactive className="hover:shadow-lg transition-all sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <Avatar size="md" name={driver.driverName} className="sm:w-12 sm:h-12" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-xs sm:text-base truncate">
                          {driver.driverName}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] sm:text-sm text-gray-500">
                          <span className="truncate">{driver.driverPhone}</span>
                          {driver.vehicleAssigned && (
                            <span className="hidden sm:flex items-center gap-1">
                              <Car className="w-3 h-3" />
                              {driver.vehicleAssigned}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Trips - hidden on mobile */}
                      <div className="hidden sm:block text-center px-3 py-2 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500">Trips</p>
                        <p className="font-bold text-gray-900">{driver.trips}</p>
                      </div>
                      {/* Commission - hidden on mobile */}
                      <div className="hidden md:block text-center px-3 py-2 bg-accent-50 rounded-xl">
                        <p className="text-sm text-accent-600">Commission</p>
                        <p className="font-bold text-accent-700">
                          {formatCurrency(driver.commission)}
                        </p>
                      </div>
                      <div className="text-right min-w-[70px] sm:min-w-[120px]">
                        <p className="font-bold text-gray-900 text-xs sm:text-lg">
                          {formatCurrency(driver.thisMonthEarnings)}
                        </p>
                        <div
                          className={`flex items-center justify-end gap-0.5 sm:gap-1 text-[10px] sm:text-sm ${driver.growth >= 0 ? 'text-success-600' : 'text-error-600'}`}
                        >
                          {driver.growth >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownLeft className="w-3 h-3" />
                          )}
                          <span className="font-medium">{Math.abs(driver.growth)}%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* By Vehicle Tab */}
          <TabsContent value="by-cab" className="mt-3 sm:mt-4">
            <div className="space-y-2 sm:space-y-3">
              {cabEarnings.map((cab, index) => (
                <motion.div
                  key={cab.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.005 }}
                >
                  <Card padding="sm" interactive className="hover:shadow-lg transition-all sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <Car className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-xs sm:text-base truncate">
                          {cab.vehicle}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] sm:text-sm text-gray-500">
                          <span>{cab.registration}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">{cab.driver}</span>
                        </div>
                      </div>
                      {/* Trips - hidden on mobile */}
                      <div className="hidden sm:block text-center px-3 py-2 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500">Trips</p>
                        <p className="font-bold text-gray-900">
                          {cab.trips}
                        </p>
                      </div>
                      <div className="text-right min-w-[70px] sm:min-w-[120px]">
                        <p className="font-bold text-gray-900 text-xs sm:text-lg">
                          {formatCurrency(cab.thisMonth)}
                        </p>
                        <div
                          className={`flex items-center justify-end gap-0.5 sm:gap-1 text-[10px] sm:text-sm ${cab.growth >= 0 ? 'text-success-600' : 'text-error-600'}`}
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

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="mt-3 sm:mt-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Expenses</h3>
                <Button
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowAddExpenseModal(true)}
                  className="text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Add Expense</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>

              {/* Expense Categories Summary */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                {['fuel', 'maintenance', 'insurance', 'taxes', 'toll', 'other'].map((category) => {
                  const categoryTotal = expenses
                    .filter(e => e.category === category)
                    .reduce((sum, e) => sum + e.amount, 0);
                  return (
                    <Card key={category} padding="sm" className="text-center">
                      <div className="flex justify-center mb-1 sm:mb-2">
                        {getCategoryIcon(category)}
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 capitalize truncate">{category}</p>
                      <p className="font-bold text-gray-900 text-xs sm:text-base truncate">{formatCurrency(categoryTotal)}</p>
                    </Card>
                  );
                })}
              </div>

              {/* Expense List */}
              <Card padding="sm" className="sm:p-4">
                <h4 className="font-medium text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Recent</h4>
                <div className="space-y-2 sm:space-y-3">
                  {expenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-xs sm:text-base truncate">{expense.description}</p>
                          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-gray-500">
                            <span className="capitalize">{expense.category}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">{formatDate(expense.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                        <p className="font-bold text-error-600 text-xs sm:text-base">-{formatCurrency(expense.amount)}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="h-7 w-7 sm:h-8 sm:w-8"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-error-600" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Earnings Goals</h3>
                <Button
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowAddGoalModal(true)}
                >
                  Set Goal
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {goals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card padding="lg" className="relative overflow-hidden">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Badge variant={getGoalStatusColor(goal.status) as 'success' | 'warning' | 'primary' | 'default'} className="capitalize mb-2">
                            {goal.status.replace('_', ' ')}
                          </Badge>
                          <h4 className="font-semibold text-gray-900 capitalize">
                            {goal.type} Goal
                          </h4>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>

                      <div className="flex items-end justify-between mb-2">
                        <div>
                          <p className="text-sm text-gray-500">Progress</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(goal.currentAmount)}
                          </p>
                        </div>
                        <p className="text-gray-500">
                          of {formatCurrency(goal.targetAmount)}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(goal.progress, 100)}%` }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className={`h-full rounded-full ${goal.status === 'ahead' || goal.status === 'completed'
                            ? 'bg-gradient-to-r from-success-400 to-success-500'
                            : goal.status === 'behind'
                              ? 'bg-gradient-to-r from-warning-400 to-warning-500'
                              : 'bg-gradient-to-r from-primary-400 to-primary-500'
                            }`}
                        />
                      </div>
                      <p className="text-right text-sm text-gray-500 mt-1">{goal.progress}%</p>

                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
                        </span>
                      </div>

                      {/* Background decoration */}
                      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 opacity-50 blur-2xl" />
                    </Card>
                  </motion.div>
                ))}

                {goals.length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No goals set yet. Set your first earnings goal!</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-3 sm:mt-4">
            <div className="space-y-2 sm:space-y-3">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card padding="sm" interactive className="hover:shadow-md transition-all sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${tx.type === 'earning' ? 'bg-gradient-to-br from-success-500 to-success-600' : tx.type === 'payout' ? 'bg-gradient-to-br from-primary-500 to-primary-600' : tx.type === 'settlement' ? 'bg-gradient-to-br from-accent-500 to-accent-600' : 'bg-gradient-to-br from-error-500 to-error-600'}`}
                      >
                        {tx.type === 'earning' ? (
                          <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        ) : tx.type === 'payout' ? (
                          <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        ) : tx.type === 'settlement' ? (
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-xs sm:text-base truncate">
                          {tx.description}
                        </p>
                        <p className="text-[10px] sm:text-sm text-gray-500">
                          {formatDate(tx.date)}
                        </p>
                      </div>
                      <p
                        className={`font-bold text-xs sm:text-lg flex-shrink-0 ${tx.type === 'earning' ? 'text-success-600' : 'text-gray-900'}`}
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

          {/* Payouts Tab */}
          <TabsContent value="payouts" className="mt-3 sm:mt-4">
            <div className="space-y-3 sm:space-y-4">
              <Card padding="md" className="bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white overflow-hidden relative sm:p-6">
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-white/80 text-[10px] sm:text-sm mb-0.5 sm:mb-1">Next Payout</p>
                    <p className="text-xl sm:text-3xl font-bold">
                      {formatCurrency(earningsSummary.pendingSettlements)}
                    </p>
                    <p className="text-white/70 text-[10px] sm:text-sm mt-0.5 sm:mt-1">
                      Est: Dec 12, 2025
                    </p>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Wallet className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              </Card>
              <Card padding="sm" className="sm:p-4">
                <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                  Payment Method
                </h3>
                <div className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div className="w-10 h-8 sm:w-12 sm:h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-xs sm:text-base truncate">
                      HDFC Bank ••••4567
                    </p>
                    <p className="text-[10px] sm:text-sm text-gray-500">Current Account</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    Change
                  </Button>
                </div>
              </Card>
              <Card padding="sm" className="sm:p-4">
                <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                  Payout History
                </h3>
                <div className="space-y-2 sm:space-y-3">
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
                      className="flex items-center justify-between p-2 sm:p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-xs sm:text-base">
                          {formatCurrency(payout.amount)}
                        </p>
                        <p className="text-[10px] sm:text-sm text-gray-500">{payout.date}</p>
                      </div>
                      <Badge variant="success" className="text-[10px] sm:text-xs">
                        <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                        Done
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </TabsRoot>
      </motion.div>

      {/* Add Expense Modal */}
      <Modal
        open={showAddExpenseModal}
        onOpenChange={setShowAddExpenseModal}
        title="Add Expense"
        description="Track your fleet expenses"
        size="md"
      >
        <div className="space-y-4">
          <AnimatePresence>
            {expenseError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm"
              >
                {expenseError}
              </motion.div>
            )}
          </AnimatePresence>

          <Select
            label="Category *"
            options={[
              { value: 'fuel', label: 'Fuel' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'insurance', label: 'Insurance' },
              { value: 'taxes', label: 'Taxes' },
              { value: 'toll', label: 'Toll' },
              { value: 'other', label: 'Other' },
            ]}
            value={newExpense.category}
            onValueChange={(value) => updateNewExpense('category', value as CreateExpenseDto['category'])}
          />

          <Input
            label="Description *"
            placeholder="e.g., Monthly fuel for Innova"
            value={newExpense.description}
            onChange={(e) => updateNewExpense('description', e.target.value)}
          />

          <Input
            label="Amount (₹) *"
            type="number"
            placeholder="5000"
            value={newExpense.amount.toString()}
            onChange={(e) => updateNewExpense('amount', parseInt(e.target.value) || 0)}
          />

          <Input
            label="Date *"
            type="date"
            value={newExpense.date}
            onChange={(e) => updateNewExpense('date', e.target.value)}
          />

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowAddExpenseModal(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleAddExpense}
              loading={isCreatingExpense}
            >
              Add Expense
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Goal Modal */}
      <Modal
        open={showAddGoalModal}
        onOpenChange={setShowAddGoalModal}
        title="Set Earnings Goal"
        description="Define your earnings target"
        size="md"
      >
        <div className="space-y-4">
          <AnimatePresence>
            {goalError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm"
              >
                {goalError}
              </motion.div>
            )}
          </AnimatePresence>

          <Select
            label="Goal Period *"
            options={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
            value={newGoal.type}
            onValueChange={(value) => updateNewGoal('type', value as CreateGoalDto['type'])}
          />

          <Input
            label="Target Amount (₹) *"
            type="number"
            placeholder="100000"
            value={newGoal.targetAmount.toString()}
            onChange={(e) => updateNewGoal('targetAmount', parseInt(e.target.value) || 0)}
          />

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowAddGoalModal(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleAddGoal}
              loading={isCreatingGoal}
            >
              Set Goal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
