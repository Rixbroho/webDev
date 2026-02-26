import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { MapPin, X, Navigation } from "lucide-react";
import L from "leaflet";

// Fix for default marker icon in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LocationPicker = ({
  latitude,
  longitude,
  onLocationChange,
  height = "300px",
}) => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");

  // Default to Kathmandu, Nepal if no coordinates provided
  const defaultLat = 27.7172;
  const defaultLng = 85.324;

  useEffect(() => {
    if (latitude && longitude) {
      setPosition([parseFloat(latitude), parseFloat(longitude)]);
    } else {
      setPosition([defaultLat, defaultLng]);
    }
  }, [latitude, longitude]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationChange(lat, lng);
        // Reverse geocode (simple version - just store coordinates)
        setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      },
    });

    return position ? <Marker position={position} /> : null;
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          setPosition([lat, lng]);
          onLocationChange(lat, lng);
          setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        },
        (err) => {
          console.error("Error getting location:", err.message);
        },
      );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-400 uppercase">
          Pick Location on Map
        </label>
        <button
          type="button"
          onClick={handleUseMyLocation}
          className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600"
        >
          <Navigation size={14} />
          Use My Location
        </button>
      </div>

      <div
        className="rounded-xl overflow-hidden border border-gray-200"
        style={{ height }}
      >
        <MapContainer
          center={position || [defaultLat, defaultLng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </div>

      {position && (
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
          <MapPin size={14} className="text-orange-500" />
          <span>
            Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
          </span>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
