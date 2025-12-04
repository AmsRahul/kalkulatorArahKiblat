import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
// Import the Leaflet CSS for styling
import "leaflet/dist/leaflet.css";

// --- Custom Marker Icon Definition ---
// This is necessary to fix missing marker images in React/Webpack environments
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// --- Component Props Interface ---
interface MapPickerProps {
  lat: number;
  lng: number;
  onSelect: (lat: number, lng: number) => void;
}

// --- Location Selector Hook Component ---
// This component handles map events (like click) and calls the onSelect handler.
function LocationSelector({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      // Calls the handler with the latitude and longitude of the clicked point
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// --- Main Map Picker Component ---
export default function MapPicker({ lat, lng, onSelect }: MapPickerProps) {
  // Define the center coordinates and explicitly cast it to LatLngExpression
  // to resolve the TypeScript error on the 'center' prop.
  const INDONESIA_CENTER: LatLngExpression = [-2.5, 118.0];

  // Use the current selected coordinates for the Marker position
  const selectedPosition: LatLngExpression = [lat, lng];

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border">
      <MapContainer
        // The error is fixed here by ensuring INDONESIA_CENTER is of type LatLngExpression
        center={INDONESIA_CENTER}
        zoom={5} // Set an appropriate initial zoom level for Indonesia
        className="w-full h-full"
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marker is placed on the currently selected location (lat, lng) */}
        <Marker position={selectedPosition} icon={markerIcon} />

        {/* Component to handle map clicks for selecting a new location */}
        <LocationSelector onSelect={onSelect} />
      </MapContainer>
    </div>
  );
}
