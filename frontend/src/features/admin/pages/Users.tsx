import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    UserPlus,
    MoreVertical,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Ban,
    CheckCircle,
    Edit,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/shared/utils';
import { tripsService } from '@/services';

// Types for user display
interface UserDisplay {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    location: string;
    joinedAt: string;
    totalTrips: number;
    totalSpent: number;
}

export function AdminUsers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState<UserDisplay | null>(null);
    const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
    const [users, setUsers] = useState<UserDisplay[]>([]);
    const [_isLoading, setIsLoading] = useState(true);

    // Fetch users on mount - using trips to get user data
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                // Get unique users from trips
                const trips = await tripsService.findAll({ limit: 100 });
                const userMap = new Map<string, UserDisplay>();

                trips.forEach(trip => {
                    if (trip.customer && !userMap.has(trip.customer.id)) {
                        userMap.set(trip.customer.id, {
                            id: trip.customer.id,
                            name: `${trip.customer.first_name} ${trip.customer.last_name}`,
                            email: '',
                            phone: trip.customer.phone || '',
                            role: 'customer',
                            status: 'active',
                            location: 'Unknown',
                            joinedAt: new Date().toISOString(),
                            totalTrips: 0,
                            totalSpent: 0,
                        });
                    }
                });

                setUsers(Array.from(userMap.values()));
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery);
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="success">Active</Badge>;
            case 'suspended':
                return <Badge variant="error">Suspended</Badge>;
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">User Management</h1>
                    <p className="text-gray-500">Manage customer accounts and permissions</p>
                </div>
                <Button leftIcon={<UserPlus className="w-5 h-5" />}>
                    Add User
                </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-4 gap-4"
            >
                <Card padding="md" className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                    <p className="text-sm text-gray-500">Total Users</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-3xl font-bold text-success-600">
                        {users.filter(u => u.status === 'active').length}
                    </p>
                    <p className="text-sm text-gray-500">Active</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-3xl font-bold text-error-600">
                        {users.filter(u => u.status === 'suspended').length}
                    </p>
                    <p className="text-sm text-gray-500">Suspended</p>
                </Card>
                <Card padding="md" className="text-center">
                    <p className="text-3xl font-bold text-gray-400">
                        {users.filter(u => u.status === 'inactive').length}
                    </p>
                    <p className="text-sm text-gray-500">Inactive</p>
                </Card>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
            >
                <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    prefix={<Search className="w-4 h-4" />}
                    className="w-80"
                />
                <Select
                    options={[
                        { value: 'all', label: 'All Status' },
                        { value: 'active', label: 'Active' },
                        { value: 'suspended', label: 'Suspended' },
                        { value: 'inactive', label: 'Inactive' },
                    ]}
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                />
            </motion.div>

            {/* Users Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card padding="none">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Contact</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Location</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Trips</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                    >
                                        <td className="py-3 px-4">
                                            <div
                                                className="flex items-center gap-3 cursor-pointer"
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <Avatar size="sm" name={user.name} />
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{user.phone}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{user.location}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{formatDate(user.joinedAt)}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">{user.totalTrips}</td>
                                        <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                                        <td className="py-3 px-4 relative">
                                            <button
                                                onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                                                className="p-2 rounded-lg hover:bg-gray-100"
                                            >
                                                <MoreVertical className="w-4 h-4 text-gray-500" />
                                            </button>
                                            {showActionMenu === user.id && (
                                                <div className="absolute right-4 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[150px]">
                                                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                        <Edit className="w-4 h-4" /> Edit
                                                    </button>
                                                    {user.status === 'active' ? (
                                                        <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50">
                                                            <Ban className="w-4 h-4" /> Suspend
                                                        </button>
                                                    ) : (
                                                        <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-success-600 hover:bg-success-50">
                                                            <CheckCircle className="w-4 h-4" /> Activate
                                                        </button>
                                                    )}
                                                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50">
                                                        <Trash2 className="w-4 h-4" /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>

            {/* User Detail Modal */}
            <Modal
                open={!!selectedUser}
                onOpenChange={() => setSelectedUser(null)}
                title="User Details"
                size="md"
            >
                {selectedUser && (
                    <div className="space-y-6">
                        {/* Profile Header */}
                        <div className="flex items-center gap-4">
                            <Avatar size="xl" name={selectedUser.name} />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    {getStatusBadge(selectedUser.status)}
                                    <span className="text-sm text-gray-500 capitalize">{selectedUser.role}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="text-sm text-gray-900">{selectedUser.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Location</p>
                                    <p className="text-sm text-gray-900">{selectedUser.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Joined</p>
                                    <p className="text-sm text-gray-900">{formatDate(selectedUser.joinedAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card padding="md" className="text-center bg-primary-50">
                                <p className="text-2xl font-bold text-primary-600">{selectedUser.totalTrips}</p>
                                <p className="text-sm text-primary-600">Total Trips</p>
                            </Card>
                            <Card padding="md" className="text-center bg-success-50">
                                <p className="text-2xl font-bold text-success-600">₹{selectedUser.totalSpent.toLocaleString()}</p>
                                <p className="text-sm text-success-600">Total Spent</p>
                            </Card>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <Button variant="outline" fullWidth>
                                View Trips
                            </Button>
                            <Button variant="outline" fullWidth>
                                Send Message
                            </Button>
                            {selectedUser.status === 'active' ? (
                                <Button variant="danger" fullWidth>
                                    Suspend User
                                </Button>
                            ) : (
                                <Button fullWidth>
                                    Activate User
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
