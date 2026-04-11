"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const containerStyle = { width: "100%", height: "500px", borderRadius: "16px" };
const defaultCenter = { lat: 51.0447, lng: -114.0719 };

interface Event {
  id: string;
  title: string;
  venue: string;
  location: string;
  date: string;
}

interface AllEventsMapProps {
  events: Event[];
}

// Global flag to track if script is already loaded
let scriptLoaded = false;
let scriptLoading = false;
let pendingCallbacks: (() => void)[] = [];

export default function AllEventsMap({ events }: AllEventsMapProps) {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string>("");
  const markersRef = useRef<any[]>([]);
  const mapInstanceRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Load Google Maps script only once globally
  useEffect(() => {
    if (!apiKey) {
      setMapError("API key is missing");
      return;
    }

    // If script already loaded, initialize map
    if (scriptLoaded && window.google) {
      setMapLoaded(true);
      return;
    }

    // If script is currently loading, add callback
    if (scriptLoading) {
      pendingCallbacks.push(() => {
        setMapLoaded(true);
      });
      return;
    }

    // Start loading script
    scriptLoading = true;

    // Remove existing script if any (to avoid duplicates)
    const existingScript = document.querySelector('#google-maps-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and load script
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Define callback function
    (window as any).initMap = () => {
      console.log("✅ Google Maps loaded successfully");
      scriptLoaded = true;
      scriptLoading = false;
      setMapLoaded(true);
      
      // Execute all pending callbacks
      pendingCallbacks.forEach(cb => cb());
      pendingCallbacks = [];
    };

    script.onerror = () => {
      console.error("❌ Failed to load Google Maps");
      scriptLoading = false;
      setMapError("Failed to load Google Maps. Check your API key and internet connection.");
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove script on unmount
      // Keep it for other components
    };
  }, [apiKey]);

  // Initialize map when loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      // Create map instance
      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 10,
        mapId: "DEMO_MAP_ID",
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: true,
      });
      mapInstanceRef.current = map;

      // Create info window
      const infoWin = new window.google.maps.InfoWindow();
      infoWindowRef.current = infoWin;

      // Geocode and add markers for each event
      const geocoder = new window.google.maps.Geocoder();
      const bounds = new window.google.maps.LatLngBounds();
      
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      events.forEach((event) => {
        const address = `${event.venue}, ${event.location}`;
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const location = results[0].geometry.location;
            const marker = new window.google.maps.Marker({
              position: location,
              map: map,
              title: event.title,
              animation: window.google.maps.Animation.DROP,
            });

            // Add click listener
            marker.addListener("click", () => {
              infoWin.setContent(`
                <div style="padding: 8px; max-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
                  <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #0f172a;">${event.title}</h3>
                  <p style="font-size: 12px; color: #475569; margin-bottom: 2px;">${event.venue}</p>
                  <p style="font-size: 12px; color: #475569; margin-bottom: 8px;">${event.location}</p>
                  <p style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${event.date}</p>
                  <button 
                    onclick="window.viewEventDetails('${event.id}')"
                    style="background-color: #2563eb; color: white; border: none; padding: 4px 12px; border-radius: 8px; font-size: 11px; cursor: pointer; font-weight: 500;"
                    onmouseover="this.style.backgroundColor='#1d4ed8'"
                    onmouseout="this.style.backgroundColor='#2563eb'"
                  >
                    View Details
                  </button>
                </div>
              `);
              infoWin.open(map, marker);
            });

            markersRef.current.push(marker);
            bounds.extend(location);
          }
        });
      });

      // Fit map to show all markers after a short delay
      setTimeout(() => {
        if (markersRef.current.length > 0 && mapInstanceRef.current) {
          mapInstanceRef.current.fitBounds(bounds);
        }
      }, 500);
    };

    initMap();
  }, [mapLoaded, events]);

  // Add global function for button clicks
  useEffect(() => {
    (window as any).viewEventDetails = (eventId: string) => {
      router.push(`/events/${eventId}`);
    };

    return () => {
      delete (window as any).viewEventDetails;
    };
  }, [router]);

  // Cleanup markers when component unmounts
  useEffect(() => {
    return () => {
      if (markersRef.current) {
        markersRef.current.forEach(marker => {
          if (marker) marker.setMap(null);
        });
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, []);

  if (!apiKey) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center rounded-2xl bg-yellow-50 p-8">
        <svg className="mb-4 h-12 w-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-semibold text-yellow-800">Missing API Key</h3>
        <p className="mt-2 text-center text-sm text-yellow-700">
          Add your Google Maps API key to <code className="rounded bg-yellow-100 px-1">.env.local</code>
        </p>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center rounded-2xl bg-red-50 p-8">
        <svg className="mb-4 h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-red-800">Map Error</h3>
        <p className="mt-2 text-center text-sm text-red-600">{mapError}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        style={containerStyle}
        className="rounded-2xl bg-slate-100"
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-2 text-sm text-slate-500">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}