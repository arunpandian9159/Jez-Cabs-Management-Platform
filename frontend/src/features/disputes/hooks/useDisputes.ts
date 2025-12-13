import { useState, useEffect, useCallback } from 'react';
import { disputesService, tripsService } from '@/services';

export interface DisputeDisplay {
  id: string;
  tripId: string;
  type: string;
  subject: string;
  description: string;
  status: 'open' | 'resolved' | 'closed';
  createdAt: string;
  resolvedAt?: string;
  closedAt?: string;
  resolution?: string;
  amount?: number;
  trip: { pickup: string; destination: string; date: string };
  messages: number;
}

export interface TripOption {
  value: string;
  label: string;
}

export const disputeTypes = [
  { value: 'overcharge', label: 'Overcharged' },
  { value: 'driver_behavior', label: 'Driver Behavior' },
  { value: 'cancellation', label: 'Cancellation Issue' },
  { value: 'lost_item', label: 'Lost Item' },
  { value: 'safety', label: 'Safety Concern' },
  { value: 'other', label: 'Other' },
];

export function useDisputes() {
  const [activeTab, setActiveTab] = useState('all');
  const [showNewDispute, setShowNewDispute] = useState(false);
  const [disputeType, setDisputeType] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');
  const [selectedTripId, setSelectedTripId] = useState('');
  const [disputes, setDisputes] = useState<DisputeDisplay[]>([]);
  const [tripOptions, setTripOptions] = useState<TripOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDispute = (
    d: ReturnType<typeof disputesService.findAll> extends Promise<(infer T)[]>
      ? T
      : never
  ): DisputeDisplay => ({
    id: d.id,
    tripId: d.trip_id,
    type: d.type,
    subject: `${d.type.charAt(0).toUpperCase() + d.type.slice(1)} Issue`,
    description: d.description,
    status:
      d.status === 'pending' || d.status === 'in_progress'
        ? 'open'
        : (d.status as 'resolved' | 'closed'),
    createdAt: d.created_at,
    resolvedAt: d.resolved_at,
    resolution: d.resolution,
    amount: d.refund_amount,
    trip: {
      pickup: d.trip?.pickup_address || 'Unknown',
      destination: d.trip?.destination_address || 'Unknown',
      date: d.trip?.created_at || '',
    },
    messages: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const disputesData = await disputesService.findAll();
      setDisputes(disputesData.map(formatDispute));
      const trips = await tripsService.findAll({ limit: 10 });
      setTripOptions(
        trips.map((t) => ({
          value: t.id,
          label: `${t.pickup_address} → ${t.destination_address} (${new Date(t.created_at).toLocaleDateString()})`,
        }))
      );
    } catch (error) {
      console.error('Error fetching disputes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmitDispute = async () => {
    if (!selectedTripId || !disputeType || !disputeDescription) return;
    try {
      await disputesService.create({
        trip_id: selectedTripId,
        type: disputeType as
          | 'fare'
          | 'behavior'
          | 'safety'
          | 'service'
          | 'other',
        description: disputeDescription,
      });
      const disputesData = await disputesService.findAll();
      setDisputes(disputesData.map(formatDispute));
      setShowNewDispute(false);
      setDisputeType('');
      setDisputeDescription('');
      setSelectedTripId('');
    } catch (error) {
      console.error('Error creating dispute:', error);
    }
  };

  const filteredDisputes = disputes.filter(
    (d) =>
      activeTab === 'all' ||
      (activeTab === 'open' ? d.status === 'open' : d.status !== 'open')
  );
  const openCount = disputes.filter((d) => d.status === 'open').length;
  const resolvedCount = disputes.filter((d) => d.status !== 'open').length;

  return {
    activeTab,
    showNewDispute,
    disputeType,
    disputeDescription,
    selectedTripId,
    disputes,
    tripOptions,
    isLoading,
    filteredDisputes,
    openCount,
    resolvedCount,
    totalCount: disputes.length,
    setActiveTab,
    setShowNewDispute,
    setDisputeType,
    setDisputeDescription,
    setSelectedTripId,
    handleSubmitDispute,
  };
}
