import { Activity, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const Sensors = () => {
  const [accelData, setAccelData] = useState<number[]>([]);
  const [gyroData, setGyroData] = useState<number[]>([]);

  useEffect(() => {
    // Simulate sensor data updates
    const interval = setInterval(() => {
      setAccelData(prev => {
        const newData = [...prev, Math.random() * 20 - 10];
        return newData.slice(-50); // Keep last 50 points
      });
      setGyroData(prev => {
        const newData = [...prev, Math.random() * 5 - 2.5];
        return newData.slice(-50);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const renderGraph = (data: number[], color: string, threshold: number) => {
    const max = Math.max(...data, threshold);
    const min = Math.min(...data, -threshold);
    const range = max - min;

    return (
      <svg className="w-full h-32" viewBox="0 0 300 100">
        {/* Threshold lines */}
        <line
          x1="0"
          y1={((max - threshold) / range) * 100}
          x2="300"
          y2={((max - threshold) / range) * 100}
          stroke="hsl(var(--destructive))"
          strokeWidth="1"
          strokeDasharray="4"
          opacity="0.5"
        />
        <line
          x1="0"
          y1={((max + threshold) / range) * 100}
          x2="300"
          y2={((max + threshold) / range) * 100}
          stroke="hsl(var(--destructive))"
          strokeWidth="1"
          strokeDasharray="4"
          opacity="0.5"
        />
        
        {/* Data line */}
        <polyline
          points={data.map((val, i) => 
            `${(i / data.length) * 300},${((max - val) / range) * 100}`
          ).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Sensor Activity</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">AI Detecting in Real Time...</span>
          </div>
        </div>

        {/* Accelerometer */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Accelerometer</h2>
                <p className="text-sm text-muted-foreground">Impact detection</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                {accelData.length > 0 ? accelData[accelData.length - 1].toFixed(1) : '0.0'}
              </p>
              <p className="text-sm text-muted-foreground">m/s²</p>
            </div>
          </div>
          
          <div className="bg-background/50 rounded-2xl p-4">
            {renderGraph(accelData, 'hsl(var(--primary))', 15)}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Impact threshold</span>
            <span className="font-mono text-destructive">±15 m/s²</span>
          </div>
        </div>

        {/* Gyroscope */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Gyroscope</h2>
                <p className="text-sm text-muted-foreground">Immobility detection</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                {gyroData.length > 0 ? gyroData[gyroData.length - 1].toFixed(2) : '0.00'}
              </p>
              <p className="text-sm text-muted-foreground">rad/s</p>
            </div>
          </div>
          
          <div className="bg-background/50 rounded-2xl p-4">
            {renderGraph(gyroData, 'hsl(var(--warning))', 3)}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Immobility threshold</span>
            <span className="font-mono text-destructive">±3 rad/s</span>
          </div>
        </div>

        {/* Legend */}
        <div className="glass-card rounded-3xl p-4">
          <div className="flex gap-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-muted-foreground">Immobility</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sensors;
