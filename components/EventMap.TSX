"use client";

import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
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

// Create a global variable to track if script is already loaded
let scriptLoaded = false;

export default function AllEventsMap({ events }: AllEventsMapProps) {
  const router = useRouter();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoOpenId, setInfoOpenId] = useState<string | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  const [eventsWithCoords, setEventsWithCoords] = useState<(Event & { lat: number; lng: number })[]>([]);
  const [loadError, setLoadError] = useState<string>("");

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Debug logging
  useEffect(() => {
    console.log("🔑 API Key present:", !!apiKey);
    if (apiKey) {
      console.log("🔑 API Key starts with:", apiKey.substring(0, 10) + "...");
    }
  }, [apiKey]);

  const handleScriptLoad = useCallback(() => {
    console.log("✅ Google Maps script loaded successfully");
    scriptLoaded = true;
    setLoadError("");
    geocoder.current = new google.maps.Geocoder();
  }, []);

  const handleScriptError = useCallback(() => {
    console.error("❌ Google Maps script failed to load");
    setLoadError("Failed to load Google Maps. Please check your API key and internet connection.");
  }, []);

  // Geocode all events
  useEffect(() => {
    if (!geocoder.current || events.length === 0) return;

    const geocodeEvents = async () => {
      console.log("📍 Geocoding events...");
      const results = await Promise.all(
        events.map(async (event) => {
          const fullAddress = `${event.venue}, ${event.location}`;
          try {
            const result = await geocoder.current!.geocode({ address: fullAddress });
            if (result.results[0]) {
              const { lat, lng } = result.results[0].geometry.location;
              return { ...event, lat: lat(), lng: lng() };
            }
          } catch (error) {
            console.error(`Geocoding failed for ${event.title}:`, error);
          }
          return null;
        })
      );
      const validResults = results.filter((r): r is Event & { lat: number; lng: number } => r !== null);
      setEventsWithCoords(validResults);
      console.log(`✅ Geocoded ${validResults.length} events`);
    };
    geocodeEvents();
  }, [events]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    if (eventsWithCoords.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      eventsWithCoords.forEach(event => bounds.extend({ lat: event.lat, lng: event.lng }));
      mapInstance.fitBounds(bounds);
    }
  }, [eventsWithCoords]);

  // Show error if API key is missing
  if (!apiKey) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center rounded-2xl bg-yellow-50 p-8">
        <h3 className="text-lg font-semibold text-yellow-800">Missing API Key</h3>
        <p className="mt-2 text-center text-sm text-yellow-700">
          Add <code className="rounded bg-yellow-100 px-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to .env.local
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center rounded-2xl bg-red-50 p-8">
        <h3 className="text-lg font-semibold text-red-800">Map Error</h3>
        <p className="mt-2 text-center text-sm text-red-600">{loadError}</p>
        <p className="mt-4 text-xs text-slate-500">Check that Maps JavaScript API and Geocoding API are enabled</p>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={apiKey}
      onLoad={handleScriptLoad}
      onError={handleScriptError}
      loadingElement={<div className="h-[500px] flex items-center justify-center">Loading map...</div>}
    >
      <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={10} onLoad={onLoad}>
        {eventsWithCoords.map((event) => (
          <Marker
            key={event.id}
            position={{ lat: event.lat, lng: event.lng }}
            onClick={() => setInfoOpenId(event.id)}
          />
        ))}
        {infoOpenId && eventsWithCoords.find(e => e.id === infoOpenId)?.lat && (
          <InfoWindow
            position={{ 
              lat: eventsWithCoords.find(e => e.id === infoOpenId)!.lat, 
              lng: eventsWithCoords.find(e => e.id === infoOpenId)!.lng 
            }}
            onCloseClick={() => setInfoOpenId(null)}
          >
            <div className="max-w-xs p-2">
              <h3 className="font-semibold text-slate-900">
                {eventsWithCoords.find(e => e.id === infoOpenId)!.title}
              </h3>
              <p className="text-sm text-slate-600">
                {eventsWithCoords.find(e => e.id === infoOpenId)!.venue}
              </p>
              <p className="text-sm text-slate-500">
                {eventsWithCoords.find(e => e.id === infoOpenId)!.date}
              </p>
              <button
                onClick={() => router.push(`/events/${infoOpenId}`)}
                className="mt-2 rounded-lg bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}