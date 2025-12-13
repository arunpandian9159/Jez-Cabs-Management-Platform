import { useState, useEffect, useCallback } from 'react';
import { safetyService } from '@/services';

export interface EmergencyContactDisplay {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  notifyOnRide: boolean;
}

const initialNewContact = {
  name: '',
  phone: '',
  relationship: '',
  notifyOnRide: false,
};

export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContactDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] =
    useState<EmergencyContactDisplay | null>(null);
  const [newContact, setNewContact] = useState(initialNewContact);

  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await safetyService.getEmergencyContacts();
      const formatted: EmergencyContactDisplay[] = data.map((contact) => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship,
        isPrimary: contact.is_primary,
        notifyOnRide: contact.notify_on_trip_start,
      }));
      setContacts(formatted);
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleAddContact = async () => {
    try {
      const created = await safetyService.createEmergencyContact({
        name: newContact.name,
        phone: newContact.phone,
        relationship: newContact.relationship,
        is_primary: contacts.length === 0,
        notify_on_trip_start: newContact.notifyOnRide,
      });
      const newContactDisplay: EmergencyContactDisplay = {
        id: created.id,
        name: created.name,
        phone: created.phone,
        relationship: created.relationship,
        isPrimary: created.is_primary,
        notifyOnRide: created.notify_on_trip_start,
      };
      setContacts([...contacts, newContactDisplay]);
      setNewContact(initialNewContact);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await safetyService.deleteEmergencyContact(id);
      setContacts(contacts.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await safetyService.setPrimaryContact(id);
      setContacts(contacts.map((c) => ({ ...c, isPrimary: c.id === id })));
    } catch (error) {
      console.error('Error setting primary contact:', error);
    }
  };

  const handleToggleNotify = async (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;
    try {
      await safetyService.updateEmergencyContact(id, {
        notify_on_trip_start: !contact.notifyOnRide,
      });
      setContacts(
        contacts.map((c) =>
          c.id === id ? { ...c, notifyOnRide: !c.notifyOnRide } : c
        )
      );
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleSaveEdit = () => {
    if (!editingContact) return;
    setContacts(
      contacts.map((c) => (c.id === editingContact.id ? editingContact : c))
    );
    setEditingContact(null);
  };

  return {
    contacts,
    isLoading,
    showAddModal,
    editingContact,
    newContact,
    setShowAddModal,
    setEditingContact,
    setNewContact,
    handleAddContact,
    handleDeleteContact,
    handleSetPrimary,
    handleToggleNotify,
    handleSaveEdit,
  };
}
