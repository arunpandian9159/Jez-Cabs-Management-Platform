import { useState, useEffect, useCallback } from 'react';
import {
  rideshareService,
  SharedContact as APISharedContact,
} from '@/services';

export interface ActiveTripDisplay {
  id: string;
  driver: {
    name: string;
    phone: string;
    rating: number;
    vehicleNumber: string;
    vehicleModel: string;
  };
  from: string;
  to: string;
  estimatedArrival: string;
  status: string;
  shareLink: string;
}

export interface SharedContactDisplay {
  id: string;
  name: string;
  timestamp: string;
  via: string;
}

export function useShareRide() {
  const [copied, setCopied] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [activeTrip, setActiveTrip] = useState<ActiveTripDisplay | null>(null);
  const [sharedWith, setSharedWith] = useState<SharedContactDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const tripData = await rideshareService.getActiveTrip();
      if (tripData) {
        setActiveTrip({
          id: tripData.id,
          from: tripData.from,
          to: tripData.to,
          estimatedArrival: tripData.estimated_arrival,
          status: tripData.status,
          shareLink: tripData.share_link,
          driver: {
            name: tripData.driver.name,
            phone: tripData.driver.phone,
            rating: tripData.driver.rating,
            vehicleNumber: tripData.driver.vehicle_number,
            vehicleModel: tripData.driver.vehicle_model,
          },
        });
        const contacts = await rideshareService.getSharedContacts(tripData.id);
        setSharedWith(
          contacts.map((c: APISharedContact) => ({
            id: c.id,
            name: c.name,
            timestamp: c.timestamp,
            via: c.via,
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching trip data:', err);
      setActiveTrip(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCopyLink = () => {
    if (!activeTrip) return;
    navigator.clipboard.writeText(activeTrip.shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (method: 'whatsapp' | 'sms' | 'link' | 'email') => {
    if (!activeTrip) return;
    try {
      setIsSharing(true);
      const newShare = await rideshareService.shareTrip(activeTrip.id, {
        method,
      });
      setSharedWith((prev) => [
        ...prev,
        {
          id: newShare.id,
          name: newShare.name,
          timestamp: newShare.timestamp,
          via: newShare.via,
        },
      ]);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 3000);
    } catch (err) {
      console.error('Error sharing trip:', err);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 3000);
    } finally {
      setIsSharing(false);
    }
  };

  return {
    copied,
    showShareSuccess,
    activeTrip,
    sharedWith,
    isLoading,
    isSharing,
    handleCopyLink,
    handleShare,
  };
}
