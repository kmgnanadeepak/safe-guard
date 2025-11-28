import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity, Shield, Smartphone, ChevronRight, Check } from 'lucide-react';

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      icon: Shield,
      title: 'Welcome to SafeFall AI',
      description: 'Your phone will detect falls automatically and alert your emergency contacts when needed.',
    },
    {
      icon: Activity,
      title: 'How It Works',
      description: 'Our AI monitors motion sensors 24/7. When a fall is detected, you get 30 seconds to respond before we alert your contacts.',
      steps: ['Detect unusual motion', 'Confirm with countdown', 'Send emergency alert'],
    },
    {
      icon: Smartphone,
      title: 'Permissions Setup',
      description: 'To keep you safe, we need access to:',
      permissions: [
        { name: 'Motion Sensors', description: 'To detect falls' },
        { name: 'Location', description: 'To share your location' },
        { name: 'Notifications', description: 'To alert you' },
      ],
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('onboarding-complete', 'true');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-success rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === step
                  ? 'w-8 bg-primary'
                  : index < step
                  ? 'w-2 bg-success'
                  : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center neon-glow">
            <Icon className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">{currentStep.title}</h1>
          <p className="text-lg text-muted-foreground">{currentStep.description}</p>

          {currentStep.steps && (
            <div className="glass-card rounded-3xl p-6 text-left space-y-3 mt-6">
              {currentStep.steps.map((stepText, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">{index + 1}</span>
                  </div>
                  <span className="text-foreground">{stepText}</span>
                </div>
              ))}
            </div>
          )}

          {currentStep.permissions && (
            <div className="glass-card rounded-3xl p-6 space-y-4 mt-6">
              {currentStep.permissions.map((permission, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{permission.name}</p>
                    <p className="text-sm text-muted-foreground">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleNext}
            size="lg"
            className="w-full h-14 rounded-2xl text-lg font-semibold neon-glow"
          >
            {step === steps.length - 1 ? 'Enable All & Get Started' : 'Continue'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          {step < steps.length - 1 && (
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="w-full"
            >
              Skip for now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
