import { useEffect, useRef } from "react";

type Options = {
  threshold?: number; // how strong the shake must be (acc magnitude)
  timeout?: number;   // minimum time between two triggers (ms)
};

/**
 * useShakeDetection
 * Listens to device motion and calls `onShake` when an unusual shake is detected.
 *
 * Usage:
 *   useShakeDetection(() => {
 *     // your button / emergency logic here
 *   }, { threshold: 20, timeout: 1000 });
 */
export function useShakeDetection(onShake: () => void, options: Options = {}) {
  const { threshold = 20, timeout = 1000 } = options;
  const lastShakeTimeRef = useRef(0);

  useEffect(() => {
    // If running in a non-browser environment, do nothing
    if (typeof window === "undefined") return;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc) return;

      const x = acc.x ?? 0;
      const y = acc.y ?? 0;
      const z = acc.z ?? 0;

      // magnitude of acceleration vector
      const magnitude = Math.sqrt(x * x + y * y + z * z);

      const now = Date.now();

      if (magnitude > threshold && now - lastShakeTimeRef.current > timeout) {
        lastShakeTimeRef.current = now;
        onShake();
      }
    };

    const askPermissionIfNeeded = async () => {
      try {
        // iOS 13+ requires explicit permission
        // @ts-ignore
        if (
          typeof DeviceMotionEvent !== "undefined" &&
          // @ts-ignore
          typeof DeviceMotionEvent.requestPermission === "function"
        ) {
          // @ts-ignore
          const res = await DeviceMotionEvent.requestPermission();
          console.log("Motion permission result:", res);
        }
      } catch (err) {
        console.error("Error requesting motion permission", err);
      }
    };

    askPermissionIfNeeded();

    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [onShake, threshold, timeout]);
}
