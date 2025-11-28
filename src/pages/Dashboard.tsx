import { Activity, MessageSquare, Users, MapPin, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();

  // --- Sensor State (numeric values) ---
  const [accelerometer, setAccelerometer] = useState<number>(9.8);
  const [gyroscope, setGyroscope] = useState<number>(0.2);

  // --- Auto-update every 1 second ---
useEffect(() => {
  const interval = setInterval(() => {
    // generate new mock sensor numbers
    const newAccel = 1.9 + Math.random() * 0.8;
    const newGyro = 0.1 + Math.random() * 0.4;

    setAccelerometer(newAccel);
    setGyroscope(newGyro);

    // ---- AUTO FALL DETECTION ----
    if (newAccel >= 2.6) {
      handleTestFall();  // triggers fall-detected screen automatically
    }

  }, 1000);

  return () => clearInterval(interval);
}, []);


  const handleTestFall = () => {
    toast.success('Fall detected! SMS would be sent to emergency contact.', {
      description: 'In production, this triggers real SMS via Capacitor.',
    });
    navigate('/fall-detected');
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Status Banner */}
        <div className="glass-card rounded-3xl p-6 neon-glow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-foreground">Status: SAFE</span>
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
          </div>
          <p className="text-muted-foreground">Fall detection is active</p>
        </div>

        {/* Sensor Status */}
        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Sensor Status
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Accelerometer</span>
              <span className="text-success font-medium">
                Active • {accelerometer.toFixed(2)} m/s²
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Gyroscope</span>
              <span className="text-success font-medium">
                Active • {gyroscope.toFixed(2)} rad/s
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground px-2">Quick Actions</h2>

          <Button
            onClick={handleTestFall}
            className="w-full h-24 glass-card rounded-3xl neon-glow-red hover:scale-105 transition-transform"
            variant="destructive"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8" />
              <div className="text-left">
                <div className="text-lg font-bold">Test Fall Detection</div>
                <div className="text-sm opacity-90">Simulate emergency alert</div>
              </div>
            </div>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => navigate('/emergency-contacts')}
              className="h-32 glass-card rounded-3xl hover:scale-105 transition-transform"
              variant="secondary"
            >
              <div className="flex flex-col items-center gap-2 text-foreground">
                <Users className="w-8 h-8 text-primary" />
                <span className="font-semibold">Emergency Contacts</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/chatbot')}
              className="h-32 glass-card rounded-3xl hover:scale-105 transition-transform"
              variant="secondary"
            >
              <div className="flex flex-col items-center gap-2 text-foreground">
                <MessageSquare className="w-8 h-8 text-primary" />
                <span className="font-semibold">AI Chatbot</span>
              </div>
            </Button>
          </div>

          <Button
            onClick={() => navigate('/live-location')}
            className="w-full h-24 glass-card rounded-3xl neon-glow hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-3 text-foreground">
              <MapPin className="w-8 h-8 text-primary" />
              <div className="text-left">
                <div className="text-lg font-bold">Live Location</div>
                <div className="text-sm opacity-75">View real-time tracking</div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
