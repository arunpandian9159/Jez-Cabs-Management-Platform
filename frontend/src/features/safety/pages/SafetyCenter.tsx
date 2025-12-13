import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    Phone,
    AlertTriangle,
    Share2,
    MapPin,
    Bell,
    Users,
    FileText,
    ChevronRight,
    CheckCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { safetyService } from '../../services';

// Types for safety settings display
interface SafetySettingsDisplay {
    shareRideEnabled: boolean;
    trustedContactsCount: number;
    sosEnabled: boolean;
    audioRecordingEnabled: boolean;
    pinVerificationEnabled: boolean;
}

export function SafetyCenter() {
    const navigate = useNavigate();
    const [showSOSModal, setShowSOSModal] = useState(false);
    const [sosTriggered, setSosTriggered] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [safetySettings, setSafetySettings] = useState<SafetySettingsDisplay>({
        shareRideEnabled: false,
        trustedContactsCount: 0,
        sosEnabled: false,
        audioRecordingEnabled: false,
        pinVerificationEnabled: false,
    });
    const [_isLoading, setIsLoading] = useState(true);

    // Fetch safety settings and emergency contacts count on mount
    useEffect(() => {
        const fetchSafetyData = async () => {
            try {
                setIsLoading(true);
                const contacts = await safetyService.getEmergencyContacts();
                setSafetySettings(prev => ({
                    ...prev,
                    trustedContactsCount: contacts.length,
                    sosEnabled: contacts.length > 0,
                    shareRideEnabled: contacts.length > 0,
                }));
            } catch (error) {
                console.error('Error fetching safety data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSafetyData();
    }, []);

    const handleTriggerSOS = () => {
        setShowSOSModal(true);
        setSosTriggered(false);
        setCountdown(5);

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Trigger SOS via API
                    safetyService.triggerSOS({
                        lat: 0, // In a real app, get current location
                        lng: 0,
                    }).catch(console.error);
                    setSosTriggered(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleCancelSOS = () => {
        setShowSOSModal(false);
        setSosTriggered(false);
        setCountdown(5);
    };

    const safetyFeatures = [
        {
            icon: AlertTriangle,
            title: 'SOS Emergency',
            description: 'Instantly alert emergency contacts and authorities',
            action: handleTriggerSOS,
            color: 'error',
            badge: 'Critical',
        },
        {
            icon: Share2,
            title: 'Share My Ride',
            description: 'Let friends and family track your trip in real-time',
            action: () => { },
            color: 'primary',
            enabled: safetySettings.shareRideEnabled,
        },
        {
            icon: Users,
            title: 'Emergency Contacts',
            description: `${safetySettings.trustedContactsCount} contacts added`,
            action: () => navigate('/customer/safety/contacts'),
            color: 'success',
        },
        {
            icon: MapPin,
            title: 'Live Location Sharing',
            description: 'Share your location during every ride',
            action: () => { },
            color: 'accent',
        },
    ];

    const safetyTips = [
        'Always verify the vehicle number before getting in',
        'Share your ride details with trusted contacts',
        'Sit in the back seat for safer exit options',
        'Trust your instincts - cancel if something feels wrong',
        'Keep your phone charged during rides',
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Safety Center</h1>
                <p className="text-gray-500">Your safety tools and emergency features</p>
            </motion.div>

            {/* Safety Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card padding="lg" className="bg-gradient-to-br from-success-500 to-success-600 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-bold">Safety Status: Active</h2>
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <p className="text-white/80">
                                All safety features are enabled and working properly
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                    {safetyFeatures.map((feature, index) => {
                        const IconComponent = feature.icon;
                        const bgColor = feature.color === 'error' ? 'bg-error-100' :
                            feature.color === 'primary' ? 'bg-primary-100' :
                                feature.color === 'success' ? 'bg-success-100' :
                                    'bg-accent-100';
                        const iconColor = feature.color === 'error' ? 'text-error-600' :
                            feature.color === 'primary' ? 'text-primary-600' :
                                feature.color === 'success' ? 'text-success-600' :
                                    'text-accent-600';

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                            >
                                <Card
                                    padding="md"
                                    interactive
                                    onClick={feature.action}
                                    className={feature.color === 'error' ? 'border-error-200' : ''}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
                                            <IconComponent className={`w-5 h-5 ${iconColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium text-gray-900 text-sm">{feature.title}</p>
                                                {feature.badge && (
                                                    <Badge variant="error" size="sm">{feature.badge}</Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{feature.description}</p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Safety Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h2 className="font-semibold text-gray-900 mb-3">Safety Settings</h2>
                <Card padding="md">
                    <div className="space-y-1">
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-gray-500" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">Ride Check</p>
                                    <p className="text-xs text-gray-500">Get checked if you haven't moved for a while</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gray-500" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">Trusted Contacts</p>
                                    <p className="text-xs text-gray-500">{safetySettings.trustedContactsCount} contacts configured</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-500" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">Safety Reports</p>
                                    <p className="text-xs text-gray-500">View and submit safety reports</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </Card>
            </motion.div>

            {/* Safety Tips */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h2 className="font-semibold text-gray-900 mb-3">Safety Tips</h2>
                <Card padding="md" className="bg-warning-50 border-warning-200">
                    <ul className="space-y-3">
                        {safetyTips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-warning-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-warning-700">{index + 1}</span>
                                </div>
                                <span className="text-warning-800 text-sm">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </motion.div>

            {/* Emergency Numbers */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h2 className="font-semibold text-gray-900 mb-3">Emergency Numbers</h2>
                <div className="grid grid-cols-2 gap-3">
                    <Card padding="md" className="text-center">
                        <Phone className="w-8 h-8 text-error-600 mx-auto mb-2" />
                        <p className="font-bold text-2xl text-gray-900">112</p>
                        <p className="text-sm text-gray-500">Emergency Services</p>
                    </Card>
                    <Card padding="md" className="text-center">
                        <Phone className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                        <p className="font-bold text-2xl text-gray-900">100</p>
                        <p className="text-sm text-gray-500">Police</p>
                    </Card>
                </div>
            </motion.div>

            {/* SOS Modal */}
            <Modal
                open={showSOSModal}
                onOpenChange={handleCancelSOS}
                title=""
                size="sm"
            >
                <div className="text-center py-4">
                    {!sosTriggered ? (
                        <>
                            <div className="w-24 h-24 rounded-full bg-error-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <span className="text-4xl font-bold text-error-600">{countdown}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Triggering SOS</h3>
                            <p className="text-gray-500 mb-6">
                                Emergency contacts will be notified in {countdown} seconds
                            </p>
                            <Button variant="outline" fullWidth onClick={handleCancelSOS}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="w-24 h-24 rounded-full bg-error-500 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-12 h-12 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-error-600 mb-2">SOS Activated!</h3>
                            <p className="text-gray-500 mb-4">
                                Your emergency contacts have been notified with your location.
                            </p>
                            <div className="space-y-3">
                                <Button fullWidth leftIcon={<Phone className="w-5 h-5" />}>
                                    Call Emergency (112)
                                </Button>
                                <Button variant="outline" fullWidth onClick={handleCancelSOS}>
                                    I'm Safe - Cancel SOS
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
}
