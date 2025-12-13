import { useState, useEffect, useCallback } from 'react';
import { tripsService } from '@/services';

export interface UserDisplay {
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

export function useAdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserDisplay | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [users, setUsers] = useState<UserDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const trips = await tripsService.findAll({ limit: 100 });
      const userMap = new Map<string, UserDisplay>();

      trips.forEach((trip) => {
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
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesStatus =
      statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleActionMenu = (userId: string) => {
    setShowActionMenu(showActionMenu === userId ? null : userId);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  // Computed stats
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.status === 'active').length;
  const suspendedCount = users.filter((u) => u.status === 'suspended').length;
  const inactiveCount = users.filter((u) => u.status === 'inactive').length;

  return {
    // State
    searchQuery,
    statusFilter,
    selectedUser,
    showActionMenu,
    users,
    filteredUsers,
    isLoading,
    // Computed
    totalCount,
    activeCount,
    suspendedCount,
    inactiveCount,
    // Actions
    setSearchQuery,
    setStatusFilter,
    setSelectedUser,
    toggleActionMenu,
    closeModal,
  };
}
