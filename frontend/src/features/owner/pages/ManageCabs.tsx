import { PageLoader } from '@/components/ui/Loading';
import { useManageCabs } from '../hooks/useManageCabs';
import {
  CabFilters,
  CabsTable,
  CabDetailsModal,
  AddCabModal,
} from '../components/manageCabs';

export function ManageCabs() {
  const {
    searchQuery,
    statusFilter,
    selectedCab,
    cabs,
    isLoading,
    showNewCabModal,
    newCab,
    isCreating,
    createError,
    setSearchQuery,
    setStatusFilter,
    setSelectedCab,
    setShowNewCabModal,
    handleCreateCab,
    handleNewCabChange,
    handleCloseNewCabModal,
    getDocumentStatusColor,
  } = useManageCabs();

  if (isLoading) {
    return <PageLoader message="Loading cabs..." />;
  }

  return (
    <div className="space-y-6">
      <CabFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onAddNew={() => setShowNewCabModal(true)}
      />

      <CabsTable cabs={cabs} onViewDetails={setSelectedCab} />

      <CabDetailsModal
        cab={selectedCab}
        onClose={() => setSelectedCab(null)}
        getDocumentStatusColor={getDocumentStatusColor}
      />

      <AddCabModal
        open={showNewCabModal}
        onOpenChange={handleCloseNewCabModal}
        newCab={newCab}
        isCreating={isCreating}
        createError={createError}
        onFieldChange={handleNewCabChange}
        onSubmit={handleCreateCab}
      />
    </div>
  );
}
