import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone,
    Plus,
    Trash2,
    Star,
    Shield,
    Edit,
    Check,
    X,
    User,
    Heart,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Avatar } from '../../components/ui/Avatar';

// TODO: Fetch emergency contacts from API
// API endpoint: GET /api/v1/users/emergency-contacts
interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    relationship: string;
    isPrimary: boolean;
    notifyOnRide: boolean;
}

export function EmergencyContacts() {
    // TODO: Fetch contacts from API on component mount
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
    const [newContact, setNewContact] = useState({
        name: '',
        phone: '',
        relationship: '',
        notifyOnRide: false,
    });

    const handleAddContact = () => {
        const contact: EmergencyContact = {
            id: `e${Date.now()}`,
            name: newContact.name,
            phone: newContact.phone,
            relationship: newContact.relationship,
            isPrimary: contacts.length === 0,
            notifyOnRide: newContact.notifyOnRide,
        };
        setContacts([...contacts, contact]);
        setNewContact({ name: '', phone: '', relationship: '', notifyOnRide: false });
        setShowAddModal(false);
    };

    const handleDeleteContact = (id: string) => {
        setContacts(contacts.filter(c => c.id !== id));
    };

    const handleSetPrimary = (id: string) => {
        setContacts(contacts.map(c => ({
            ...c,
            isPrimary: c.id === id,
        })));
    };

    const handleToggleNotify = (id: string) => {
        setContacts(contacts.map(c =>
            c.id === id ? { ...c, notifyOnRide: !c.notifyOnRide } : c
        ));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Emergency Contacts</h1>
                    <p className="text-gray-500">People who can be contacted in case of emergency</p>
                </div>
                <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setShowAddModal(true)}>
                    Add Contact
                </Button>
            </motion.div>

            {/* Safety Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card padding="md" className="bg-primary-50 border-primary-200">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-primary-900 mb-1">Your Safety Matters</h3>
                            <p className="text-primary-700 text-sm">
                                Your emergency contacts will be notified when you trigger SOS during a ride.
                                They'll receive your real-time location and ride details.
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Contacts List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {contacts.length === 0 ? (
                    <Card padding="lg" className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">No Emergency Contacts</h3>
                        <p className="text-gray-500 mb-4">Add people who should be contacted in case of emergency</p>
                        <Button onClick={() => setShowAddModal(true)}>Add Your First Contact</Button>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {contacts.map((contact, index) => (
                                <motion.div
                                    key={contact.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card padding="md">
                                        <div className="flex items-center gap-4">
                                            <Avatar size="lg" name={contact.name} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium text-gray-900">{contact.name}</p>
                                                    {contact.isPrimary && (
                                                        <Badge variant="primary" size="sm">Primary</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {contact.phone}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{contact.relationship}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleNotify(contact.id)}
                                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${contact.notifyOnRide
                                                        ? 'bg-success-100 text-success-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                        }`}
                                                >
                                                    {contact.notifyOnRide ? (
                                                        <Check className="w-4 h-4" />
                                                    ) : (
                                                        <X className="w-4 h-4" />
                                                    )}
                                                    Notify on ride
                                                </button>
                                                {!contact.isPrimary && (
                                                    <button
                                                        onClick={() => handleSetPrimary(contact.id)}
                                                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                                                        title="Set as primary"
                                                    >
                                                        <Star className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setEditingContact(contact)}
                                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteContact(contact.id)}
                                                    className="p-2 rounded-lg hover:bg-error-50 text-error-500"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>

            {/* Tips Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card padding="md">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-error-500" />
                        Safety Tips
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-success-500 mt-0.5" />
                            Add at least 2-3 trusted contacts for emergencies
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-success-500 mt-0.5" />
                            Enable "Notify on ride" for contacts who should track your trips
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-success-500 mt-0.5" />
                            Keep your primary contact updated with your travel plans
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-success-500 mt-0.5" />
                            Test the SOS feature to ensure contacts receive alerts
                        </li>
                    </ul>
                </Card>
            </motion.div>

            {/* Add Contact Modal */}
            <Modal
                open={showAddModal}
                onOpenChange={setShowAddModal}
                title="Add Emergency Contact"
                size="md"
            >
                <div className="space-y-4">
                    <Input
                        label="Full Name"
                        placeholder="Enter contact name"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    />
                    <Input
                        label="Phone Number"
                        placeholder="+91 XXXXX XXXXX"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    />
                    <Input
                        label="Relationship"
                        placeholder="e.g., Spouse, Parent, Friend"
                        value={newContact.relationship}
                        onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    />
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={newContact.notifyOnRide}
                            onChange={(e) => setNewContact({ ...newContact, notifyOnRide: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">Notify this contact when I start a ride</span>
                    </label>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" fullWidth onClick={() => setShowAddModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            onClick={handleAddContact}
                            disabled={!newContact.name || !newContact.phone}
                        >
                            Add Contact
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Contact Modal */}
            <Modal
                open={!!editingContact}
                onOpenChange={() => setEditingContact(null)}
                title="Edit Contact"
                size="md"
            >
                {editingContact && (
                    <div className="space-y-4">
                        <Input
                            label="Full Name"
                            value={editingContact.name}
                            onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                        />
                        <Input
                            label="Phone Number"
                            value={editingContact.phone}
                            onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                        />
                        <Input
                            label="Relationship"
                            value={editingContact.relationship}
                            onChange={(e) => setEditingContact({ ...editingContact, relationship: e.target.value })}
                        />
                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" fullWidth onClick={() => setEditingContact(null)}>
                                Cancel
                            </Button>
                            <Button
                                fullWidth
                                onClick={() => {
                                    setContacts(contacts.map(c =>
                                        c.id === editingContact.id ? editingContact : c
                                    ));
                                    setEditingContact(null);
                                }}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
