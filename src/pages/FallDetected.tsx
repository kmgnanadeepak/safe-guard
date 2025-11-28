import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;

const FallDetected = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/alert-sent');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleImOk = () => {
    navigate('/');
  };

  const handleSendHelp = () => {
    navigate('/alert-sent');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background glows */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-destructive rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8 text-center">
        {/* Vibrating phone icon */}
        <div className="flex justify-center">
          <div className="animate-bounce">
            <Smartphone className="w-16 h-16 text-destructive" />
          </div>
        </div>

        {/* Main title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Possible Fall Detected</h1>
          <p className="text-xl text-muted-foreground">Are you OK?</p>
        </div>

        {/* Countdown circle */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted opacity-20"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-destructive transition-all duration-1000"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - countdown / 30)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-foreground">{countdown}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleImOk}
            className="w-full h-16 rounded-2xl text-lg font-bold neon-glow-green"
            variant="default"
            style={{ backgroundColor: 'hsl(var(--success))' }}
          >
            I'm OK
          </Button>
          <Button
            onClick={handleSendHelp}
            className="w-full h-16 rounded-2xl text-lg font-bold neon-glow-red"
            variant="destructive"
          >
            Send Help Now
          </Button>
        </div>

        {/* Info text */}
        <p className="text-sm text-muted-foreground">
          If you do nothing, the app will notify your emergency contacts.
        </p>
      </div>
    </div>
  );
};

export default FallDetected;
