import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus,
    Phone,
    Mail,
    User,
    AlertCircle,
    CheckCircle2,
    Sparkles,
    Send
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface NewDriverData {
    name: string;
    phone: string;
    email: string;
}

interface AddDriverModalProps {
    open: boolean;
    driver: NewDriverData;
    isInviting: boolean;
    inviteError: string | null;
    inviteSuccess: boolean;
    onOpenChange: (open: boolean) => void;
    onFieldChange: (field: keyof NewDriverData, value: string) => void;
    onSubmit: () => void;
}

export function AddDriverModal({
    open,
    driver,
    isInviting,
    inviteError,
    inviteSuccess,
    onOpenChange,
    onFieldChange,
    onSubmit,
}: AddDriverModalProps) {
    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Invite New Driver"
            description="Send an invitation to join your fleet"
            size="md"
        >
            <div className="space-y-5">
                {/* Header Icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center"
                >
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg shadow-accent-500/30">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center border-2 border-white"
                        >
                            <Sparkles className="w-3 h-3 text-white" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Error Alert */}
                <AnimatePresence>
                    {inviteError && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-error-50 to-error-100/50 border border-error-200 rounded-xl"
                        >
                            <div className="w-10 h-10 rounded-full bg-error-100 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-5 h-5 text-error-600" />
                            </div>
                            <p className="text-error-700 text-sm font-medium">{inviteError}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Success Message */}
                <AnimatePresence>
                    {inviteSuccess && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-6 bg-gradient-to-br from-success-50 to-success-100/50 border border-success-200 rounded-xl text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, type: 'spring' }}
                                className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-success-400 to-success-500 flex items-center justify-center shadow-lg shadow-success-500/30"
                            >
                                <CheckCircle2 className="w-7 h-7 text-white" />
                            </motion.div>
                            <h4 className="text-lg font-semibold text-success-800 mb-2">Invitation Sent!</h4>
                            <p className="text-success-700 text-sm">
                                The driver will receive an email with instructions to join your fleet.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form Fields */}
                {!inviteSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <p className="text-gray-500 text-sm text-center">
                            Enter the driver's details below to send them an invitation.
                        </p>

                        <div className="space-y-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                            <div className="relative">
                                <Input
                                    label="Full Name *"
                                    placeholder="e.g., John Doe"
                                    value={driver.name}
                                    onChange={(e) => onFieldChange('name', e.target.value)}
                                />
                                <User className="absolute right-3 top-9 w-4 h-4 text-gray-400" />
                            </div>

                            <div className="relative">
                                <Input
                                    label="Phone Number *"
                                    placeholder="e.g., 9876543210"
                                    value={driver.phone}
                                    onChange={(e) => onFieldChange('phone', e.target.value)}
                                />
                                <Phone className="absolute right-3 top-9 w-4 h-4 text-gray-400" />
                            </div>

                            <div className="relative">
                                <Input
                                    label="Email Address *"
                                    type="email"
                                    placeholder="e.g., driver@example.com"
                                    value={driver.email}
                                    onChange={(e) => onFieldChange('email', e.target.value)}
                                />
                                <Mail className="absolute right-3 top-9 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-3 pt-4 border-t border-gray-100"
                >
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={() => onOpenChange(false)}
                        className="hover:bg-gray-50"
                    >
                        {inviteSuccess ? 'Close' : 'Cancel'}
                    </Button>
                    {!inviteSuccess && (
                        <Button
                            fullWidth
                            onClick={onSubmit}
                            loading={isInviting}
                            disabled={isInviting}
                            leftIcon={<Send className="w-4 h-4" />}
                            className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 shadow-lg shadow-accent-500/30"
                        >
                            Send Invitation
                        </Button>
                    )}
                </motion.div>
            </div>
        </Modal>
    );
}
