import { Phone, Edit, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary?: boolean;
}

const EmergencyContacts = () => {
  const [contacts] = useState<Contact[]>([
    { id: '1', name: 'Mom', relation: 'Mother', phone: '+91 98765 43210', isPrimary: true },
    { id: '2', name: 'Dr. Rao', relation: 'Doctor', phone: '+91 98765 43211' },
    { id: '3', name: 'John', relation: 'Brother', phone: '+91 98765 43212' },
  ]);

  const handleCall = (phone: string, name: string) => {
    // In production with Capacitor, use: window.open(`tel:${phone}`)
    toast.success(`Calling ${name}...`, {
      description: `In production, this opens dialer with ${phone}`,
    });
  };

  const handleEdit = (name: string) => {
    toast.info(`Edit contact: ${name}`, {
      description: 'This would open an edit dialog',
    });
  };

  const handleAdd = () => {
    toast.info('Add new contact', {
      description: 'This would open an add contact dialog',
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Emergency Contacts</h1>
            <p className="text-muted-foreground mt-1">Manage your emergency contact list</p>
          </div>
          <Button
            onClick={handleAdd}
            size="lg"
            className="rounded-2xl neon-glow"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

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
                      <h3 className="text-xl font-semibold text-foreground">{contact.name}</h3>
                      {contact.isPrimary && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{contact.relation}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-foreground font-mono">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {contact.phone}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleCall(contact.phone, contact.name)}
                  className="flex-1 rounded-2xl neon-glow-green"
                  style={{ backgroundColor: 'hsl(var(--success))' }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button
                  onClick={() => handleEdit(contact.name)}
                  variant="secondary"
                  className="flex-1 rounded-2xl"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>

        {contacts.length === 0 && (
          <div className="glass-card rounded-3xl p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No contacts yet</h3>
            <p className="text-muted-foreground mb-6">Add your first emergency contact to get started</p>
            <Button onClick={handleAdd} size="lg" className="rounded-2xl neon-glow">
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
