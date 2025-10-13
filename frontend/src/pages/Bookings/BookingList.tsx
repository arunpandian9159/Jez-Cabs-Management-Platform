import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  BookOpen,
  User,
  Car,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookingService } from '../../services/booking.service';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Booking } from '../../types';
import { format, parseISO } from 'date-fns';

const safeFormatDate = (dateString: string, formatString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    return 'Invalid Date';
  }
};

export const BookingList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['bookings', { status: statusFilter, search: searchQuery }],
    queryFn: () => bookingService.getAll(statusFilter ? { status: statusFilter } : undefined),
  });

  const bookings = data?.data;

  const deleteMutation = useMutation({
    mutationFn: bookingService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking deleted successfully');
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete booking');
    },
  });

  const handleDeleteClick = (id: string) => {
    setBookingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (bookingToDelete) {
      await deleteMutation.mutateAsync(bookingToDelete);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton variant="list" count={6} />;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-medium">
          Failed to load bookings. Please try again later.
        </p>
      </div>
    );
  }

  const filteredBookings = bookings?.filter((booking: Booking) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.customerName.toLowerCase().includes(query) ||
      booking.customerEmail.toLowerCase().includes(query) ||
      booking.customerPhone.includes(query)
    );
  });

  return (
    <div className="animate-fade-in-up">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex justify-between items-start mb-8">
          <div className="animate-scale-in">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-3 flex items-center justify-center mr-4 shadow-lg">
                <BookOpen className="text-white h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Booking Management
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  Manage your rental bookings efficiently
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate('/app/bookings/new')}
            className="flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="mb-8 bg-gradient-to-br from-white/90 to-white/95 backdrop-blur-sm border border-blue-100">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Search & Filter
            </h2>
            <p className="text-gray-600">
              Find bookings by customer details or filter by status
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by customer name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm border-blue-100 focus:border-blue-300 focus:bg-white transition-all duration-300"
                />
              </div>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/80 backdrop-blur-sm border-blue-100 focus:border-blue-300 focus:bg-white transition-all duration-300">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Grid */}
      {filteredBookings && filteredBookings.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No bookings found"
          description={
            searchQuery || statusFilter
              ? 'Try adjusting your filters to see more results'
              : 'Get started by creating your first booking to manage your rental operations'
          }
          actionLabel={!searchQuery && !statusFilter ? 'New Booking' : undefined}
          onAction={!searchQuery && !statusFilter ? () => navigate('/app/bookings/new') : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings?.map((booking: Booking, index: number) => (
            <div key={booking.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <Card className="h-full group relative overflow-hidden bg-gradient-to-br from-white/90 to-white/95 backdrop-blur-sm border border-blue-100 transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:border-blue-300">
                {/* Status indicator bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    booking.status === 'ACTIVE' ? 'bg-gradient-to-r from-green-500 to-green-700' :
                    booking.status === 'PENDING' ? 'bg-gradient-to-r from-orange-500 to-orange-700' :
                    booking.status === 'COMPLETED' ? 'bg-gradient-to-r from-blue-500 to-blue-700' :
                    'bg-gradient-to-r from-red-500 to-red-700'
                  }`}
                />
                <CardContent className="flex-1 p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {booking.customerName}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        Booking #{booking.id.slice(-8)}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">EMAIL</p>
                        <p className="text-sm font-medium text-gray-900">{booking.customerEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">PHONE</p>
                        <p className="text-sm font-medium text-gray-900">{booking.customerPhone}</p>
                      </div>
                    </div>

                    {booking.cab && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                          <Car className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">VEHICLE</p>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.cab.make} {booking.cab.model}
                          </p>
                          <p className="text-xs text-gray-500">{booking.cab.registration_number}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rental Period */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4 rounded-xl mb-6">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      RENTAL PERIOD
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {safeFormatDate(booking.startDate, 'MMM dd, yyyy')} -{' '}
                      {safeFormatDate(booking.endDate, 'MMM dd, yyyy')}
                    </p>
                  </div>

                  {/* Locations */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300 font-semibold">
                      {booking.pickupLocation}
                    </Badge>
                    {booking.dropoffLocation && (
                      <Badge variant="outline" className="border-orange-300 text-orange-700 font-semibold">
                        → {booking.dropoffLocation}
                      </Badge>
                    )}
                  </div>

                  {/* Total Amount */}
                  {booking.totalAmount && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4 rounded-xl text-center mb-6">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        TOTAL AMOUNT
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        ${booking.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="booking-actions flex gap-2 mt-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/app/bookings/${booking.id}/edit`)}
                      className="flex-1 flex items-center gap-2 hover:-translate-y-1 transition-all duration-200"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(booking.id)}
                      disabled={deleteMutation.isPending}
                      className="border-red-300 text-red-700 hover:bg-red-500 hover:text-white hover:-translate-y-1 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
