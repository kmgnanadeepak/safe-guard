import { useEffect, useState } from "react";

type AccelState = {
  x: number;
  y: number;
  z: number;
  magnitude: number;
};

type GyroState = {
  alpha: number;
  beta: number;
  gamma: number;
  magnitude: number;
};

export function useLiveSensorValues() {
  const [accel, setAccel] = useState<AccelState | null>(null);
  const [gyro, setGyro] = useState<GyroState | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      const rot = event.rotationRate;

      if (acc) {
        const x = acc.x ?? 0;
        const y = acc.y ?? 0;
        const z = acc.z ?? 0;
        const mag = Math.sqrt(x * x + y * y + z * z);

        setAccel({
          x,
          y,
          z,
          magnitude: mag,
        });
      }

      if (rot) {
        const alpha = rot.alpha ?? 0;
        const beta = rot.beta ?? 0;
        const gamma = rot.gamma ?? 0;
        const mag = Math.sqrt(alpha * alpha + beta * beta + gamma * gamma);

        setGyro({
          alpha,
          beta,
          gamma,
          magnitude: mag,
        });
      }
    };

    const askPermissionIfNeeded = async () => {
      try {
        // iOS 13+ permission
        // @ts-ignore
        if (
          typeof DeviceMotionEvent !== "undefined" &&
          // @ts-ignore
          typeof DeviceMotionEvent.requestPermission === "function"
        ) {
          // @ts-ignore
          await DeviceMotionEvent.requestPermission();
        }
      } catch (err) {
        console.error("Error requesting motion permission", err);
      }
    };

    askPermissionIfNeeded();

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  return { accel, gyro };
}
