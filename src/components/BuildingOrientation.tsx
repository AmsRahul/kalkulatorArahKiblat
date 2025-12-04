import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Polyline,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button"; // Asumsi import Button dari shadcn/ui
import { RefreshCw, CheckCircle2 } from "lucide-react"; // Ikon tambahan

// --- FUNGSI UTILITY ---

// 1. Fungsi hitung bearing (Azimuth) antara dua titik koordinat
function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  // Konversi koordinat ke radian
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Perhitungan komponen Y dan X
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  // Hitung sudut bearing dan konversi ke derajat
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;

  // Konversi ke rentang 0–360° (dari Utara Sejati)
  return (bearing + 360) % 360;
}

// 2. Fungsi konversi numerik Azimuth ke Arah Mata Angin
function getCardinalDirection(bearing: number): string {
  // Array arah mata angin dari Utara (0°) dengan interval 45°
  const directions = [
    "Utara (N)",
    "Timur Laut (NE)",
    "Timur (E)",
    "Tenggara (SE)",
    "Selatan (S)",
    "Barat Daya (SW)",
    "Barat (W)",
    "Barat Laut (NW)",
    "Utara (N)",
  ];

  // Menentukan indeks berdasarkan Azimuth (dibagi 45 derajat)
  const index = Math.round(bearing / 45);

  return directions[index];
}

// --- KOMPONEN UNTUK INTERAKSI PETA ---

interface Point {
  lat: number;
  lng: number;
}

function ClickToDraw({
  onPointsChange,
  points, // Menerima points dari state induk
  setPoints, // Menerima setter untuk mereset
}: {
  onPointsChange: (pts: Point[]) => void;
  points: Point[];
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
}) {
  useMapEvents({
    click(e) {
      // Hanya menyimpan maksimal 2 titik (Titik Start dan Titik End)
      if (points.length < 2) {
        const newPoints = [...points, e.latlng as Point];
        setPoints(newPoints);
        onPointsChange(newPoints);
      } else {
        // Jika sudah 2 titik, reset ke titik yang baru diklik
        const newPoints = [e.latlng as Point];
        setPoints(newPoints);
        onPointsChange(newPoints);
      }
    },
  });

  // Ikon kustom untuk membedakan Titik Awal (P1) dan Titik Akhir (P2)
  const iconP1 = L.divIcon({
    html: '<div style="background-color: blue; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>',
    iconSize: [19, 19],
  });
  const iconP2 = L.divIcon({
    html: '<div style="background-color: red; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>',
    iconSize: [19, 19],
  });

  return (
    <>
      {points.map((p, i) => (
        <Marker
          key={i}
          position={p}
          icon={i === 0 ? iconP1 : iconP2} // P1 = Biru, P2 = Merah
          title={i === 0 ? "Titik Awal (P1)" : "Titik Akhir (P2)"}
        />
      ))}

      {/* Gambar garis jika sudah ada 2 titik */}
      {points.length === 2 && <Polyline positions={points} color="blue" />}
    </>
  );
}

// --- KOMPONEN UTAMA ---

interface BuildingOrientationMapProps {
  initialAngle: number; // Sudut bangunan awal (opsional)
  onSelect: (angle: number) => void; // Fungsi untuk mengupdate state induk
}

export default function BuildingOrientationMap({
  onSelect,
  initialAngle,
}: BuildingOrientationMapProps) {
  const [bearing, setBearing] = useState<number | null>(null);
  const [points, setPoints] = useState<Point[]>([]);

  const handlePointsChange = (pts: Point[]) => {
    if (pts.length === 2) {
      const b = calculateBearing(
        pts[0].lat, // P1 (Start)
        pts[0].lng,
        pts[1].lat, // P2 (End)
        pts[1].lng
      );
      setBearing(b);
    } else {
      setBearing(null); // Reset jika hanya ada 1 titik
    }
  };

  const handleReset = () => {
    setPoints([]);
    setBearing(null);
  };

  const handleUseAngle = () => {
    if (bearing !== null) {
      onSelect(bearing);
    }
  };

  const INDONESIA_CENTER = [-2.5, 118] as [number, number];

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">
        Aplikasi Pengukur Orientasi Bangunan
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        Instruksi: Klik **Titik Awal** (P1) lalu klik **Titik Akhir** (P2) pada
        fasad bangunan di citra satelit. Arah dihitung dari P1 ke P2.
      </p>

      <MapContainer
        center={INDONESIA_CENTER}
        zoom={5}
        className="w-full h-96 rounded-lg border-2 border-gray-300"
        scrollWheelZoom={true}
        attributionControl={false}
      >
        {/* Tile Layer menggunakan Citra Satelit Esri */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles © Esri"
        />
        <div
          className="leaflet-bottom leaflet-right text-xs bg-white/70 px-2 py-1 rounded shadow"
          style={{ position: "absolute", zIndex: 9999 }}
        >
          Ⓒ Esri — World Imagery
        </div>

        {/* Mengoperasikan state points ke ClickToDraw */}
        <ClickToDraw
          onPointsChange={handlePointsChange}
          points={points}
          setPoints={setPoints}
        />
      </MapContainer>

      <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        {bearing !== null ? (
          <>
            <p className="text-lg font-semibold">
              <span role="img" aria-label="Arah">
                ➡️
              </span>
              Arah Hadap Bangunan:
            </p>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {bearing.toFixed(2)}°
              <span className="text-xl font-normal ml-2">
                ({getCardinalDirection(bearing)})
              </span>
            </p>
            <p className="text-sm mt-2 text-gray-600">
              Arah ini diukur searah jarum jam dari Utara Sejati (0°).
            </p>

            <div className="mt-4 flex gap-2">
              <Button onClick={handleUseAngle} className="flex-1">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Gunakan Arah Ini ({bearing.toFixed(2)}°)
              </Button>
              <Button onClick={handleReset} variant="outline" className="w-24">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-600">
            Klik dua titik pada peta untuk menentukan arah bangunan (P1 ke P2).
          </p>
        )}
      </div>
    </div>
  );
}
