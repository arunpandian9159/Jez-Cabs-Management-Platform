import { motion } from 'framer-motion';
import {
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Search,
  Wallet,
  CreditCard,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
  ChevronRight,
  Star,
  Zap,
  Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate, cn } from '@/shared/utils';
import {
  usePayments,
  type TransactionDisplay,
  type PaymentMethodDisplay,
} from '../hooks/usePayments';

export function Payments() {
  const {
    activeTab,
    showAddCard,
    searchQuery,
    paymentMethods,
    walletBalance,
    paymentStats,
    pendingTransactions,
    completedTransactions,
    setActiveTab,
    setShowAddCard,
    setSearchQuery,
  } = usePayments();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Header Section */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Animated background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
          }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-30" />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-10 left-20 w-24 h-24 bg-pink-400/20 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative p-4 sm:p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
            {/* Left side - Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-violet-200" />
                </motion.div>
                <span className="text-white/80 text-xs sm:text-sm font-medium">
                  Your Wallet
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                Payments & Wallet
              </h1>
              <p className="text-white/70 text-sm sm:text-base md:text-lg">
                Manage your payments and transactions
              </p>
            </div>

            {/* Right side - Wallet Balance Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:flex-shrink-0"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 min-w-0 sm:min-w-[280px] md:min-w-[320px]">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs sm:text-sm">Available Balance</p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                        {formatCurrency(walletBalance)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] sm:text-xs font-medium">
                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    +12%
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    size="sm"
                    className="bg-white text-violet-600 hover:bg-white/90 flex-1 text-xs sm:text-sm"
                    leftIcon={<Plus className="w-3 h-3 sm:w-4 sm:h-4" />}
                  >
                    <span className="hidden sm:inline">Add Money</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 flex-1 text-xs sm:text-sm"
                    leftIcon={<ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Pending Amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 border-l-4 border-warning-400 shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 sm:mb-2">
                    Pending
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    {formatCurrency(
                      pendingTransactions.reduce((acc, tx) => acc + tx.amount, 0)
                    )}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-warning-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-warning-500" />
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500">
                {pendingTransactions.length} pending
              </p>
            </div>
          </motion.div>

          {/* Total Spent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 border-l-4 border-violet-400 shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 sm:mb-2">
                    This Month
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    {formatCurrency(paymentStats.thisMonth)}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-violet-500" />
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500">Total payments</p>
            </div>
          </motion.div>

          {/* Refunds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 border-l-4 border-emerald-400 shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 sm:mb-2">
                    Refunds
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    {formatCurrency(
                      completedTransactions
                        .filter((tx) => tx.type === 'refund')
                        .reduce((acc, tx) => acc + tx.amount, 0)
                    )}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-500" />
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500">Total refunds</p>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative group"
          >
            <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 border-l-4 border-blue-400 shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 sm:mb-2">
                    Methods
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    {paymentMethods.length}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500" />
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500">Cards & UPI</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm overflow-hidden">
          <TabsRoot value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 border-b border-gray-100 bg-gray-50/50">
              <TabsList className="bg-gray-100/80 flex-wrap">
                <TabsTrigger value="transactions" className="data-[state=active]:bg-white text-[10px] sm:text-xs md:text-sm px-2 sm:px-3">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Transactions</span>
                </TabsTrigger>
                <TabsTrigger value="methods" className="data-[state=active]:bg-white text-[10px] sm:text-xs md:text-sm px-2 sm:px-3">
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Payment Methods</span>
                  <span className="sm:hidden">Methods</span>
                </TabsTrigger>
              </TabsList>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="border-violet-200 text-violet-600 hover:border-violet-300 hover:bg-violet-50 text-[10px] sm:text-xs md:text-sm"
              >
                <span className="hidden sm:inline">Download Statement</span>
                <span className="sm:hidden">Download</span>
              </Button>
            </div>

            <TabsContent value="transactions" className="p-0">
              {/* Search Bar */}
              <div className="p-5 border-b border-gray-100">
                <div className="relative max-w-md">
                  <Input
                    placeholder="Search transactions..."
                    prefix={<Search className="w-4 h-4 text-gray-400" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Pending Transactions */}
              {pendingTransactions.length > 0 && (
                <PendingSection transactions={pendingTransactions} />
              )}

              {/* Transaction History */}
              <HistorySection transactions={completedTransactions} />
            </TabsContent>

            <TabsContent value="methods" className="p-0">
              <MethodsSection
                methods={paymentMethods}
                onAddNew={() => setShowAddCard(true)}
              />
            </TabsContent>
          </TabsRoot>
        </Card>
      </motion.div>

      {/* Add Card Modal */}
      <Modal
        open={showAddCard}
        onOpenChange={setShowAddCard}
        title="Add Payment Method"
        size="sm"
      >
        <div className="space-y-5">
          {/* Card Type Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-violet-500 bg-violet-50 text-violet-600 font-medium">
              💳 Credit/Debit Card
            </button>
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-medium transition-colors">
              📱 UPI
            </button>
          </div>

          <Input label="Card Number" placeholder="1234 5678 9012 3456" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Expiry" placeholder="MM/YY" />
            <Input label="CVV" placeholder="123" type="password" />
          </div>
          <Input label="Name on Card" placeholder="John Doe" />

          <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span className="text-sm text-emerald-700">
              Your card details are secure and encrypted
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowAddCard(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={() => setShowAddCard(false)}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
            >
              Add Card
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

function PendingSection({
  transactions,
}: {
  transactions: TransactionDisplay[];
}) {
  return (
    <div className="p-3 sm:p-5 border-b border-gray-100">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <div className="w-2 h-2 rounded-full bg-warning-500 animate-pulse" />
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Pending Payments
        </h3>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {transactions.map((tx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-warning-50 to-orange-50 rounded-xl p-3 sm:p-4 border border-warning-200"
          >
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-warning-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-warning-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-xs sm:text-base truncate">{tx.description}</p>
                <p className="text-[10px] sm:text-sm text-gray-500 truncate">
                  Due: {formatDate(tx.date)} • {tx.paymentMethod}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm sm:text-lg font-bold text-gray-900">
                  {formatCurrency(tx.amount)}
                </p>
                <StatusBadge status="pending" />
              </div>
              <Button size="sm" className="bg-warning-500 hover:bg-warning-600 text-xs sm:text-sm px-2 sm:px-3">
                Pay
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function HistorySection({
  transactions,
}: {
  transactions: TransactionDisplay[];
}) {
  return (
    <div className="p-3 sm:p-5">
      <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 sm:mb-4">
        Transaction History
      </h3>
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 sm:mb-4">
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-1 sm:space-y-2">
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group"
            >
              <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                <div
                  className={cn(
                    'w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                    tx.type === 'payment'
                      ? 'bg-gradient-to-br from-red-100 to-orange-100'
                      : 'bg-gradient-to-br from-emerald-100 to-teal-100'
                  )}
                >
                  {tx.type === 'payment' ? (
                    <ArrowUpRight className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate text-xs sm:text-base">
                    {tx.description}
                  </p>
                  <p className="text-[10px] sm:text-sm text-gray-500 truncate">
                    {formatDate(tx.date)} • {tx.paymentMethod}
                  </p>
                </div>
                <p
                  className={cn(
                    'text-sm sm:text-lg font-bold flex-shrink-0',
                    tx.type === 'payment' ? 'text-gray-900' : 'text-emerald-600'
                  )}
                >
                  {tx.type === 'refund' ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </p>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 hidden sm:block" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function MethodsSection({
  methods,
  onAddNew,
}: {
  methods: PaymentMethodDisplay[];
  onAddNew: () => void;
}) {
  return (
    <div className="p-5 space-y-6">
      {/* Cards & UPI Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Cards & UPI</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={onAddNew}
            className="border-violet-200 text-violet-600 hover:border-violet-300 hover:bg-violet-50"
          >
            Add New
          </Button>
        </div>

        {methods.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-violet-500" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">No payment methods</h4>
            <p className="text-gray-500 mb-4">Add a card or UPI to make payments faster</p>
            <Button
              onClick={onAddNew}
              leftIcon={<Plus className="w-4 h-4" />}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
            >
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {methods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300">
                  <div
                    className={cn(
                      'w-14 h-10 rounded-lg flex items-center justify-center text-xl',
                      method.type === 'card'
                        ? 'bg-gradient-to-br from-violet-500 to-purple-600'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    )}
                  >
                    {method.type === 'card' ? '💳' : '📱'}
                  </div>
                  <div className="flex-1">
                    {method.type === 'card' ? (
                      <>
                        <p className="font-semibold text-gray-900">
                          {method.brand} •••• {method.last4}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expires {method.expiry}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-gray-900">UPI</p>
                        <p className="text-sm text-gray-500">{method.upiId}</p>
                      </>
                    )}
                  </div>
                  {method.isDefault && (
                    <Badge variant="success" size="sm" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Default
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Rewards Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-200/50 p-5">
        <div className="absolute top-2 right-2">
          <Badge className="bg-violet-500 text-white border-0">
            <Gift className="w-3 h-3 mr-1" />
            Rewards
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Star className="w-7 h-7 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Earn 2% cashback on all rides!
            </h4>
            <p className="text-sm text-gray-600">
              Link your preferred payment method to earn rewards on every transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
