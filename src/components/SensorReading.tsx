import { useEffect, useState } from "react";

type MotionData = {
  ax: number | null;
  ay: number | null;
  az: number | null;
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
};

const SensorDebug = () => {
  const [data, setData] = useState<MotionData>({
    ax: null,
    ay: null,
    az: null,
    alpha: null,
    beta: null,
    gamma: null,
  });

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      setData(prev => ({
        ...prev,
        ax: acc.x ?? 0,
        ay: acc.y ?? 0,
        az: acc.z ?? 0,
      }));
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setData(prev => ({
        ...prev,
        alpha: event.alpha ?? 0,
        beta: event.beta ?? 0,
        gamma: event.gamma ?? 0,
      }));
    };

    // ✅ For iOS: permission required (Android usually just works)
    const askPermissionIfNeeded = async () => {
      // @ts-ignore
      if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
        try {
          // @ts-ignore
          const res = await DeviceMotionEvent.requestPermission();
          if (res !== "granted") {
            console.log("Motion permission not granted");
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    askPermissionIfNeeded();

    window.addEventListener("devicemotion", handleMotion);
    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Sensor Debug</h2>
      <p>Accelerometer (with gravity):</p>
      <p>X: {data.ax?.toFixed(3)} m/s²</p>
      <p>Y: {data.ay?.toFixed(3)} m/s²</p>
      <p>Z: {data.az?.toFixed(3)} m/s²</p>

      <p style={{ marginTop: 16 }}>Gyroscope / Orientation:</p>
      <p>Alpha (Z): {data.alpha?.toFixed(3)}°</p>
      <p>Beta (X): {data.beta?.toFixed(3)}°</p>
      <p>Gamma (Y): {data.gamma?.toFixed(3)}°</p>
    </div>
  );
};

export default SensorDebug;
