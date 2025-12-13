import { motion } from 'framer-motion';
import { Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency } from '@/shared/utils';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

export function AdminDashboard() {
    const { stats, recentTrips, pendingVerifications, recentDisputes } = useAdminDashboard();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge variant="success">Completed</Badge>;
            case 'in_progress': return <Badge variant="primary">In Progress</Badge>;
            case 'cancelled': return <Badge variant="error">Cancelled</Badge>;
            case 'open': return <Badge variant="warning">Open</Badge>;
            default: return null;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high': return <Badge variant="error">High</Badge>;
            case 'medium': return <Badge variant="warning">Medium</Badge>;
            case 'low': return <Badge variant="secondary">Low</Badge>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}><h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1><p className="text-gray-500">Welcome back! Here's what's happening today.</p></motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    const bgColor = stat.color === 'primary' ? 'bg-primary-100' : stat.color === 'success' ? 'bg-success-100' : stat.color === 'accent' ? 'bg-accent-100' : 'bg-error-100';
                    const iconColor = stat.color === 'primary' ? 'text-primary-600' : stat.color === 'success' ? 'text-success-600' : stat.color === 'accent' ? 'text-accent-600' : 'text-error-600';
                    return (
                        <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + index * 0.05 }}>
                            <Card padding="lg">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}><IconComponent className={`w-6 h-6 ${iconColor}`} /></div>
                                    <div className={`flex items-center gap-1 text-sm ${stat.trending === 'up' ? 'text-success-600' : 'text-error-600'}`}>{stat.trending === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}{stat.change}</div>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p><p className="text-sm text-gray-500">{stat.label}</p>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            <div className="grid grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-2">
                    <Card padding="lg">
                        <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-gray-900">Recent Trips</h2><button className="text-sm text-primary-600 hover:underline">View All</button></div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead><tr className="border-b border-gray-200"><th className="text-left py-3 text-sm font-medium text-gray-500">Customer</th><th className="text-left py-3 text-sm font-medium text-gray-500">Driver</th><th className="text-left py-3 text-sm font-medium text-gray-500">Fare</th><th className="text-left py-3 text-sm font-medium text-gray-500">Status</th><th className="text-left py-3 text-sm font-medium text-gray-500">Time</th></tr></thead>
                                <tbody>{recentTrips.map((trip) => (<tr key={trip.id} className="border-b border-gray-100 last:border-0"><td className="py-3"><div className="flex items-center gap-2"><Avatar size="xs" name={trip.customer} /><span className="text-sm font-medium text-gray-900">{trip.customer}</span></div></td><td className="py-3 text-sm text-gray-600">{trip.driver}</td><td className="py-3 text-sm font-medium text-gray-900">{formatCurrency(trip.fare)}</td><td className="py-3">{getStatusBadge(trip.status)}</td><td className="py-3 text-sm text-gray-500">{trip.time}</td></tr>))}</tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>

                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Card padding="lg">
                            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-gray-900">Pending Verifications</h2><Badge variant="warning">{pendingVerifications.length}</Badge></div>
                            <div className="space-y-3">{pendingVerifications.map((item) => (<div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"><div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center"><Clock className="w-5 h-5 text-warning-600" /></div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{item.name}</p><p className="text-xs text-gray-500">{item.document} • {item.submitted}</p></div></div>))}</div>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <Card padding="lg">
                            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-gray-900">Recent Disputes</h2><button className="text-sm text-primary-600 hover:underline">View All</button></div>
                            <div className="space-y-3">{recentDisputes.map((dispute) => (<div key={dispute.id} className="p-3 rounded-lg border border-gray-200"><div className="flex items-center justify-between mb-1"><span className="text-sm font-medium text-gray-900">{dispute.customer}</span>{getPriorityBadge(dispute.priority)}</div><p className="text-sm text-gray-500">{dispute.issue}</p></div>))}</div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
