import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Car,
  AlertTriangle,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cabService } from '../../services/cab.service';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Cab } from '../../types';

export const CabList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cabToDelete, setCabToDelete] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['cabs', { status: statusFilter, search: searchQuery }],
    queryFn: () => cabService.getAll({ status: statusFilter, search: searchQuery }),
  });

  const cabs = data?.data;

  const deleteMutation = useMutation({
    mutationFn: cabService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cabs'] });
      toast.success('Vehicle deleted successfully');
      setDeleteDialogOpen(false);
      setCabToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete vehicle');
    },
  });

  const handleDeleteClick = (id: string) => {
    setCabToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (cabToDelete) {
      await deleteMutation.mutateAsync(cabToDelete);
    }
  };

  const isExpiringSoon = (date?: string) => {
    if (!date) return false;
    const expiryDate = new Date(date);
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (date?: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  if (isLoading) {
    return <LoadingSkeleton variant="list" count={6} />;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-medium">
          Failed to load vehicles. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex justify-between items-start mb-8">
          <div className="animate-scale-in">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl p-3 flex items-center justify-center mr-4 shadow-lg">
                <Car className="text-white h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Fleet Management
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  Manage your vehicle fleet efficiently
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate('/app/cabs/new')}
            className="flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            Add Vehicle
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
              Find vehicles by registration, make, model, or filter by status
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by registration, make, or model..."
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
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="RENTED">Rented</SelectItem>
                  <SelectItem value="IN_MAINTENANCE">In Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List */}
      {cabs && cabs.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No vehicles found"
          description={
            searchQuery || statusFilter
              ? 'Try adjusting your filters to see more results'
              : 'Get started by adding your first vehicle to your fleet'
          }
          actionLabel={!searchQuery && !statusFilter ? 'Add Vehicle' : undefined}
          onAction={!searchQuery && !statusFilter ? () => navigate('/app/cabs/new') : undefined}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Rental Rate</TableHead>
                  <TableHead>Insurance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cabs?.map((cab: Cab) => (
                  <TableRow key={cab.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                          <Car className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {cab.make} {cab.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cab.color && `${cab.color} • `}
                            {cab.seatingCapacity && `${cab.seatingCapacity} seats`}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800 font-mono">
                        {cab.registrationNumber}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={cab.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 font-medium">{cab.year}</span>
                    </TableCell>
                    <TableCell>
                      {cab.dailyRentalRate ? (
                        <span className="text-green-600 font-semibold">
                          ${cab.dailyRentalRate}/day
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {cab.insuranceExpiry && (
                          <div className="flex items-center gap-1">
                            {isExpired(cab.insuranceExpiry) ? (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            ) : isExpiringSoon(cab.insuranceExpiry) ? (
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-green-500" />
                            )}
                            <span className="text-xs text-gray-600">
                              {new Date(cab.insuranceExpiry).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {cab.registrationExpiry && (
                          <div className="flex items-center gap-1">
                            {isExpired(cab.registrationExpiry) ? (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            ) : isExpiringSoon(cab.registrationExpiry) ? (
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-green-500" />
                            )}
                            <span className="text-xs text-gray-600">
                              {new Date(cab.registrationExpiry).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/app/cabs/${cab.id}/edit`)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(cab.id)}
                          disabled={deleteMutation.isPending}
                          className="border-red-300 text-red-700 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
