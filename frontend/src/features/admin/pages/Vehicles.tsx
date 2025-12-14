import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, Car, User, Calendar, Fuel, Users, Wrench, Edit, Trash2, CheckCircle, AlertCircle, Gauge, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/shared/utils';
import { useAdminVehicles, typeOptions, statusOptions, statusBadgeVariants, typeBadgeVariants, typeColors } from '../hooks/useAdminVehicles';
import { AdminPageHeader, AdminTableWrapper, tableStyles } from '../components';

const StatusBadge = ({ status }: { status: string }) => <Badge variant={statusBadgeVariants[status] || 'secondary'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
const TypeBadge = ({ type }: { type: string }) => <Badge variant={typeBadgeVariants[type] || 'secondary'}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;

export function AdminVehicles() {
    const { searchQuery, typeFilter, statusFilter, selectedVehicle, showActionMenu, filteredVehicles, sedanCount, suvCount, hatchbackCount, luxuryCount, totalCount, activeCount, maintenanceCount, inactiveCount, setSearchQuery, setTypeFilter, setStatusFilter, setSelectedVehicle, toggleActionMenu, closeModal } = useAdminVehicles();

    return (
        <div className="space-y-6">
            <AdminPageHeader title="Vehicle Management" subtitle="Manage fleet vehicles, maintenance, and assignments" icon={Car} iconColor="accent" action={<Button leftIcon={<Plus className="w-5 h-5" />}>Add Vehicle</Button>} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4">
                {[{ label: 'Sedans', value: sedanCount, type: 'sedan' as const }, { label: 'SUVs', value: suvCount, type: 'suv' as const }, { label: 'Hatchbacks', value: hatchbackCount, type: 'hatchback' as const }, { label: 'Luxury', value: luxuryCount, type: 'luxury' as const }].map((item, index) => (
                    <motion.div key={item.type} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.1 + index * 0.05 }} whileHover={{ scale: 1.02 }}>
                        <Card padding="md" className={`bg-gradient-to-br ${typeColors[item.type].bg} border-transparent overflow-hidden relative`}>
                            <div className="flex items-center justify-between">
                                <div><p className="text-sm font-medium text-gray-600 mb-1">{item.label}</p><p className={`text-3xl font-bold ${typeColors[item.type].text}`}>{item.value}</p></div>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColors[item.type].gradient} flex items-center justify-center shadow-lg`}><Car className="w-6 h-6 text-white" /></div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex items-center gap-4 p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-xl">
                <div className="flex items-center gap-4 text-sm">
                    {[{ color: 'from-success-400 to-success-600', label: 'Active', value: activeCount }, { color: 'from-warning-400 to-warning-600', label: 'Maintenance', value: maintenanceCount }, { color: 'from-gray-300 to-gray-500', label: 'Inactive', value: inactiveCount }].map(({ color, label, value }) => (
                        <span key={label} className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full bg-gradient-to-r ${color} shadow-sm`}></span><span className="font-medium">{label}: {value}</span></span>
                    ))}
                    <span className="text-gray-300">|</span><span className="font-bold text-gray-900">Total: {totalCount}</span>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-4">
                <Input placeholder="Search by make, model, plate, or driver..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} prefix={<Search className="w-4 h-4" />} className="w-80" />
                <Select options={typeOptions} value={typeFilter} onValueChange={setTypeFilter} />
                <Select options={statusOptions} value={statusFilter} onValueChange={setStatusFilter} />
            </motion.div>

            <AdminTableWrapper isEmpty={filteredVehicles.length === 0} emptyState={{ icon: Car, title: 'No vehicles found', description: "Try adjusting your search or filter to find what you're looking for." }}>
                <table className={tableStyles.table}>
                    <thead className={tableStyles.thead}><tr><th className={tableStyles.th}>Vehicle</th><th className={tableStyles.th}>Type</th><th className={tableStyles.th}>Driver</th><th className={tableStyles.th}>Trips</th><th className={tableStyles.th}>Last Service</th><th className={tableStyles.th}>Status</th><th className={tableStyles.th}></th></tr></thead>
                    <tbody className={tableStyles.tbody}>
                        {filteredVehicles.map((vehicle, index) => (
                            <motion.tr key={vehicle.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className={tableStyles.tr}>
                                <td className={tableStyles.td}>
                                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedVehicle(vehicle)}>
                                        <div className={`w-10 h-10 rounded-xl ${typeColors[vehicle.type]?.bg || 'bg-gray-100'} flex items-center justify-center`}><Car className={`w-5 h-5 ${typeColors[vehicle.type]?.text || 'text-gray-600'}`} /></div>
                                        <div><p className="font-medium text-gray-900">{vehicle.make} {vehicle.model}</p><p className="text-xs text-gray-500">{vehicle.plateNumber}</p></div>
                                    </div>
                                </td>
                                <td className={tableStyles.td}><TypeBadge type={vehicle.type} /></td>
                                <td className={tableStyles.td}>{vehicle.driverName ? <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center"><User className="w-4 h-4 text-primary-600" /></div><span className="text-sm text-gray-900">{vehicle.driverName}</span></div> : <span className="text-sm text-gray-400 italic">Unassigned</span>}</td>
                                <td className={`${tableStyles.td} ${tableStyles.tdBold}`}>{vehicle.totalTrips.toLocaleString()}</td>
                                <td className={`${tableStyles.td} ${tableStyles.tdText}`}>{formatDate(vehicle.lastService)}</td>
                                <td className={tableStyles.td}><StatusBadge status={vehicle.status} /></td>
                                <td className={`${tableStyles.td} relative`}>
                                    <button onClick={() => toggleActionMenu(vehicle.id)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><MoreVertical className="w-4 h-4 text-gray-500" /></button>
                                    {showActionMenu === vehicle.id && (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="absolute right-4 top-12 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-10 min-w-[160px]">
                                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><Edit className="w-4 h-4" /> Edit</button>
                                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><Wrench className="w-4 h-4" /> Maintenance</button>
                                            {vehicle.status === 'active' ? <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-warning-600 hover:bg-warning-50"><AlertCircle className="w-4 h-4" /> Mark Inactive</button> : <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-success-600 hover:bg-success-50"><CheckCircle className="w-4 h-4" /> Activate</button>}
                                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error-600 hover:bg-error-50"><Trash2 className="w-4 h-4" /> Delete</button>
                                        </motion.div>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </AdminTableWrapper>

            <Modal open={!!selectedVehicle} onOpenChange={closeModal} title="Vehicle Details" size="md">
                {selectedVehicle && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${typeColors[selectedVehicle.type]?.gradient || 'from-gray-500 to-gray-600'} flex items-center justify-center shadow-lg`}><Car className="w-8 h-8 text-white" /></div>
                            <div><h2 className="text-xl font-semibold text-gray-900">{selectedVehicle.make} {selectedVehicle.model}</h2><div className="flex items-center gap-2 mt-1"><TypeBadge type={selectedVehicle.type} /><StatusBadge status={selectedVehicle.status} /></div></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[{ icon: Car, color: 'primary', label: 'Plate Number', value: selectedVehicle.plateNumber }, { icon: Calendar, color: 'accent', label: 'Year', value: selectedVehicle.year }, { icon: Fuel, color: 'success', label: 'Fuel Type', value: selectedVehicle.fuelType }, { icon: Users, color: 'warning', label: 'Seating Capacity', value: `${selectedVehicle.seatingCapacity} seats` }, { icon: User, color: 'primary', label: 'Assigned Driver', value: selectedVehicle.driverName || 'Not Assigned' }, { icon: Wrench, color: 'gray', label: 'Last Service', value: formatDate(selectedVehicle.lastService) }].map(({ icon: Icon, color, label, value }) => (
                                <div key={label} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"><div className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}><Icon className={`w-5 h-5 text-${color}-600`} /></div><div><p className="text-xs text-gray-500">{label}</p><p className="text-sm font-medium text-gray-900">{value}</p></div></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Card padding="md" className="text-center bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200"><div className="flex items-center justify-center gap-2 mb-1"><Gauge className="w-5 h-5 text-primary-600" /></div><p className="text-2xl font-bold text-primary-600">{selectedVehicle.totalTrips.toLocaleString()}</p><p className="text-sm text-primary-600">Total Trips</p></Card>
                            <Card padding="md" className="text-center bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200"><div className="flex items-center justify-center gap-2 mb-1"><Shield className="w-5 h-5 text-warning-600" /></div><p className="text-lg font-bold text-warning-600">{formatDate(selectedVehicle.insuranceExpiry)}</p><p className="text-sm text-warning-600">Insurance Expiry</p></Card>
                        </div>
                        <div className="flex gap-3 pt-4 border-t border-gray-100"><Button variant="outline" fullWidth>View Trips</Button><Button variant="outline" fullWidth>Maintenance Log</Button><Button fullWidth>Reassign Driver</Button></div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
