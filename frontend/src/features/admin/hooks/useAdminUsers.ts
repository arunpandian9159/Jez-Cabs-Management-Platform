import { useState, useEffect, useCallback } from 'react';
import { usersService, AdminUserDisplay } from '../services/users.service';

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
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    inactive: 0,
  });

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch users from admin API
      const usersData = await usersService.getAdminUsers({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
        limit: 100,
      });

      // Map the response to UserDisplay format
      const mappedUsers: UserDisplay[] = usersData.map((user: AdminUserDisplay) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        location: user.location,
        joinedAt: user.joinedAt,
        totalTrips: user.totalTrips,
        totalSpent: user.totalSpent,
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await usersService.getAdminUserStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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

  // Use stats from API instead of computing from filtered users
  const totalCount = stats.total;
  const activeCount = stats.active;
  const suspendedCount = stats.suspended;
  const inactiveCount = stats.inactive;

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
    refetch: fetchUsers,
  };
}
