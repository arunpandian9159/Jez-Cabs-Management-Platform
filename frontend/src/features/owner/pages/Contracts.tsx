import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loading';
import { useContracts } from '../hooks/useContracts';
import {
  ContractsHeader,
  ContractsList,
  ContractDetailsModal,
  AddContractModal,
} from '../components/contracts';

export function Contracts() {
  const {
    activeTab,
    searchQuery,
    statusFilter,
    selectedContract,
    showNewContractModal,
    contracts,
    isLoading,
    error,
    isProcessing,
    newContract,
    isCreating,
    createError,
    stats,
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
  } = useContracts();

  if (isLoading) {
    return <PageLoader message="Loading contracts..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-error-500 mx-auto mb-4" />
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
      <ContractsHeader
        stats={stats}
        onAddNew={() => setShowNewContractModal(true)}
      />

      <ContractsList
        contracts={contracts}
        activeTab={activeTab}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        stats={stats}
        onTabChange={setActiveTab}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onContractSelect={setSelectedContract}
      />

      <ContractDetailsModal
        contract={selectedContract}
        isProcessing={isProcessing}
        onClose={() => setSelectedContract(null)}
        onRenew={handleRenewContract}
        onTerminate={handleTerminateContract}
      />

      <AddContractModal
        open={showNewContractModal}
        contract={newContract}
        isCreating={isCreating}
        createError={createError}
        onOpenChange={handleCloseNewContractModal}
        onFieldChange={updateNewContract}
        onSubmit={handleCreateContract}
      />
    </div>
  );
}
