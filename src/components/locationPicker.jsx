 import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationMarker({ position, setPosition, onLocationSelect }) {
  useMapEvents({
    click(e) {
      const location = {
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      };

      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationSelect(location);
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>Delivery location</Popup>
    </Marker>
  ) : null;
}

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, {
        duration: 1.5,
      });
    }
  }, [position, map]);

  return null;
}

function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search Nominatim
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
            search
          )}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        setSuggestions(data);
      } catch (error) {
        console.error("Location search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSuggestionClick = (location) => {
    const latitude = parseFloat(location.lat);
    const longitude = parseFloat(location.lon);

    const newPosition = [latitude, longitude];

    setPosition(newPosition);

    onLocationSelect({
      latitude,
      longitude,
      address: location.display_name,
    });

    setSearch(location.display_name);
    setSuggestions([]);
  };

  return (
    <div className="w-full">

      {/* Search Bar */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search delivery location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute z-[1000] mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            {suggestions.map((location) => (
              <button
                key={location.place_id}
                type="button"
                onClick={() => handleSuggestionClick(location)}
                className="block w-full border-b border-gray-100 px-4 py-3 text-left text-sm hover:bg-gray-100"
              >
                {location.display_name}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="absolute right-3 top-3 text-sm text-gray-500">
            Searching...
          </div>
        )}
      </div>

      {/* Map */}
      <MapContainer
        center={[27.7172, 85.324]}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "12px",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController position={position} />

        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>

      {/* Selected coordinates */}
      {position && (
        <div className="mt-2 text-sm text-gray-600">
          <p>Latitude: {position[0]}</p>
          <p>Longitude: {position[1]}</p>
        </div>
      )}
    </div>
  );
}

export default LocationPicker;