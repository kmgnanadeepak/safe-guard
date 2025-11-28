import { ChevronRight, Users, Clock, Activity, Bell, Smartphone, MapPin, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [alertSound, setAlertSound] = useState(true);
  const [voicePrompts, setVoicePrompts] = useState(true);
  const [vibration, setVibration] = useState(true);

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>

        {/* Emergency Contacts */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground px-2">EMERGENCY</h2>
          <button
            onClick={() => navigate('/emergency-contacts')}
            className="w-full glass-card rounded-3xl p-5 flex items-center justify-between hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-destructive" />
              </div>
              <span className="font-medium text-foreground">Manage Contacts</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>






        {/* Appearance */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground px-2">APPEARANCE</h2>
          <div className="glass-card rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                <span className="text-foreground">Dark Mode</span>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;