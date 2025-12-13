import { useState, useEffect, useCallback } from 'react';
import { ownerService, type Contract, type CreateContractDto } from '@/services/owner.service';

// Initial form state for new contract
export const initialNewContract: CreateContractDto = {
    type: 'driver',
    title: '',
    partyName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    commission: 15,
    monthlyTarget: 50000,
};

export function useContracts() {
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

    const fetchContracts = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchContracts();
    }, [fetchContracts]);

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
            const newEndDate = new Date();
            newEndDate.setFullYear(newEndDate.getFullYear() + 1);
            const updated = await ownerService.renewContract(id, newEndDate.toISOString());
            setContracts((prev) => prev.map((c) => (c.id === id ? updated : c)));
            setSelectedContract(null);
        } catch (err) {
            console.error('Error renewing contract:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCreateContract = async () => {
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
    };

    const handleCloseNewContractModal = (open: boolean) => {
        setShowNewContractModal(open);
        if (!open) {
            setNewContract(initialNewContract);
            setCreateError(null);
        }
    };

    const updateNewContract = <K extends keyof CreateContractDto>(field: K, value: CreateContractDto[K]) => {
        setNewContract(prev => ({ ...prev, [field]: value }));
    };

    // Stats
    const activeContracts = contracts.filter(c => c.status === 'active').length;
    const expiringContracts = contracts.filter(c => c.status === 'expiring').length;
    const expiredContracts = contracts.filter(c => c.status === 'expired').length;
    const contractsByType = {
        driver: contracts.filter(c => c.type === 'driver').length,
        platform: contracts.filter(c => c.type === 'platform').length,
        insurance: contracts.filter(c => c.type === 'insurance').length,
    };

    return {
        // State
        activeTab,
        searchQuery,
        statusFilter,
        selectedContract,
        showNewContractModal,
        contracts: filteredContracts,
        allContracts: contracts,
        isLoading,
        error,
        isProcessing,
        newContract,
        isCreating,
        createError,
        // Stats
        stats: { activeContracts, expiringContracts, expiredContracts, contractsByType, total: contracts.length },
        // Actions
        setActiveTab,
        setSearchQuery,
        setStatusFilter,
        setSelectedContract,
        setShowNewContractModal,
        handleTerminateContract,
        handleRenewContract,
        handleCreateContract,
        handleCloseNewContractModal,
        updateNewContract,
    };
}
