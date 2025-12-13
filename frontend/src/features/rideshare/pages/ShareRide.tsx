import { motion } from 'framer-motion';
import { Share2, Copy, Check, MessageCircle, Link, Users, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { PageLoader } from '@/components/ui/Loading';
import { useShareRide } from '../hooks/useShareRide';

export function ShareRide() {
    const { copied, showShareSuccess, activeTrip, sharedWith, isLoading, handleCopyLink, handleShare } = useShareRide();

    if (isLoading) return <PageLoader message="Loading trip data..." />;

    if (!activeTrip) {
        return (<div className="space-y-6"><motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}><h1 className="text-2xl font-bold text-gray-900 mb-1">Share Your Ride</h1><p className="text-gray-500">Let friends and family track your trip in real-time</p></motion.div><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}><Card padding="lg" className="text-center"><Share2 className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="font-semibold text-gray-900 mb-2">No Active Trip</h3><p className="text-gray-500">You don't have an active trip to share right now. Start a trip to share your ride details with friends and family.</p></Card></motion.div></div>);
    }

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}><h1 className="text-2xl font-bold text-gray-900 mb-1">Share Your Ride</h1><p className="text-gray-500">Let friends and family track your trip in real-time</p></motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card padding="lg" className="border-primary-200 bg-primary-50">
                    <div className="flex items-center gap-2 mb-4"><Badge variant="primary">Active Trip</Badge><span className="text-sm text-primary-600">Currently in progress</span></div>
                    <div className="flex items-center gap-4 mb-4"><Avatar size="lg" name={activeTrip.driver.name} /><div className="flex-1"><p className="font-medium text-gray-900">{activeTrip.driver.name}</p><p className="text-sm text-gray-500">{activeTrip.driver.vehicleModel}</p><p className="text-sm font-medium text-gray-700">{activeTrip.driver.vehicleNumber}</p></div><div className="text-right"><p className="text-sm text-gray-500">ETA</p><p className="text-2xl font-bold text-primary-600">{activeTrip.estimatedArrival}</p></div></div>
                    <div className="p-3 bg-white rounded-lg"><div className="flex items-center gap-3 mb-2"><div className="w-3 h-3 rounded-full bg-success-500" /><span className="text-sm text-gray-700">{activeTrip.from}</span></div><div className="ml-1.5 h-4 w-0.5 bg-gray-300" /><div className="flex items-center gap-3 mt-2"><div className="w-3 h-3 rounded-full bg-error-500" /><span className="text-sm text-gray-700">{activeTrip.to}</span></div></div>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="font-semibold text-gray-900 mb-3">Share via</h2>
                <div className="grid grid-cols-4 gap-3">
                    <button onClick={() => handleShare('whatsapp')} className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors"><div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2"><MessageCircle className="w-6 h-6 text-white" /></div><span className="text-sm text-gray-700">WhatsApp</span></button>
                    <button onClick={() => handleShare('sms')} className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors"><div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2"><Phone className="w-6 h-6 text-white" /></div><span className="text-sm text-gray-700">SMS</span></button>
                    <button onClick={() => handleShare('link')} className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors"><div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-2"><Share2 className="w-6 h-6 text-white" /></div><span className="text-sm text-gray-700">More</span></button>
                    <button onClick={handleCopyLink} className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"><div className={`w-12 h-12 rounded-full ${copied ? 'bg-success-500' : 'bg-gray-500'} flex items-center justify-center mx-auto mb-2 transition-colors`}>{copied ? <Check className="w-6 h-6 text-white" /> : <Copy className="w-6 h-6 text-white" />}</div><span className="text-sm text-gray-700">{copied ? 'Copied!' : 'Copy Link'}</span></button>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card padding="md"><p className="text-sm text-gray-500 mb-2">Share Link</p><div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"><Link className="w-4 h-4 text-gray-400" /><span className="flex-1 text-sm text-gray-700 truncate">{activeTrip.shareLink}</span><Button size="sm" variant={copied ? 'success' : 'outline'} onClick={handleCopyLink}>{copied ? 'Copied' : 'Copy'}</Button></div></Card>
            </motion.div>

            {sharedWith.length > 0 && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}><h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Users className="w-5 h-5 text-primary-600" />Shared With ({sharedWith.length})</h2><Card padding="md"><div className="space-y-3">{sharedWith.map((contact) => (<div key={contact.id} className="flex items-center justify-between"><div className="flex items-center gap-3"><Avatar size="sm" name={contact.name} /><div><p className="font-medium text-gray-900">{contact.name}</p><p className="text-xs text-gray-500">via {contact.via}</p></div></div><div className="flex items-center gap-1 text-xs text-gray-500"><Clock className="w-3 h-3" />{contact.timestamp}</div></div>))}</div></Card></motion.div>)}

            {showShareSuccess && <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-success-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"><Check className="w-5 h-5" />Ride details shared successfully!</motion.div>}
        </div>
    );
}
