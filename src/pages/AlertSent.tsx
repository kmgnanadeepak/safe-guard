import { CheckCircle2, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AlertSent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-8 pt-12">
        {/* Success header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center neon-glow-green">
              <CheckCircle2 className="w-16 h-16 text-success" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Alert Sent</h1>
          <p className="text-xl text-muted-foreground">
            Your emergency contacts have received your location.
          </p>
        </div>

        {/* Location card */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Your Location</h2>
          </div>
          
          {/* Mock map placeholder */}
          <div className="w-full h-48 bg-muted/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
            <MapPin className="w-12 h-12 text-primary animate-bounce" />
          </div>

          <p className="text-muted-foreground text-center">
            Near MG Road, Bangalore • Lat: 12.9716, Lng: 77.5946
          </p>
        </div>

        {/* Timeline */}
        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            Event Timeline
          </h2>
          
          <div className="space-y-4">
            {[
              { status: 'Fall detected', time: '10:32:15 PM', complete: true },
              { status: 'Countdown started', time: '10:32:16 PM', complete: true },
              { status: 'No response', time: '10:32:46 PM', complete: true },
              { status: 'Alert sent', time: '10:32:47 PM', complete: true },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${item.complete ? 'bg-success' : 'bg-muted'}`} />
                <div className="flex-1">
                  <p className="text-foreground font-medium">{item.status}</p>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => navigate('/')}
          className="w-full h-14 rounded-2xl text-lg font-semibold"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default AlertSent;
