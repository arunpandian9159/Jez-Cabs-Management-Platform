import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Star,
    ChevronRight,
    Download,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import { PageLoader } from '@/components/ui/Loading';
import { formatCurrency, formatDate, formatTime, formatDuration } from '@/shared/utils';
import { useTripHistory } from '../hooks/useTripHistory';

export function TripHistory() {
    const {
        activeTab,
        dateFilter,
        filteredTrips,
        isLoading,
        completedCount,
        cancelledCount,
        totalEarnings,
        totalDistance,
        avgRating,
        totalTrips,
        setActiveTab,
        setDateFilter,
    } = useTripHistory();

    if (isLoading) {
        return <PageLoader message="Loading trip history..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-gray-900 mb-1">Trip History</h1><p className="text-gray-500">View and manage your completed trips</p></div>
                <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>Export</Button>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4">
                <Card padding="md" className="text-center"><p className="text-2xl font-bold text-gray-900">{completedCount}</p><p className="text-sm text-gray-500">Trips</p></Card>
                <Card padding="md" className="text-center"><p className="text-2xl font-bold text-success-600">{formatCurrency(totalEarnings)}</p><p className="text-sm text-gray-500">Earnings</p></Card>
                <Card padding="md" className="text-center"><p className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(1)} km</p><p className="text-sm text-gray-500">Distance</p></Card>
                <Card padding="md" className="text-center"><div className="flex items-center justify-center gap-1"><Star className="w-5 h-5 text-warning-500 fill-warning-500" /><p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p></div><p className="text-sm text-gray-500">Avg Rating</p></Card>
            </motion.div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <TabsRoot value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="all">All ({totalTrips})</TabsTrigger>
                            <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
                            <TabsTrigger value="cancelled">Cancelled ({cancelledCount})</TabsTrigger>
                        </TabsList>
                        <Select options={[{ value: 'today', label: 'Today' }, { value: 'week', label: 'This Week' }, { value: 'month', label: 'This Month' }, { value: 'all', label: 'All Time' }]} value={dateFilter} onValueChange={setDateFilter} />
                    </div>

                    <TabsContent value={activeTab} className="mt-4">
                        <div className="space-y-3">
                            {filteredTrips.map((trip, index) => (
                                <motion.div key={trip.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                                    <Card padding="md" interactive>
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${trip.status === 'completed' ? 'bg-success-100' : 'bg-error-100'}`}>
                                                {trip.status === 'completed' ? <CheckCircle className="w-6 h-6 text-success-600" /> : <XCircle className="w-6 h-6 text-error-600" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{trip.pickup} → {trip.destination}</p>
                                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1"><span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(trip.date)}</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(trip.date)}</span></div>
                                                    </div>
                                                    <StatusBadge status={trip.status} />
                                                </div>
                                                {trip.status === 'completed' ? (
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <span className="text-gray-600">{trip.customer.name}</span><span className="text-gray-400">•</span><span className="text-gray-600">{trip.distance} km</span><span className="text-gray-400">•</span><span className="text-gray-600">{formatDuration(trip.duration)}</span>
                                                        {trip.rating && (<><span className="text-gray-400">•</span><span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning-500 fill-warning-500" />{trip.rating}</span></>)}
                                                    </div>
                                                ) : (<p className="text-sm text-error-600">{trip.cancellationReason}</p>)}
                                            </div>
                                            {trip.status === 'completed' && (
                                                <div className="text-right"><p className="font-bold text-gray-900">{formatCurrency(trip.fare)}</p>{(trip.tip ?? 0) > 0 && <p className="text-xs text-success-600">+{formatCurrency(trip.tip ?? 0)} tip</p>}<p className="text-xs text-gray-500">{trip.paymentMethod}</p></div>
                                            )}
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                </TabsRoot>
            </motion.div>
        </div>
    );
}
