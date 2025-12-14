import { useState, useEffect, useCallback } from 'react';
import { disputesService } from '@/services';

export interface DisputeCustomerDisplay {
  name: string;
  phone: string;
  email: string;
}

export interface DisputeDriverDisplay {
  name: string;
  phone: string;
  vehicleNo: string;
}

export interface DisputeTripDisplay {
  id: string;
  from: string;
  to: string;
  date: string;
  fare: number;
}

export interface DisputeMessageDisplay {
  from: string;
  text: string;
  time: string;
}

export interface DisputeDisplay {
  id: string;
  ticketNo: string;
  customer: DisputeCustomerDisplay;
  driver: DisputeDriverDisplay;
  trip: DisputeTripDisplay;
  issue: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  messages: DisputeMessageDisplay[];
  assignedTo?: string;
  resolvedAt?: string;
  resolution?: string;
}

export function useAdminDisputes() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedDispute, setSelectedDispute] = useState<DisputeDisplay | null>(
    null
  );
  const [responseText, setResponseText] = useState('');
  const [disputes, setDisputes] = useState<DisputeDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDisputes = useCallback(async () => {
    try {
      setIsLoading(true);
      const disputesData = await disputesService.findAll();
      const formattedDisputes: DisputeDisplay[] = disputesData.map(
        (d, idx) => {
          // Handle both camelCase and snake_case for the user relation
          const user = d.raisedByUser || d.raised_by_user;
          const issueType = d.type || d.issue_type;

          return {
            id: d.id,
            ticketNo: `TKT-${String(idx + 1).padStart(6, '0')}`,
            customer: {
              name: user
                ? `${user.first_name} ${user.last_name}`
                : 'Unknown',
              phone: '',
              email: user?.email || '',
            },
            driver: {
              name: 'Unknown Driver',
              phone: '',
              vehicleNo: '',
            },
            trip: {
              id: d.trip_id,
              from: d.trip?.pickup_address || 'Unknown',
              to: d.trip?.destination_address || 'Unknown',
              date: d.trip?.created_at || d.created_at,
              fare: d.trip?.actual_fare || 0,
            },
            issue: issueType
              ? issueType.charAt(0).toUpperCase() + issueType.slice(1)
              : 'Other',
            description: d.description,
            priority: d.priority || 'medium',
            status: d.status === 'pending' ? 'open' : d.status,
            createdAt: d.created_at,
            messages: [],
            resolution: d.resolution,
          };
        }
      );
      setDisputes(formattedDisputes);
    } catch (error) {
      console.error('Error fetching disputes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch =
      dispute.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.issue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter === 'all' || dispute.priority === priorityFilter;
    const matchesTab = activeTab === 'all' || dispute.status === activeTab;
    return matchesSearch && matchesPriority && matchesTab;
  });

  const openCount = disputes.filter((d) => d.status === 'open').length;
  const inProgressCount = disputes.filter(
    (d) => d.status === 'in_progress'
  ).length;
  const resolvedCount = disputes.filter((d) => d.status === 'resolved').length;

  return {
    // State
    activeTab,
    searchQuery,
    priorityFilter,
    selectedDispute,
    responseText,
    disputes,
    filteredDisputes,
    isLoading,
    // Computed
    openCount,
    inProgressCount,
    resolvedCount,
    totalCount: disputes.length,
    // Actions
    setActiveTab,
    setSearchQuery,
    setPriorityFilter,
    setSelectedDispute,
    setResponseText,
  };
}
