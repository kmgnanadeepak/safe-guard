import { useEffect, useState } from 'react';
import { MapPin, Share2 } from 'lucide-react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';

type LatLng = {
  lat: number;
  lng: number;
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

const LiveLocation = () => {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [updating, setUpdating] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ⛔ Put YOUR key here for now (for testing)
const { isLoaded, loadError } = useJsApiLoader({
  id: 'google-map-script',
  googleMapsApiKey: "AIzaSyDnkQlMqyOKx86yPbH05AFNgWIzp1a-Fp4",
});


  // ✅ Get real-time exact location from browser
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setErrorMsg('Geolocation is not available in this browser.');
      setUpdating(false);
      return;
    }

    // First: get current position once
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setUpdating(false);
      },
      (err) => {
        console.error('Error getting location:', err);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg('Location permission denied. Please allow access in browser settings.');
        } else {
          setErrorMsg('Unable to get current location.');
        }
        setUpdating(false);
      },
      {
        enableHighAccuracy: true,   // ask for GPS-level accuracy
        maximumAge: 0,              // do not use cached location
        timeout: 20000,
      }
    );

    // Then: keep watching for movement
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setErrorMsg(null);
        setUpdating(false);
      },
      (err) => {
        console.error('Error watching location:', err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 20000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const handleShareLocation = () => {
    if (!location) return;
    const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'My Live Location',
          text: 'Here is my current location',
          url,
        })
        .catch((err) => console.error('Error sharing:', err));
    } else {
      window.open(url, '_blank');
    }
  };

  // Map failed to load
  if (loadError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500 text-center">
          Failed to load map. Check your Maps API key / billing / restrictions.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Map container */}
      <div className="relative h-[60vh] bg-gradient-to-br from-primary/20 to-background overflow-hidden rounded-b-3xl">
        {isLoaded && location ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={17}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            }}
          >
            <MarkerF position={location} />
          </GoogleMap>
        ) : (
          // Waiting for map or location
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
            <div
              className="absolute inset-0 bg-muted/10"
              style={{
                backgroundImage:
                  'radial-gradient(circle at center, hsl(var(--primary) / 0.1) 0%, transparent 70%)',
              }}
            />
            <div className="relative mb-4">
              <MapPin className="w-16 h-16 text-destructive drop-shadow-lg animate-bounce" />
              <div className="absolute -inset-4 bg-destructive/20 rounded-full blur-xl animate-pulse" />
            </div>
            <p className="text-foreground font-medium relative z-10">
              {updating ? 'Getting your exact location…' : 'Waiting for location…'}
            </p>
            <p className="text-sm text-muted-foreground relative z-10">
              Please allow location access in your browser when prompted.
            </p>
            {errorMsg && (
              <p className="text-xs text-red-500 relative z-10">
                {errorMsg}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Location details panel */}
      <div className="p-6 space-y-4">
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <MapPin className="w-6 h-6 text-primary" />
            Live Location
          </h2>

          <div className="space-y-3 text-muted-foreground">
            <div className="flex justify-between">
              <span>Latitude:</span>
              <span className="font-mono text-foreground">
                {location ? location.lat.toFixed(6) : '...'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Longitude:</span>
              <span className="font-mono text-foreground">
                {location ? location.lng.toFixed(6) : '...'}
              </span>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-foreground font-medium">
                Current position from your device
              </p>
              <p className="text-sm">
                Accuracy depends on GPS, Wi-Fi, and mobile network of your device.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">
              {updating ? 'Updating location…' : 'Location fixed'}
            </span>
          </div>
        </div>

        <Button
          className="w-full h-14 rounded-2xl text-lg font-semibold neon-glow"
          size="lg"
          onClick={handleShareLocation}
          disabled={!location}
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share Location
        </Button>
      </div>
    </div>
  );
};

export default LiveLocation;
