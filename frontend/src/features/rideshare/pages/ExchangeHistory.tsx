import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Clock, MapPin, DollarSign, Star, MessageCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { PageLoader } from '@/components/ui/Loading';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { formatCurrency, formatDate, formatTime } from '@/shared/utils';
import { useExchangeHistory, type ExchangeHistoryDisplay } from '../hooks/useExchangeHistory';

const getStatusBadge = (status: string) => {
    switch (status) { case 'completed': return <Badge variant="success">Completed</Badge>; case 'upcoming': return <Badge variant="primary">Upcoming</Badge>; case 'cancelled': return <Badge variant="error">Cancelled</Badge>; default: return null; }
};

export function ExchangeHistory() {
    const { activeTab, filteredHistory, isLoading, error, totalEarnings, totalSaved, bookedCount, hostedCount, totalCount, setActiveTab } = useExchangeHistory();

    if (isLoading) return <PageLoader message="Loading exchange history..." />;
    if (error) return (<div className="space-y-6"><motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}><h1 className="text-2xl font-bold text-gray-900 mb-1">Exchange History</h1><p className="text-gray-500">Your trip sharing and booking history</p></motion.div><Card padding="lg" className="text-center"><AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-4" /><h3 className="font-semibold text-gray-900 mb-2">Unable to Load History</h3><p className="text-gray-500 mb-4">{error}</p><Button onClick={() => window.location.reload()}>Try Again</Button></Card></div>);

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}><h1 className="text-2xl font-bold text-gray-900 mb-1">Exchange History</h1><p className="text-gray-500">Your trip sharing and booking history</p></motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-4">
                <Card padding="md" className="bg-success-50 border-success-200"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center"><DollarSign className="w-6 h-6 text-success-600" /></div><div><p className="text-sm text-success-600">Total Earned</p><p className="text-2xl font-bold text-success-700">{formatCurrency(totalEarnings)}</p></div></div></Card>
                <Card padding="md" className="bg-primary-50 border-primary-200"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center"><DollarSign className="w-6 h-6 text-primary-600" /></div><div><p className="text-sm text-primary-600">Total Saved</p><p className="text-2xl font-bold text-primary-700">{formatCurrency(totalSaved)}</p></div></div></Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <TabsRoot value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4"><TabsTrigger value="all">All ({totalCount})</TabsTrigger><TabsTrigger value="booked">Rides Booked ({bookedCount})</TabsTrigger><TabsTrigger value="hosted">Rides Hosted ({hostedCount})</TabsTrigger></TabsList>
                    <TabsContent value={activeTab}><div className="space-y-3">{filteredHistory.map((item, index) => <HistoryCard key={item.id} item={item} index={index} />)}</div></TabsContent>
                </TabsRoot>
            </motion.div>
        </div>
    );
}

function HistoryCard({ item, index }: { item: ExchangeHistoryDisplay; index: number }) {
    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
            <Card padding="md">
                <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'booked' ? 'bg-primary-100' : 'bg-accent-100'}`}>{item.type === 'booked' ? <ArrowRight className="w-5 h-5 text-primary-600" /> : <ArrowLeft className="w-5 h-5 text-accent-600" />}</div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2"><span className="font-medium text-gray-900">{item.type === 'booked' ? 'Booked a Ride' : 'Hosted a Ride'}</span>{getStatusBadge(item.status)}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2"><MapPin className="w-3 h-3 text-success-500" /><span>{item.trip.from}</span><ArrowRight className="w-3 h-3 text-gray-400" /><MapPin className="w-3 h-3 text-error-500" /><span>{item.trip.to}</span></div>
                        <div className="flex items-center gap-3 text-xs text-gray-500"><span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(item.trip.date)}</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(item.trip.time)}</span></div>
                        {item.type === 'booked' && item.host && <div className="flex items-center gap-2 mt-2 text-sm"><span className="text-gray-500">Host:</span><span className="font-medium">{item.host.name}</span><span className="flex items-center gap-1 text-warning-600"><Star className="w-3 h-3 fill-warning-500" />{item.host.rating}</span></div>}
                        {item.type === 'hosted' && item.passengers && <div className="flex items-center gap-2 mt-2"><span className="text-sm text-gray-500">{item.seatsFilled}/{item.seatsOffered} seats filled</span><div className="flex -space-x-2">{item.passengers.map((p, i) => <Avatar key={i} size="xs" name={p.name} />)}</div></div>}
                        {item.status === 'cancelled' && item.cancelReason && <p className="text-xs text-error-600 mt-1">{item.cancelReason}</p>}
                    </div>
                    <div className="text-right">{item.type === 'booked' && <p className="font-bold text-gray-900">-{formatCurrency(item.price ?? 0)}</p>}{item.type === 'hosted' && item.earnings && <p className="font-bold text-success-600">+{formatCurrency(item.earnings)}</p>}{item.status === 'completed' && item.rating && <div className="flex items-center gap-1 justify-end mt-1"><Star className="w-4 h-4 text-warning-500 fill-warning-500" /><span className="text-sm text-gray-600">{item.rating}</span></div>}</div>
                </div>
                {item.status === 'upcoming' && <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100"><Button variant="outline" size="sm" leftIcon={<MessageCircle className="w-4 h-4" />}>Message</Button><Button variant="danger" size="sm">Cancel</Button></div>}
            </Card>
        </motion.div>
    );
}
