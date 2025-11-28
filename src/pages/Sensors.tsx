import { Activity, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShakeDetection } from "@/hooks/useShakeDetection";


const Sensors = () => {
  const [accelData, setAccelData] = useState<number[]>([]);
  const [gyroData, setGyroData] = useState<number[]>([]);
  const navigate = useNavigate();

  // 🔥 Use your shake detection hook here
  useShakeDetection(() => {
    navigate("/fall-detected");
  }, {
    threshold: 20,   // how hard the shake must be
    timeout: 1500,   // 1.5 seconds cooldown
  });

  // Read sensors for graph display
  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      const rot = event.rotationRate;

      if (acc) {
        const x = acc.x || 0;
        const y = acc.y || 0;
        const z = acc.z || 0;
        const magnitude = Math.sqrt(x * x + y * y + z * z);

        setAccelData((prev) => {
          const next = [...prev, magnitude];
          return next.slice(-50);
        });
      }

      if (rot) {
        const alpha = rot.alpha || 0;
        const beta = rot.beta || 0;
        const gamma = rot.gamma || 0;
        const rotationMagnitude = Math.sqrt(alpha * alpha + beta * beta + gamma * gamma);

        setGyroData((prev) => {
          const next = [...prev, rotationMagnitude];
          return next.slice(-50);
        });
      }
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  const renderGraph = (data: number[], color: string, threshold: number) => {
    if (data.length === 0) {
      return (
        <div className="w-full h-32 flex items-center justify-center text-xs text-muted-foreground">
          Move or shake your phone to see live sensor data.
        </div>
      );
    }

    const maxData = Math.max(...data, threshold);
    const minData = Math.min(...data, -threshold);
    const range = maxData - minData || 1;

    return (
      <svg className="w-full h-32" viewBox="0 0 300 100">
        <line
          x1="0"
          y1={((maxData - threshold) / range) * 100}
          x2="300"
          y2={((maxData - threshold) / range) * 100}
          stroke="hsl(var(--destructive))"
          strokeWidth="1"
          strokeDasharray="4"
          opacity="0.5"
        />
        <line
          x1="0"
          y1={((maxData + threshold) / range) * 100}
          x2="300"
          y2={((maxData + threshold) / range) * 100}
          stroke="hsl(var(--destructive))"
          strokeWidth="1"
          strokeDasharray="4"
          opacity="0.5"
        />

        <polyline
          points={data
            .map((val, i) => {
              const x = (i / (data.length - 1 || 1)) * 300;
              const y = ((maxData - val) / range) * 100;
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      </svg>
    );
  };

  const currentAccel = accelData[accelData.length - 1] || 0;
  const currentGyro = gyroData[gyroData.length - 1] || 0;

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Sensor Activity</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">
              Shake your phone hard to trigger fall detection.
            </span>
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
                <p className="text-sm text-muted-foreground">Impact / Shake Detection</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                {currentAccel.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">m/s²</p>
            </div>
          </div>

          <div className="bg-background/50 rounded-2xl p-4">
            {renderGraph(accelData, "hsl(var(--primary))", 15)}
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
                <p className="text-sm text-muted-foreground">Rotation / Movement</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                {currentGyro.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">°/s</p>
            </div>
          </div>

          <div className="bg-background/50 rounded-2xl p-4">
            {renderGraph(gyroData, "hsl(var(--warning))", 300)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sensors;
