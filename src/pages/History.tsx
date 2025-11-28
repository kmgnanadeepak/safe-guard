import { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type EventType = 'all' | 'falls' | 'alerts';
type Severity = 'low' | 'medium' | 'high';

interface Event {
  id: string;
  type: 'fall' | 'canceled' | 'alert';
  time: string;
  location: string;
  severity: Severity;
}

const mockEvents: Event[] = [
  { id: '1', type: 'alert', time: 'Today • 10:32 PM', location: 'Near MG Road', severity: 'high' },
  { id: '2', type: 'canceled', time: 'Today • 3:45 PM', location: 'Home', severity: 'low' },
  { id: '3', type: 'fall', time: 'Yesterday • 9:20 AM', location: 'Gym', severity: 'medium' },
  { id: '4', type: 'canceled', time: 'Yesterday • 6:15 PM', location: 'Office', severity: 'low' },
  { id: '5', type: 'fall', time: '2 days ago • 11:30 AM', location: 'Park', severity: 'medium' },
];

const History = () => {
  const [filter, setFilter] = useState<EventType>('all');

  const filteredEvents = mockEvents.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'falls') return event.type === 'fall';
    if (filter === 'alerts') return event.type === 'alert';
    return true;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertCircle className="w-6 h-6 text-destructive" />;
      case 'canceled': return <XCircle className="w-6 h-6 text-muted-foreground" />;
      case 'fall': return <AlertCircle className="w-6 h-6 text-warning" />;
      default: return null;
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'alert': return 'Emergency Alert Sent';
      case 'canceled': return 'Fall Detected - Canceled';
      case 'fall': return 'Fall Detected';
      default: return '';
    }
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'low': return 'bg-muted text-muted-foreground';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'high': return 'bg-destructive/20 text-destructive';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Event History</h1>

        {/* Filter tabs */}
        <div className="glass-card rounded-3xl p-2 flex gap-2">
          {(['all', 'falls', 'alerts'] as EventType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all ${
                filter === type
                  ? 'bg-primary text-primary-foreground neon-glow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {type === 'all' ? 'All Events' : type === 'falls' ? 'Falls Only' : 'Alerts Only'}
            </button>
          ))}
        </div>

        {/* Events list */}
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <div key={event.id} className="glass-card rounded-3xl p-5 space-y-3 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getEventIcon(event.type)}
                  <div>
                    <p className="font-semibold text-foreground">{getEventLabel(event.type)}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </p>
                  </div>
                </div>
                <Badge className={getSeverityColor(event.severity)}>
                  {event.severity}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pl-9">
                <MapPin className="w-4 h-4" />
                {event.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
