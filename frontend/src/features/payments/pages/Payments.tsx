import { motion } from 'framer-motion';
import {
  Plus,
  Check,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Search,
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
import { formatCurrency, formatDate, formatTime } from '@/shared/utils';
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
    pendingTransactions,
    completedTransactions,
    setActiveTab,
    setShowAddCard,
    setSearchQuery,
  } = usePayments();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Payments</h1>
          <p className="text-gray-500">
            Manage your payment methods and transactions
          </p>
        </div>
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
          Download Statement
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card
          padding="lg"
          className="bg-gradient-to-br from-primary-500 to-accent-500 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Wallet Balance</p>
              <p className="text-3xl font-bold">
                {formatCurrency(walletBalance)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                Add Money
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Withdraw
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TabsRoot value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions" className="mt-4">
            <div className="mb-4">
              <Input
                placeholder="Search transactions..."
                prefix={<Search className="w-4 h-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {pendingTransactions.length > 0 && (
              <PendingSection transactions={pendingTransactions} />
            )}
            <HistorySection transactions={completedTransactions} />
          </TabsContent>
          <TabsContent value="methods" className="mt-4">
            <MethodsSection
              methods={paymentMethods}
              onAddNew={() => setShowAddCard(true)}
            />
          </TabsContent>
        </TabsRoot>
      </motion.div>

      <Modal
        open={showAddCard}
        onOpenChange={setShowAddCard}
        title="Add Payment Method"
        size="sm"
      >
        <div className="space-y-4">
          <Input label="Card Number" placeholder="1234 5678 9012 3456" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Expiry" placeholder="MM/YY" />
            <Input label="CVV" placeholder="123" type="password" />
          </div>
          <Input label="Name on Card" placeholder="John Doe" />
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowAddCard(false)}
            >
              Cancel
            </Button>
            <Button fullWidth onClick={() => setShowAddCard(false)}>
              Add Card
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PendingSection({
  transactions,
}: {
  transactions: TransactionDisplay[];
}) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
        Pending
      </h3>
      <div className="space-y-2">
        {transactions.map((tx) => (
          <Card
            key={tx.id}
            padding="md"
            className="bg-warning-50 border-warning-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-warning-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{tx.description}</p>
                <p className="text-sm text-gray-500">
                  Due: {formatDate(tx.date)} • {tx.paymentMethod}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(tx.amount)}
                </p>
                <StatusBadge status="pending" />
              </div>
            </div>
          </Card>
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
    <>
      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
        History
      </h3>
      <div className="space-y-2">
        {transactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card padding="md" interactive>
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'payment' ? 'bg-error-100' : 'bg-success-100'}`}
                >
                  {tx.type === 'payment' ? (
                    <ArrowUpRight className="w-5 h-5 text-error-600" />
                  ) : (
                    <ArrowDownLeft className="w-5 h-5 text-success-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{tx.description}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(tx.date)} at {formatTime(tx.date)} •{' '}
                    {tx.paymentMethod}
                  </p>
                </div>
                <p
                  className={`font-semibold ${tx.type === 'payment' ? 'text-gray-900' : 'text-success-600'}`}
                >
                  {tx.type === 'refund' ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
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
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Cards & UPI</h3>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={onAddNew}
          >
            Add New
          </Button>
        </div>
        <div className="space-y-2">
          {methods.map((method) => (
            <Card key={method.id} padding="md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 rounded bg-gray-100 flex items-center justify-center text-lg">
                  {method.type === 'card' ? '💳' : '📱'}
                </div>
                <div className="flex-1">
                  {method.type === 'card' ? (
                    <>
                      <p className="font-medium text-gray-900">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires {method.expiry}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-gray-900">UPI</p>
                      <p className="text-sm text-gray-500">{method.upiId}</p>
                    </>
                  )}
                </div>
                {method.isDefault && (
                  <Badge variant="success" size="sm">
                    <Check className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                )}
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-error-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
