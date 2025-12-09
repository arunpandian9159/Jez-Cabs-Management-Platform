import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Car,
  AlertTriangle,
  Filter,
  SlidersHorizontal,
  Sparkles,
  MoreHorizontal,
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
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
        <p className="text-red-700 font-medium">
          Failed to load vehicles. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="animate-scale-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-4 shadow-xl shadow-blue-500/30">
              <Car className="text-white h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  <Sparkles className="h-3 w-3" />
                  Fleet
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-gradient-primary">
                Fleet Management
              </h1>
            </div>
          </div>
          <p className="text-lg text-slate-600 font-medium max-w-xl">
            Manage your vehicle fleet efficiently with real-time tracking and status updates.
          </p>
        </div>

        <Button
          onClick={() => navigate('/app/cabs/new')}
          className="group flex items-center gap-2 px-6 py-6 text-base font-bold rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          Add Vehicle
        </Button>
      </div>

      {/* Filters Section */}
      <Card className="overflow-hidden border-0 shadow-xl card-modern">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500" />
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200">
              <SlidersHorizontal className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Search & Filter
              </h2>
              <p className="text-sm text-slate-500">
                Find vehicles by registration, make, model, or status
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-hover:text-blue-500 transition-colors" />
                <Input
                  placeholder="Search by registration, make, or model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 hover:border-slate-300"
                />
              </div>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 transition-all duration-300 hover:border-slate-300">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-0 shadow-xl">
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="AVAILABLE">✅ Available</SelectItem>
                  <SelectItem value="RENTED">🚗 Rented</SelectItem>
                  <SelectItem value="IN_MAINTENANCE">🔧 In Maintenance</SelectItem>
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
        <Card className="overflow-hidden border-0 shadow-xl card-modern">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500" />
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <TableHead className="font-bold text-slate-700 py-5">Vehicle</TableHead>
                  <TableHead className="font-bold text-slate-700">Registration</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                  <TableHead className="font-bold text-slate-700">Year</TableHead>
                  <TableHead className="font-bold text-slate-700">Rate</TableHead>
                  <TableHead className="font-bold text-slate-700">Documents</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cabs?.map((cab: Cab, index: number) => (
                  <TableRow
                    key={cab.id}
                    className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-300"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TableCell className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <Car className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {cab.make} {cab.model}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-2">
                            {cab.color && (
                              <span className="flex items-center gap-1">
                                <span
                                  className="w-3 h-3 rounded-full border border-slate-200"
                                  style={{ backgroundColor: cab.color.toLowerCase() }}
                                />
                                {cab.color}
                              </span>
                            )}
                            {cab.seating_capacity && (
                              <span>• {cab.seating_capacity} seats</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 font-mono font-bold border border-blue-200 px-3 py-1.5">
                        {cab.registration_number}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={cab.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-900 font-semibold">{cab.year}</span>
                    </TableCell>
                    <TableCell>
                      {cab.daily_rental_rate ? (
                        <span className="text-emerald-600 font-bold text-lg">
                          ${cab.daily_rental_rate}
                          <span className="text-sm font-normal text-slate-400">/day</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {cab.insurance_expiry && (
                          <div className="flex items-center gap-2">
                            {isExpired(cab.insurance_expiry) ? (
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-100 text-red-700">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">Expired</span>
                              </div>
                            ) : isExpiringSoon(cab.insurance_expiry) ? (
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-100 text-orange-700">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">Expiring Soon</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-100 text-green-700">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-xs font-medium">Valid</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/app/cabs/${cab.id}/edit`)}
                          className="flex items-center gap-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(cab.id)}
                          disabled={deleteMutation.isPending}
                          className="flex items-center gap-1.5 rounded-lg border-red-200 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
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
