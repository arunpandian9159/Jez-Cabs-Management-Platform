import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Plus,
    Search,
    CheckCircle,
    AlertCircle,
    Download,
    Eye,
    MoreVertical,
    Calendar,
    User,
    Car,
    AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Loading';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { formatCurrency, formatDate } from '@/shared/utils';
import { ownerService, type Contract, type CreateContractDto } from '@/services/owner.service';

// Initial form state for new contract
const initialNewContract: CreateContractDto = {
    type: 'driver',
    title: '',
    partyName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    commission: 15,
    monthlyTarget: 50000,
};

export function Contracts() {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [showNewContractModal, setShowNewContractModal] = useState(false);

    // API state
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // New contract form state
    const [newContract, setNewContract] = useState<CreateContractDto>(initialNewContract);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    // Fetch contracts on mount
    useEffect(() => {
        const fetchContracts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const contractsData = await ownerService.getContracts();
                setContracts(contractsData);
            } catch (err) {
                console.error('Error fetching contracts:', err);
                setError('Failed to load contracts. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchContracts();
    }, []);

    const filteredContracts = contracts.filter((contract) => {
        const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.partyName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
        const matchesTab = activeTab === 'all' || contract.type === activeTab;
        return matchesSearch && matchesStatus && matchesTab;
    });

    const handleTerminateContract = async (id: string) => {
        try {
            setIsProcessing(true);
            await ownerService.terminateContract(id);
            setContracts((prev) => prev.filter((c) => c.id !== id));
            setSelectedContract(null);
        } catch (err) {
            console.error('Error terminating contract:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRenewContract = async (id: string) => {
        try {
            setIsProcessing(true);
            // Extend by 1 year
            const newEndDate = new Date();
            newEndDate.setFullYear(newEndDate.getFullYear() + 1);
            const updated = await ownerService.renewContract(id, newEndDate.toISOString());
            setContracts((prev) =>
                prev.map((c) => (c.id === id ? updated : c))
            );
            setSelectedContract(null);
        } catch (err) {
            console.error('Error renewing contract:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="success">Active</Badge>;
            case 'expiring':
                return <Badge variant="warning">Expiring Soon</Badge>;
            case 'expired':
                return <Badge variant="error">Expired</Badge>;
            case 'pending':
                return <Badge variant="primary">Pending</Badge>;
            default:
                return null;
        }
    };

    const activeContracts = contracts.filter(c => c.status === 'active').length;
    const expiringContracts = contracts.filter(c => c.status === 'expiring').length;
    const expiredContracts = contracts.filter(c => c.status === 'expired').length;

    // Loading state
    if (isLoading) {
        return <PageLoader message="Loading contracts..." />;
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md">
                    <AlertTriangle className="w-12 h-12 text-error-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        );
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Contracts</h1>
                    <p className="text-gray-500">Manage driver agreements and partnerships</p>
                </div>
                <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setShowNewContractModal(true)}>
                    New Contract
                </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4"
            >
                <Card padding="md" className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <CheckCircle className="w-5 h-5 text-success-600" />
                        <span className="text-2xl font-bold text-gray-900">{activeContracts}</span>
                    </div>
                    <p className="text-sm text-gray-500">Active Contracts</p>
                </Card>
                <Card padding="md" className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <AlertCircle className="w-5 h-5 text-warning-600" />
                        <span className="text-2xl font-bold text-warning-600">{expiringContracts}</span>
                    </div>
                    <p className="text-sm text-gray-500">Expiring Soon</p>
                </Card>
                <Card padding="md" className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <AlertCircle className="w-5 h-5 text-error-600" />
                        <span className="text-2xl font-bold text-error-600">{expiredContracts}</span>
                    </div>
                    <p className="text-sm text-gray-500">Expired</p>
                </Card>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <TabsRoot value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex items-center justify-between mb-4">
                        <TabsList>
                            <TabsTrigger value="all">All ({contracts.length})</TabsTrigger>
                            <TabsTrigger value="driver">Driver ({contracts.filter(c => c.type === 'driver').length})</TabsTrigger>
                            <TabsTrigger value="platform">Platform ({contracts.filter(c => c.type === 'platform').length})</TabsTrigger>
                            <TabsTrigger value="insurance">Insurance ({contracts.filter(c => c.type === 'insurance').length})</TabsTrigger>
                        </TabsList>

                        <div className="flex gap-3">
                            <Input
                                placeholder="Search contracts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                prefix={<Search className="w-4 h-4" />}
                                className="w-64"
                            />
                            <Select
                                options={[
                                    { value: 'all', label: 'All Status' },
                                    { value: 'active', label: 'Active' },
                                    { value: 'expiring', label: 'Expiring' },
                                    { value: 'expired', label: 'Expired' },
                                ]}
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            />
                        </div>
                    </div>

                    <TabsContent value={activeTab}>
                        <div className="space-y-3">
                            {filteredContracts.map((contract, index) => (
                                <motion.div
                                    key={contract.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card padding="md" interactive onClick={() => setSelectedContract(contract)}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${contract.type === 'driver' ? 'bg-primary-100' :
                                                contract.type === 'platform' ? 'bg-accent-100' :
                                                    'bg-success-100'
                                                }`}>
                                                {contract.type === 'driver' ? (
                                                    <User className="w-6 h-6 text-primary-600" />
                                                ) : contract.type === 'platform' ? (
                                                    <FileText className="w-6 h-6 text-accent-600" />
                                                ) : (
                                                    <Car className="w-6 h-6 text-success-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium text-gray-900">{contract.title}</p>
                                                    {getStatusBadge(contract.status)}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <span>{contract.partyName}</span>
                                                    <span>•</span>
                                                    <span>{contract.vehicleAssigned}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
                                                </div>
                                                {contract.commission && (
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {contract.commission}% commission
                                                    </p>
                                                )}
                                            </div>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                <MoreVertical className="w-5 h-5 text-gray-400" />
                                            </button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                </TabsRoot>
            </motion.div>

            {/* Contract Details Modal */}
            <Modal
                open={!!selectedContract}
                onOpenChange={() => setSelectedContract(null)}
                title="Contract Details"
                size="lg"
            >
                {selectedContract && (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-start gap-4">
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${selectedContract.type === 'driver' ? 'bg-primary-100' :
                                selectedContract.type === 'platform' ? 'bg-accent-100' :
                                    'bg-success-100'
                                }`}>
                                {selectedContract.type === 'driver' ? (
                                    <User className="w-8 h-8 text-primary-600" />
                                ) : selectedContract.type === 'platform' ? (
                                    <FileText className="w-8 h-8 text-accent-600" />
                                ) : (
                                    <Car className="w-8 h-8 text-success-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{selectedContract.title}</h3>
                                    {getStatusBadge(selectedContract.status)}
                                </div>
                                <p className="text-gray-500">{selectedContract.partyName}</p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Start Date</p>
                                <p className="font-medium text-gray-900">{formatDate(selectedContract.startDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">End Date</p>
                                <p className="font-medium text-gray-900">{formatDate(selectedContract.endDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Vehicle Assigned</p>
                                <p className="font-medium text-gray-900">{selectedContract.vehicleAssigned}</p>
                            </div>
                            {selectedContract.commission && (
                                <div>
                                    <p className="text-sm text-gray-500">Commission Rate</p>
                                    <p className="font-medium text-gray-900">{selectedContract.commission}%</p>
                                </div>
                            )}
                            {(selectedContract.monthlyTarget ?? 0) > 0 && (
                                <div>
                                    <p className="text-sm text-gray-500">Monthly Target</p>
                                    <p className="font-medium text-gray-900">{formatCurrency(selectedContract.monthlyTarget ?? 0)}</p>
                                </div>
                            )}
                        </div>

                        {/* Documents */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Attached Documents</h4>
                            <div className="space-y-2">
                                {selectedContract.documents.map((doc) => (
                                    <div key={doc} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-900">{doc}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                                                View
                                            </Button>
                                            <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <Button variant="outline" fullWidth disabled={isProcessing}>
                                Edit Contract
                            </Button>
                            {selectedContract.status === 'expiring' && (
                                <Button
                                    fullWidth
                                    onClick={() => handleRenewContract(selectedContract.id)}
                                    disabled={isProcessing}
                                    loading={isProcessing}
                                >
                                    Renew Contract
                                </Button>
                            )}
                            {selectedContract.status === 'active' && (
                                <Button
                                    variant="danger"
                                    fullWidth
                                    onClick={() => handleTerminateContract(selectedContract.id)}
                                    disabled={isProcessing}
                                    loading={isProcessing}
                                >
                                    Terminate Contract
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* New Contract Modal */}
            <Modal
                open={showNewContractModal}
                onOpenChange={(open) => {
                    setShowNewContractModal(open);
                    if (!open) {
                        setNewContract(initialNewContract);
                        setCreateError(null);
                    }
                }}
                title="Create New Contract"
                size="lg"
            >
                <div className="space-y-4">
                    {createError && (
                        <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
                            {createError}
                        </div>
                    )}

                    <Select
                        label="Contract Type *"
                        options={[
                            { value: 'driver', label: 'Driver Agreement' },
                            { value: 'platform', label: 'Platform Partnership' },
                            { value: 'insurance', label: 'Insurance Policy' },
                        ]}
                        value={newContract.type}
                        onValueChange={(value) => setNewContract(prev => ({ ...prev, type: value as 'driver' | 'platform' | 'insurance' }))}
                    />

                    <Input
                        label="Contract Title *"
                        placeholder="e.g., Driver Employment Agreement"
                        value={newContract.title}
                        onChange={(e) => setNewContract(prev => ({ ...prev, title: e.target.value }))}
                    />

                    <Input
                        label="Party Name *"
                        placeholder="e.g., John Doe"
                        value={newContract.partyName}
                        onChange={(e) => setNewContract(prev => ({ ...prev, partyName: e.target.value }))}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Start Date *"
                            type="date"
                            value={newContract.startDate}
                            onChange={(e) => setNewContract(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                        <Input
                            label="End Date *"
                            type="date"
                            value={newContract.endDate}
                            onChange={(e) => setNewContract(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                    </div>

                    {newContract.type === 'driver' && (
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Commission Rate (%)"
                                type="number"
                                placeholder="15"
                                value={newContract.commission?.toString() || ''}
                                onChange={(e) => setNewContract(prev => ({ ...prev, commission: parseInt(e.target.value) || 0 }))}
                            />
                            <Input
                                label="Monthly Target (₹)"
                                type="number"
                                placeholder="50000"
                                value={newContract.monthlyTarget?.toString() || ''}
                                onChange={(e) => setNewContract(prev => ({ ...prev, monthlyTarget: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                    )}

                    {newContract.type === 'insurance' && (
                        <Input
                            label="Premium Amount (₹)"
                            type="number"
                            placeholder="25000"
                            value={newContract.premium?.toString() || ''}
                            onChange={(e) => setNewContract(prev => ({ ...prev, premium: parseInt(e.target.value) || 0 }))}
                        />
                    )}

                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => {
                                setShowNewContractModal(false);
                                setNewContract(initialNewContract);
                                setCreateError(null);
                            }}
                            disabled={isCreating}
                        >
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            onClick={async () => {
                                if (!newContract.title || !newContract.partyName) {
                                    setCreateError('Please fill in all required fields');
                                    return;
                                }
                                try {
                                    setIsCreating(true);
                                    setCreateError(null);
                                    const created = await ownerService.createContract(newContract);
                                    setContracts(prev => [...prev, created]);
                                    setShowNewContractModal(false);
                                    setNewContract(initialNewContract);
                                } catch (err) {
                                    console.error('Error creating contract:', err);
                                    setCreateError('Failed to create contract. Please try again.');
                                } finally {
                                    setIsCreating(false);
                                }
                            }}
                            loading={isCreating}
                            disabled={isCreating}
                        >
                            Create Contract
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
