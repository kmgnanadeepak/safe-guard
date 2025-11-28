import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';

type LatLng = {
  lat: number;
  lng: number;
};

type TimelineItem = {
  status: string;
  time: string;
  complete: boolean;
};

// ⚠️ In a real app move this to env
const GOOGLE_MAPS_API_KEY = 'AIzaSyDnkQlMqyOKx86yPbH05AFNgWIzp1a-Fp4';

// Fallback (used before we know your real location)
const DEFAULT_CENTER: LatLng = {
  lat: 12.9716,
  lng: 77.5946,
};

const AlertSent = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState<LatLng | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<'waiting' | 'ok' | 'error'>('waiting');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  // 🔔 backend alert status
  const [alertStatus, setAlertStatus] = useState<
    'idle' | 'sending' | 'success' | 'failed'
  >('idle');
  const [alertError, setAlertError] = useState<string | null>(null);

  // Make sure we only send once per screen mount
  const hasSentAlertRef = useRef(false);

  // Load Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const containerStyle = {
    width: '100%',
    height: '100%',
  } as const;

  // 1️⃣ Get user's current geolocation once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('geolocation' in navigator)) {
      setStatus('error');
      setErrorMsg('Geolocation is not supported on this device.');
      return;
    }

    setStatus('waiting');
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords: LatLng = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(coords);
        setStatus('ok');

        // Reverse geocode to address
        try {
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_MAPS_API_KEY}`;
          const res = await fetch(url);
          const data = await res.json();

          if (data.status === 'OK' && data.results && data.results[0]) {
            setAddress(data.results[0].formatted_address);
          } else {
            setAddress(null);
          }
        } catch (err) {
          console.error('Error while reverse geocoding:', err);
          setAddress(null);
        }
      },
      (err) => {
        console.error('Error getting location:', err);
        setStatus('error');
        setErrorMsg(
          err.code === 1
            ? 'Location permission denied. Please allow access in browser settings.'
            : 'Unable to get your location. Please try again.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 5000,
      }
    );
  }, []);

  // 2️⃣ Build dynamic timeline based on current time
  useEffect(() => {
    const now = new Date(); // alert sent time

    const makeTime = (offsetSeconds: number) => {
      const d = new Date(now.getTime() + offsetSeconds * 1000);
      return d.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    };

    const items: TimelineItem[] = [
      {
        status: 'Fall detected',
        time: makeTime(-30),
        complete: true,
      },
      {
        status: 'Countdown started',
        time: makeTime(-25),
        complete: true,
      },
      {
        status: 'No response',
        time: makeTime(-10),
        complete: true,
      },
      {
        status: 'Alert sent',
        time: makeTime(0),
        complete: true,
      },
    ];

    setTimeline(items);
  }, []);

  // 3️⃣ Your sendEmergencyAlert logic, but using component state
  const sendEmergencyAlert = async () => {
    if (!location) {
      alert('Location not available!');
      return;
    }

    try {
      setAlertStatus('sending');
      setAlertError(null);

const firstContact = "+919441652345";
 // TODO: replace with your verified number or selected contact

      const res = await fetch('http://localhost:5000/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactNumber: firstContact,
          latitude: location.lat,
          longitude: location.lng,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAlertStatus('success');
        alert('SOS alert sent!');
      } else {
        setAlertStatus('failed');
        setAlertError(data.message || 'Failed to send alert.');
        alert('Failed to send alert.');
      }
    } catch (err: any) {
      console.error('Error sending alert to backend:', err);
      setAlertStatus('failed');
      setAlertError(err?.message || 'Network error while sending alert.');
      alert('Failed to send alert (network error).');
    }
  };

  // 4️⃣ Auto-call sendEmergencyAlert ONCE when location is ready
  useEffect(() => {
    if (!location) return;
    if (hasSentAlertRef.current) return;

    hasSentAlertRef.current = true;
    sendEmergencyAlert();
  }, [location]);

  const mapCenter = location || DEFAULT_CENTER;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-8 pt-12">
        {/* Success header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center neon-glow-green">
              <CheckCircle2 className="w-16 h-16 text-success" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            {alertStatus === 'success'
              ? 'Alert Sent'
              : alertStatus === 'sending'
              ? 'Sending Alert…'
              : 'Preparing Alert…'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {alertStatus === 'success'
              ? 'Your emergency contacts have received your location.'
              : 'Contacting your emergency network with your latest location.'}
          </p>

          {alertStatus === 'sending' && (
            <p className="text-sm text-muted-foreground">
              Sending SOS to your emergency contact…
            </p>
          )}

          {alertStatus === 'failed' && (
            <p className="text-sm text-destructive">
              {alertError || 'Failed to send SOS to server.'}
            </p>
          )}
        </div>

        {/* Location card */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Your Location
            </h2>
          </div>

          {/* Map with dynamic marker */}
          <div className="w-full h-48 rounded-2xl relative overflow-hidden">
            {loadError && (
              <div className="w-full h-full bg-muted/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                <p className="text-sm text-destructive text-center px-4">
                  Failed to load map. Check your internet connection or Maps API
                  key.
                </p>
              </div>
            )}

            {!loadError && isLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={16}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  mapTypeControl: false,
                  streetViewControl: false,
                  fullscreenControl: false,
                }}
              >
                {location && <MarkerF position={location} />}
              </GoogleMap>
            )}

            {!loadError && !isLoaded && (
              <div className="w-full h-full bg-muted/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                <MapPin className="w-12 h-12 text-primary animate-bounce" />
              </div>
            )}
          </div>

          {/* Dynamic location text */}
          <div className="mt-3 text-center space-y-1">
            {status === 'waiting' && (
              <p className="text-sm text-muted-foreground">
                Waiting for location… please allow location access in your
                browser.
              </p>
            )}

            {status === 'error' && (
              <p className="text-sm text-destructive">
                {errorMsg ||
                  'Unable to access your location. Please check browser permissions.'}
              </p>
            )}

            {status === 'ok' && location && (
              <>
                <p className="text-muted-foreground">
                  {address
                    ? address
                    : 'Approximate current area based on your device GPS.'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Lat: {location.lat.toFixed(6)}, Lng:{' '}
                  {location.lng.toFixed(6)}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            Event Timeline
          </h2>

          <div className="space-y-4">
            {(timeline.length
              ? timeline
              : [
                  {
                    status: 'Fall detected',
                    time: '--:--:--',
                    complete: true,
                  },
                  {
                    status: 'Countdown started',
                    time: '--:--:--',
                    complete: true,
                  },
                  {
                    status: 'No response',
                    time: '--:--:--',
                    complete: true,
                  },
                  {
                    status: 'Alert sent',
                    time: '--:--:--',
                    complete: true,
                  },
                ]
            ).map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.complete ? 'bg-success' : 'bg-muted'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-foreground font-medium">{item.status}</p>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => navigate('/')}
          className="w-full h-14 rounded-2xl text-lg font-semibold"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default AlertSent;
