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

        {/* Detection Settings */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground px-2">DETECTION</h2>
          
          <div className="glass-card rounded-3xl p-5 space-y-4">
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Countdown Duration</p>
                  <p className="text-sm text-muted-foreground">30 seconds</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Detection Sensitivity</p>
                  <p className="text-sm text-muted-foreground">Adjust fall detection threshold</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    key={level}
                    className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                      level === 'Medium'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground px-2">PERMISSIONS</h2>
          <div className="glass-card rounded-3xl p-5 space-y-4">
            {[
              { icon: Smartphone, label: 'Motion Sensors', status: 'Allowed' },
              { icon: MapPin, label: 'Location', status: 'Allowed' },
              { icon: Bell, label: 'Notifications', status: 'Allowed' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-foreground">{item.label}</span>
                </div>
                <span className="text-success text-sm font-medium">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sound & Vibrations */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground px-2">ALERTS</h2>
          <div className="glass-card rounded-3xl p-5 space-y-4">
            {[
              { label: 'Alert Sound', value: alertSound, onChange: setAlertSound },
              { label: 'Voice Prompts', value: voicePrompts, onChange: setVoicePrompts },
              { label: 'Vibration', value: vibration, onChange: setVibration },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-foreground">{item.label}</span>
                <Switch checked={item.value} onCheckedChange={item.onChange} />
              </div>
            ))}
          </div>
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
