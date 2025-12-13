import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Star,
    Phone,
    MessageSquare,
    Mail,
    MoreVertical,
    Car,
    AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Loading';
import { formatCurrency } from '@/shared/utils';
import { useManageDrivers } from '../hooks/useManageDrivers';

export function ManageDrivers() {
    const {
        searchQuery,
        statusFilter,
        selectedDriver,
        drivers,
        isLoading,
        error,
        showAddDriverModal,
        newDriver,
        isInviting,
        inviteError,
        inviteSuccess,
        stats,
        setSearchQuery,
        setStatusFilter,
        setSelectedDriver,
        setShowAddDriverModal,
        handleInviteDriver,
        handleCloseAddDriverModal,
        updateNewDriver,
    } = useManageDrivers();

    if (isLoading) {
        return <PageLoader message="Loading drivers..." />;
    }

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
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Drivers</h1>
                    <p className="text-gray-500">View and manage your driver team</p>
                </div>
                <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setShowAddDriverModal(true)}>
                    Add Driver
                </Button>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4">
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-sm text-gray-500">Total Drivers</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-success-600">{stats.active}</p>
                    <p className="text-sm text-gray-500">Active</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
                    <p className="text-sm text-gray-500">Inactive</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-2xl font-bold text-warning-600">{stats.pending}</p>
                    <p className="text-sm text-gray-500">Pending</p>
                </Card>
            </motion.div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card padding="md">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input placeholder="Search by name or phone..." prefix={<Search className="w-4 h-4" />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <Select options={[{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'pending', label: 'Pending' }]} value={statusFilter} onValueChange={setStatusFilter} />
                    </div>
                </Card>
            </motion.div>

            {/* Drivers List */}
            <div className="space-y-3">
                {drivers.map((driver, index) => (
                    <motion.div key={driver.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + index * 0.05 }}>
                        <Card padding="md" interactive onClick={() => setSelectedDriver(driver)}>
                            <div className="flex items-center gap-4">
                                <Avatar size="lg" name={driver.name} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                                        <StatusBadge status={driver.status} />
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{driver.phone}</span>
                                        {driver.cab && (<><span>•</span><span className="flex items-center gap-1"><Car className="w-3 h-3" />{driver.cab.make} {driver.cab.model}</span></>)}
                                    </div>
                                </div>
                                {driver.status === 'active' && (
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-center"><div className="flex items-center gap-1 justify-center"><Star className="w-4 h-4 text-warning-500 fill-warning-500" /><span className="font-semibold">{driver.metrics.rating}</span></div><p className="text-xs text-gray-500">Rating</p></div>
                                        <div className="text-center"><p className="font-semibold">{driver.metrics.totalTrips}</p><p className="text-xs text-gray-500">Trips</p></div>
                                        <div className="text-center"><p className="font-semibold text-success-600">{formatCurrency(driver.metrics.thisMonthEarnings)}</p><p className="text-xs text-gray-500">This Month</p></div>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon"><Phone className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon"><MessageSquare className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Driver Details Modal */}
            <Modal open={!!selectedDriver} onOpenChange={() => setSelectedDriver(null)} title={selectedDriver?.name || ''} size="md">
                {selectedDriver && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar size="xl" name={selectedDriver.name} />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{selectedDriver.name}</h3>
                                <p className="text-gray-500">{selectedDriver.phone}</p>
                                <p className="text-sm text-gray-400">{selectedDriver.email}</p>
                            </div>
                        </div>
                        {selectedDriver.cab ? (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500 mb-2">Assigned Vehicle</p>
                                <div className="flex items-center gap-3">
                                    <Car className="w-5 h-5 text-gray-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">{selectedDriver.cab.make} {selectedDriver.cab.model}</p>
                                        <p className="text-sm text-gray-500">{selectedDriver.cab.registrationNumber}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-warning-50 rounded-lg text-center">
                                <p className="text-warning-700">No vehicle assigned</p>
                                <Button variant="outline" size="sm" className="mt-2">Assign Vehicle</Button>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Acceptance Rate</p><p className="text-xl font-bold text-gray-900">{selectedDriver.metrics.acceptanceRate}%</p></div>
                            <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Completion Rate</p><p className="text-xl font-bold text-gray-900">{selectedDriver.metrics.completionRate}%</p></div>
                            <div className="p-3 bg-success-50 rounded-lg"><p className="text-sm text-success-600">Total Earnings</p><p className="text-xl font-bold text-success-900">{formatCurrency(selectedDriver.metrics.totalEarnings)}</p></div>
                            <div className="p-3 bg-primary-50 rounded-lg"><p className="text-sm text-primary-600">Total Trips</p><p className="text-xl font-bold text-primary-900">{selectedDriver.metrics.totalTrips}</p></div>
                        </div>
                        <div className="flex gap-3 pt-4 border-t">
                            <Button variant="outline" fullWidth leftIcon={<Phone className="w-4 h-4" />}>Call</Button>
                            <Button variant="outline" fullWidth leftIcon={<Mail className="w-4 h-4" />}>Email</Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add Driver Modal */}
            <Modal open={showAddDriverModal} onOpenChange={handleCloseAddDriverModal} title="Invite New Driver" size="md">
                <div className="space-y-4">
                    {inviteError && <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">{inviteError}</div>}
                    {inviteSuccess && <div className="p-3 bg-success-50 border border-success-200 rounded-lg text-success-700 text-sm">Invitation sent successfully! The driver will receive an email with instructions to join.</div>}
                    {!inviteSuccess && (
                        <>
                            <p className="text-gray-500 text-sm">Enter the driver's details below to send them an invitation to join your fleet.</p>
                            <Input label="Full Name *" placeholder="e.g., John Doe" value={newDriver.name} onChange={(e) => updateNewDriver('name', e.target.value)} />
                            <Input label="Phone Number *" placeholder="e.g., 9876543210" value={newDriver.phone} onChange={(e) => updateNewDriver('phone', e.target.value)} />
                            <Input label="Email Address *" type="email" placeholder="e.g., driver@example.com" value={newDriver.email} onChange={(e) => updateNewDriver('email', e.target.value)} />
                        </>
                    )}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button variant="outline" fullWidth onClick={() => handleCloseAddDriverModal(false)}>{inviteSuccess ? 'Close' : 'Cancel'}</Button>
                        {!inviteSuccess && <Button fullWidth onClick={handleInviteDriver} loading={isInviting} disabled={isInviting}>Send Invitation</Button>}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
