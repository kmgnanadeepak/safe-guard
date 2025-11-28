import React, { useState } from 'react';
import { Phone, Edit, Plus, Users, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary?: boolean;
}

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Mom',
      relation: 'Mother',
      phone: '+91 98765 43210',
      isPrimary: true,
    },
    {
      id: '2',
      name: 'Dr. Rao',
      relation: 'Doctor',
      phone: '+91 98765 43211',
    },
    {
      id: '3',
      name: 'John',
      relation: 'Brother',
      phone: '+91 98765 43212',
    },
  ]);

  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');

  const handleCall = (phoneNumber: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleEdit = (id: string) => {
    // simple placeholder – you can later open a dialog here
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;

    setName(contact.name);
    setRelation(contact.relation);
    setPhone(contact.phone);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      name: name.trim(),
      relation: relation.trim() || 'Contact',
      phone: phone.trim(),
      isPrimary: contacts.length === 0, // first one becomes primary
    };

    setContacts((prev) => [...prev, newContact]);
    setName('');
    setRelation('');
    setPhone('');
  };

  const handleSetPrimary = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      })),
    );
  };

  const handleRemove = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Emergency Contacts
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your emergency contact list
            </p>
          </div>
        </div>

        {/* Add contact form */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Add new contact
          </h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Name *
              </label>
              <input
                className="w-full rounded-2xl bg-background/60 border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mom"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Relation
              </label>
              <input
                className="w-full rounded-2xl bg-background/60 border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="e.g. Mother, Friend, Doctor"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Phone number *
              </label>
              <input
                className="w-full rounded-2xl bg-background/60 border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98XXXXXXXX"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full rounded-2xl neon-glow">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </form>
        </div>

        {/* List of contacts */}
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`glass-card rounded-3xl p-6 space-y-4 ${
                contact.isPrimary ? 'ring-2 ring-primary neon-glow' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {contact.name}
                      </h3>
                      {contact.isPrimary && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {contact.relation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-foreground font-mono">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {contact.phone}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleCall(contact.phone)}
                  className="flex-1 rounded-2xl neon-glow-green"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>

                <Button
                  onClick={() => handleEdit(contact.id)}
                  variant="secondary"
                  className="rounded-2xl"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>

                <Button
                  onClick={() => handleSetPrimary(contact.id)}
                  variant="outline"
                  className="rounded-2xl"
                >
                  <Star
                    className={`w-4 h-4 mr-1 ${
                      contact.isPrimary ? 'fill-yellow-400 text-yellow-400' : ''
                    }`}
                  />
                  Primary
                </Button>

                <Button
                  onClick={() => handleRemove(contact.id)}
                  variant="destructive"
                  className="rounded-2xl"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {contacts.length === 0 && (
          <div className="glass-card rounded-3xl p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No contacts yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Add your first emergency contact to get started
            </p>
            <Button size="lg" className="rounded-2xl neon-glow">
              <Plus className="w-5 h-5 mr-2" />
              Add Contact
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyContacts;
