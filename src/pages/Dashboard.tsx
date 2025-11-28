import { Activity, MessageSquare, Users, MapPin, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();

  // --- Sensor State (numeric values) ---
  const [accelerometer, setAccelerometer] = useState<number>(0); // m/s² magnitude
  const [gyroscope, setGyroscope] = useState<number>(0); // deg/s magnitude
  const [sensorSupported, setSensorSupported] = useState<boolean>(true);

  const API_URL = import.meta.env.VITE_API_URL as string | undefined; // e.g. https://safebackend.onrender.com

  // 🔁 Helper: call backend to send SMS
  async function sendAlertToBackend(latitude: number | null, longitude: number | null) {
    try {
      if (!API_URL) {
        console.error("❌ VITE_API_URL is not set in frontend .env");
        toast.error("Backend URL not configured (VITE_API_URL missing).");
        return;
      }

      console.log("➡️ Calling backend:", `${API_URL}/send-alert`, {
        latitude,
        longitude,
      });

      const res = await fetch(`${API_URL}/send-alert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude,
          longitude,
        }),
      });

      const data = await res.json();
      console.log("⬅️ Backend response:", data);

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to send SMS alert. Check backend/Twilio config.");
      } else {
        toast.success("SMS alert sent to emergency contacts.");
      }
    } catch (error) {
      console.error("❌ Error calling backend:", error);
      toast.error("Network error while sending alert.");
    }
  }

  // 🚨 Triggered when fall is detected (auto or Test button)
  const handleTestFall = () => {
    toast.success("Fall detected! Sending SMS to emergency contacts...", {
      description: "Location will be attached if available.",
    });

    // 1) Get GPS location
    if (!navigator.geolocation) {
      console.error("❌ Geolocation not supported in this browser");
      // fallback: send without location
      sendAlertToBackend(null, null);
      navigate("/fall-detected");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        console.log("📍 Got location:", latitude, longitude);

        // 2) Call backend with real location
        sendAlertToBackend(latitude, longitude);
        navigate("/fall-detected");
      },
      (err) => {
        console.error("❌ Geolocation error:", err);

        // fallback: still send alert without location
        sendAlertToBackend(null, null);
        navigate("/fall-detected");
      },
      { enableHighAccuracy: true }
    );
  };

  // --- Auto start sensors when Dashboard is mounted ---
  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;

      if (acc) {
        const x = acc.x ?? 0;
        const y = acc.y ?? 0;
        const z = acc.z ?? 0;

        // Magnitude in m/s²
        const magnitudeMs2 = Math.sqrt(x * x + y * y + z * z);
        setAccelerometer(magnitudeMs2);

        // ---- AUTO FALL DETECTION ----
        // ≈ 2.6 g => 2.6 * 9.81 ≈ 25.5 m/s²
        if (magnitudeMs2 >= 25.5) {
          console.log("🚨 Fall threshold crossed:", magnitudeMs2);
          handleTestFall();
        }
      }

      const rot = event.rotationRate;
      if (rot) {
        const gx = rot.alpha ?? 0;
        const gy = rot.beta ?? 0;
        const gz = rot.gamma ?? 0;
        const gyroMag = Math.sqrt(gx * gx + gy * gy + gz * gz);
        setGyroscope(gyroMag);
      }
    };

    if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
      try {
        window.addEventListener("devicemotion", handleMotion);
      } catch (err) {
        console.error("❌ Error attaching devicemotion:", err);
        setSensorSupported(false);
      }
    } else {
      console.warn("⚠️ DeviceMotionEvent not supported in this browser");
      setSensorSupported(false);
    }

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Status Banner */}
        <div className="glass-card rounded-3xl p-6 neon-glow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-foreground">Status: SAFE</span>
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
          </div>
          <p className="text-muted-foreground">
            Fall detection is active
            {!sensorSupported && " • Sensors not supported on this device/browser"}
          </p>
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
                {sensorSupported ? "Active" : "Inactive"} • {accelerometer.toFixed(2)} m/s²
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Gyroscope</span>
              <span className="text-success font-medium">
                {sensorSupported ? "Active" : "Inactive"} • {gyroscope.toFixed(2)} °/s
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
              onClick={() => navigate("/emergency-contacts")}
              className="h-32 glass-card rounded-3xl hover:scale-105 transition-transform"
              variant="secondary"
            >
              <div className="flex flex-col items-center gap-2 text-foreground">
                <Users className="w-8 h-8 text-primary" />
                <span className="font-semibold">Emergency Contacts</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate("/chatbot")}
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
            onClick={() => navigate("/live-location")}
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
