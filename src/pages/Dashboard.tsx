import { Activity, Users, MapPin, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();

  const [accelerometer, setAccelerometer] = useState(0);
  const [gyroscope, setGyroscope] = useState(0);
  const [sensorSupported, setSensorSupported] = useState(true);

  // 🌐 Backend URL (MUST be set in .env)
  const API_URL = import.meta.env.VITE_API_URL;

  // 🔁 Call backend to send alert
  async function sendAlertToBackend(latitude: number | null, longitude: number | null) {
    if (!API_URL) {
      toast.error("Backend URL not configured. VITE_API_URL missing.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/send-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });

      const data = await response.json();

      console.log("⬅️ Backend reply:", data);

      if (!response.ok || !data.success) {
        console.error("❌ Backend error:", data.error);
        toast.error("SMS failed: " + (data.error?.message || "Unknown error"));
      } else {
        toast.success("SMS alert sent successfully.");
      }
    } catch (err) {
      console.error("❌ Network error calling backend:", err);
      toast.error("Network error. Could not send alert.");
    }
  }

  // 🚨 Manual or auto fall alert
  const handleTestFall = () => {
    toast.success("Fall detected! Sending alert...");

    if (!navigator.geolocation) {
      sendAlertToBackend(null, null);
      navigate("/fall-detected");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sendAlertToBackend(pos.coords.latitude, pos.coords.longitude);
        navigate("/fall-detected");
      },
      () => {
        sendAlertToBackend(null, null);
        navigate("/fall-detected");
      },
      { enableHighAccuracy: true }
    );
  };

  // 📱 Sensor reading logic
  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;

      if (acc) {
        const magnitude = Math.sqrt(
          (acc.x ?? 0) ** 2 + (acc.y ?? 0) ** 2 + (acc.z ?? 0) ** 2
        );
        setAccelerometer(magnitude);

        if (magnitude >= 25.5) {
          console.log("🚨 Fall detected:", magnitude);
          handleTestFall();
        }
      }

      const rot = event.rotationRate;
      if (rot) {
        const g = Math.sqrt(
          (rot.alpha ?? 0) ** 2 +
          (rot.beta ?? 0) ** 2 +
          (rot.gamma ?? 0) ** 2
        );
        setGyroscope(g);
      }
    };

    if ("DeviceMotionEvent" in window) {
      window.addEventListener("devicemotion", handleMotion);
    } else {
      setSensorSupported(false);
    }

    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Status */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">Status: SAFE</span>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
          <p className="text-gray-500">
            Fall detection is active
            {!sensorSupported && " • Sensors not supported"}
          </p>
        </div>

        {/* Sensor Values */}
        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Sensor Status
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Accelerometer</span>
              <span>{accelerometer.toFixed(2)} m/s²</span>
            </div>

            <div className="flex justify-between">
              <span>Gyroscope</span>
              <span>{gyroscope.toFixed(2)} °/s</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Button
          onClick={handleTestFall}
          className="w-full h-24 glass-card rounded-3xl"
          variant="destructive"
        >
          <AlertCircle className="w-8 h-8" />
          <div className="text-left ml-2">
            <div className="text-lg font-bold">Test Fall Detection</div>
            <div className="text-sm opacity-75">Simulate emergency alert</div>
          </div>
        </Button>

        <Button
          onClick={() => navigate("/emergency-contacts")}
          className="w-full h-24 glass-card rounded-3xl"
        >
          <Users className="w-8 h-8 text-primary" />
          <span className="ml-2 font-semibold">Emergency Contacts</span>
        </Button>

        <Button
          onClick={() => navigate("/live-location")}
          className="w-full h-24 glass-card rounded-3xl"
        >
          <MapPin className="w-8 h-8 text-primary" />
          <span className="ml-2 font-semibold">Live Location</span>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
