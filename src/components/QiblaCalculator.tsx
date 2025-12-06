import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Komponen Kustom
import CompassRose from "./CompassRose";
import DataRow from "./DataRow";
import MapPicker from "./MapPicker";
import BuildingOrientationMap from "./BuildingOrientation";
import Certificate from "./Certificate";

// Ikon
import { MapPin, Compass, ArrowRight, CornerRightUp, Hand } from "lucide-react";

// Kaaba coordinates
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

// --- UTILITY FUNCTIONS ---

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

// Konversi DMS ke Desimal
function dmsToDecimal(
  degrees: number,
  minutes: number,
  seconds: number,
  isNegative: boolean
): number {
  const decimal = degrees + minutes / 60 + seconds / 3600;
  return isNegative ? -decimal : decimal;
}

// Konversi Desimal ke DMS
function decimalToDMS(decimal: number): {
  degrees: number;
  minutes: number;
  seconds: number;
} {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  // Pembulatan yang lebih akurat untuk detik
  const seconds = Math.round((minutesFloat - minutes) * 60 * 100) / 100;
  return { degrees, minutes, seconds };
}

// Menghitung Arah Kiblat (Bearing) menggunakan rumus Great-Circle Navigation
function calculateQiblaDirection(lat: number, lng: number): number {
  const φ1 = toRadians(lat);
  const φ2 = toRadians(KAABA_LAT);
  const Δλ = toRadians(KAABA_LNG - lng);

  const x = Math.sin(Δλ);
  const y = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);

  let qibla = toDegrees(Math.atan2(x, y));
  if (qibla < 0) qibla += 360;

  return qibla;
}

// --- KOMPONEN INPUT DMS (Modal Simulasi) ---

interface DMSInputModalProps {
  currentLat: number;
  currentLng: number;
  onClose: () => void;
  onSave: (lat: number, lng: number) => void;
}

const DMSInputModal: React.FC<DMSInputModalProps> = ({
  currentLat,
  currentLng,
  onClose,
  onSave,
}) => {
  const initialLatDMS = decimalToDMS(currentLat);
  const initialLngDMS = decimalToDMS(currentLng);

  // State input DMS untuk Latitude
  const [latDeg, setLatDeg] = useState(initialLatDMS.degrees.toString());
  const [latMin, setLatMin] = useState(initialLatDMS.minutes.toString());
  const [latSec, setLatSec] = useState(initialLatDMS.seconds.toFixed(2));
  const [isLatNegative, setIsLatNegative] = useState(currentLat < 0);

  // State input DMS untuk Longitude
  const [lngDeg, setLngDeg] = useState(initialLngDMS.degrees.toString());
  const [lngMin, setLngMin] = useState(initialLngDMS.minutes.toString());
  const [lngSec, setLngSec] = useState(initialLngDMS.seconds.toFixed(2));
  const [isLngNegative, setIsLngNegative] = useState(currentLng < 0);

  const handleSave = () => {
    // Konversi string input ke number
    const degLat = parseFloat(latDeg || "0");
    const minLat = parseFloat(latMin || "0");
    const secLat = parseFloat(latSec || "0");
    const degLng = parseFloat(lngDeg || "0");
    const minLng = parseFloat(lngMin || "0");
    const secLng = parseFloat(lngSec || "0");

    const newLat = dmsToDecimal(degLat, minLat, secLat, isLatNegative);
    const newLng = dmsToDecimal(degLng, minLng, secLng, isLngNegative);

    onSave(newLat, newLng);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl">
            Input Koordinat Manual (DMS)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Lintang (Latitude) */}
          <div className="space-y-2">
            <Label>Lintang (Latitude)</Label>
            <div className="grid grid-cols-4 gap-2 items-end">
              <Input
                placeholder="Deg (°)"
                type="number"
                value={latDeg}
                onChange={(e) => setLatDeg(e.target.value)}
              />
              <Input
                placeholder="Min (')"
                type="number"
                value={latMin}
                onChange={(e) => setLatMin(e.target.value)}
              />
              <Input
                placeholder="Sec ('')"
                type="number"
                step="0.01"
                value={latSec}
                onChange={(e) => setLatSec(e.target.value)}
              />
              <Button
                variant={isLatNegative ? "destructive" : "secondary"}
                onClick={() => setIsLatNegative(!isLatNegative)}
                className="w-full"
              >
                {isLatNegative ? "LS" : "LU"}
              </Button>
            </div>
          </div>

          {/* Input Bujur (Longitude) */}
          <div className="space-y-2">
            <Label>Bujur (Longitude)</Label>
            <div className="grid grid-cols-4 gap-2 items-end">
              <Input
                placeholder="Deg (°)"
                type="number"
                value={lngDeg}
                onChange={(e) => setLngDeg(e.target.value)}
              />
              <Input
                placeholder="Min (')"
                type="number"
                value={lngMin}
                onChange={(e) => setLngMin(e.target.value)}
              />
              <Input
                placeholder="Sec ('')"
                type="number"
                step="0.01"
                value={lngSec}
                onChange={(e) => setLngSec(e.target.value)}
              />
              <Button
                variant={isLngNegative ? "destructive" : "secondary"}
                onClick={() => setIsLngNegative(!isLngNegative)}
                className="w-full"
              >
                {isLngNegative ? "BB" : "BT"}
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button onClick={handleSave}>Simpan & Hitung</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// --- KOMPONEN UTAMA ---

const QiblaCalculator: React.FC = () => {
  // State Input Utama (Desimal, disimpan sebagai string)
  const [latitude, setLatitude] = useState<string>("-7.8697");
  const [longitude, setLongitude] = useState<string>("110.3989");
  const [buildingAngle, setBuildingAngle] = useState<string>("283.9");
  const [isCompassSupported, setIsCompassSupported] = useState(true);
  const [isPrintOpen, setIsPrintOpen] = useState(false);



  // State Kontrol Modal
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [isBuildingOrientationOpen, setIsBuildingOrientationOpen] =
    useState(false);
  const [isDMSInputOpen, setIsDMSInputOpen] = useState(false);

  // Parsing ke Number untuk Perhitungan
  const lat = parseFloat(latitude) || 0;
  const lng = parseFloat(longitude) || 0;
  const buildAngle = parseFloat(buildingAngle) || 0;

  // Perhitungan
  const qiblaAngle = calculateQiblaDirection(lat, lng);
  const deviation = qiblaAngle - buildAngle;

  // Data Konversi
  const latDMS = decimalToDMS(lat);
  const lngDMS = decimalToDMS(lng);
  const qiblaDMS = decimalToDMS(qiblaAngle);
  const buildingDMS = decimalToDMS(buildAngle);
  const deviationDMS = decimalToDMS(Math.abs(deviation));

  // Perhitungan Penyimpangan Meter
  const penyimpanganPerMeter = Math.abs(Math.tan(toRadians(deviation))) * 100;

  // --- HANDLERS ---

  // Handler untuk MapPicker
  const handleMapSelect = (newLat: number, newLng: number) => {
    setLatitude(newLat.toFixed(6));
    setLongitude(newLng.toFixed(6));
    setIsMapPickerOpen(false);
  };

  // Handler untuk DMSInputModal
  const handleDMSSelect = (newLat: number, newLng: number) => {
    setLatitude(newLat.toFixed(6));
    setLongitude(newLng.toFixed(6));
    setIsDMSInputOpen(false);
  };

  // Handler untuk BuildingOrientationMap (PENTING: Konversi number ke string)
  const handleOrientationSelect = (newAngle: number) => {
    setBuildingAngle(newAngle.toFixed(2)); // Konversi number ke string dengan 2 desimal
    setIsBuildingOrientationOpen(false);
  };

  

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Kalkulator Arah Kiblat
          </h1>
          <p className="text-muted-foreground">
            Hitung arah kiblat berdasarkan koordinat lokasi
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input & Data */}
          <div className="space-y-6">
            {/* Input Card */}
            <Card className="border-2 border-border shadow-lg">
              <CardHeader className="p-4 pb-4">
                {" "}
                {/* Padding yang lebih responsif */}
                <CardTitle className="flex items-center gap-2 text-primary text-lg md:text-xl">
                  <MapPin className="w-5 h-5" />
                  Koordinat & Arah Bangunan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-4 pt-0">
                {" "}
                {/* Padding dan spacing yang lebih baik */}
                {/* Input Koordinat Desimal - Gunakan grid-cols-1 pada layar kecil */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  {/* Input Lintang (Latitude) */}
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Lintang (Latitude)</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.0001"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="-7.8697"
                      className="font-mono"
                    />
                  </div>
                  {/* Input Bujur (Longitude) */}
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Bujur (Longitude)</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.0001"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="110.3989"
                      className="font-mono"
                    />
                  </div>
                </div>
                {/* Tombol Aksi Koordinat - Tombol memenuhi lebar penuh di seluler, dan dipisahkan menjadi dua baris jika perlu */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {" "}
                  {/* Tumpuk di seluler, berdampingan di desktop */}
                  <Button
                    onClick={() => setIsMapPickerOpen(true)}
                    className="w-full sm:flex-1" // Lebar penuh di seluler
                    variant="outline"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Pilih dari Peta
                  </Button>
                  <Button
                    onClick={() => setIsDMSInputOpen(true)}
                    className="w-full sm:flex-1" // Lebar penuh di seluler
                    variant="outline"
                  >
                    <Hand className="w-4 h-4 mr-2" />
                    Manual (DMS)
                  </Button>
                </div>
                <Separator />
                {/* Input Arah Bangunan */}
                <div className="space-y-2">
                  <Label htmlFor="building">Arah Bangunan (° dari Utara)</Label>
                  <Input
                    id="building"
                    type="number"
                    step="0.1"
                    value={buildingAngle}
                    onChange={(e) => setBuildingAngle(e.target.value)}
                    placeholder="283.9"
                    className="font-mono"
                  />
                </div>
                {/* Tombol untuk BuildingOrientationMap - Sudah w-full, bagus. */}
                <Button
                  onClick={() => setIsBuildingOrientationOpen(true)}
                  className="w-full"
                  variant="outline"
                >
                  <CornerRightUp className="w-4 h-4 mr-2" />
                  Tentukan Arah Bangunan
                </Button>
              </CardContent>
            </Card>

            {/* Geographic Data Card */}
            <Card className="border-2 border-border shadow-lg">
              {/* Header dengan padding yang disesuaikan */}
              <CardHeader className="p-4 md:p-6 pb-2">
                <CardTitle className="flex items-center gap-2 text-primary text-lg md:text-xl font-bold">
                  <Compass className="w-5 h-5" />
                  Data Geografis
                </CardTitle>
              </CardHeader>

              {/* Konten Utama */}
              <CardContent className="space-y-4 p-4 md:p-6 pt-2">
                {/* Display Data Lintang & Bujur */}
                <div className="space-y-3">
                  {/* Lintang */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Lintang
                    </span>
                    {/* Mengganti DataRow dengan format string DMS langsung untuk tampilan yang lebih kompak */}
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      {`${latDMS.degrees}° ${
                        latDMS.minutes
                      }' ${latDMS.seconds.toFixed(2)}"`}{" "}
                      {lat < 0 ? "LS" : "LU"}
                    </span>
                  </div>

                  {/* Bujur */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Bujur
                    </span>
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      {`${lngDMS.degrees}° ${
                        lngDMS.minutes
                      }' ${lngDMS.seconds.toFixed(2)}"`}{" "}
                      {lng < 0 ? "BB" : "BT"}
                    </span>
                  </div>
                </div>
                <Separator className="mt-4" />{" "}
                {/* Pemisah opsional sebelum peta */}
                {/* Placeholder atau Komponen Peta Mini (sesuai yang ada di gambar) */}
                <div className="mt-4">
                  {/* Ganti dengan komponen peta Anda (misalnya MiniMap) atau placeholder statis */}
                  {/* Untuk hasil yang mirip gambar, gunakan rasio aspek yang tinggi */}

                  {/* Jika Anda menggunakan Image Placeholder: */}
                  {/* <div className="rounded-lg overflow-hidden h-40 w-full bg-teal-100 flex items-center justify-center">
        <MapPin className="w-8 h-8 text-teal-600" />
        <span className="ml-2 text-teal-800">Mini Map View</span>
      </div> */}

                  {/* Jika Anda memiliki komponen peta */}
                  {/* <MiniMap
                    latitude={latitude}
                    longitude={longitude}
                    zoom={15}
                    className="rounded-lg h-40 w-full"
                  /> */}
                </div>
              </CardContent>
            </Card>

            {/* Qibla Direction Card */}
            <Card className="border-2 border-primary/30 shadow-lg bg-accent/30">
              {/* Header yang disesuaikan */}
              <CardHeader className="p-4 md:p-6 pb-2">
                <CardTitle className="flex items-center gap-2 text-primary text-lg md:text-xl font-bold">
                  <ArrowRight className="w-5 h-5 text-primary" />
                  Hasil Perhitungan
                </CardTitle>
              </CardHeader>

              {/* Konten Utama */}
              <CardContent className="space-y-4 p-4 md:p-6 pt-2">
                {/* Arah Kiblat (Dibuat lebih menonjol - Mengganti DataRow dengan struktur flex) */}
                <div className="border-2 border-primary/50 bg-primary/10 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    {/* Label (Rata Kiri) */}
                    <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      Arah Kiblat
                    </span>
                    {/* Nilai (Rata Kanan) */}
                    <span className="text-lg font-extrabold text-primary dark:text-white">
                      {`${qiblaDMS.degrees}° ${
                        qiblaDMS.minutes
                      }' ${qiblaDMS.seconds.toFixed(1)}"`}
                    </span>
                  </div>
                </div>

                {/* Baris Data Lainnya - Menggunakan struktur flex yang rapi dengan pemisah garis tipis */}
                <div className="space-y-4 pt-4 border-t border-border">
                  {/* Arah Bangunan */}
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600 dark:text-gray-400">
                      Arah Bangunan
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {`${buildingDMS.degrees}° ${
                        buildingDMS.minutes
                      }' ${buildingDMS.seconds.toFixed(1)}"`}
                    </span>
                  </div>
                  <Separator /> {/* Pemisah antar baris data */}
                  {/* Penyimpangan Sudut */}
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600 dark:text-gray-400">
                      Penyimpangan Sudut
                    </span>
                    <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {`${deviationDMS.degrees}° ${
                        deviationDMS.minutes
                      }' ${deviationDMS.seconds.toFixed(1)}"`}
                    </span>
                  </div>
                </div>

                {/* Detail Penyimpangan per Meter - Menggunakan struktur flex yang rapi */}
                <div className="pt-4 border-t border-border mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-muted-foreground">
                      Penyimpangan per 1 meter
                    </span>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                      = {penyimpanganPerMeter.toFixed(2)} cm
                    </span>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <Button
                  className="w-full mt-6 h-12 text-lg font-bold bg-green-500 hover:bg-green-600 shadow-md transition-colors"
                  onClick={() => setIsPrintOpen(true)}
                >
                  {/* <Printer className="w-5 h-5 mr-2" /> */}
                  Cetak Sertifikat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Visualizations */}
          <div className="space-y-6">
            {/* Compass Card */}
            <Card className="border-2 border-border shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Compass className="w-5 h-5" />
                  Kompas Kiblat
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <CompassRose
                  qiblaAngle={qiblaAngle}
                  buildingAngle={buildAngle}
                  size={200}
                />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {qiblaAngle.toFixed(2)}°
                  </p>
                  <p className="text-sm text-muted-foreground">
                    dari arah Utara
                  </p>
                </div>
                {/* Legend */}
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-qibla-teal rounded-full"></div>
                    <span className="text-muted-foreground">Arah Kiblat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-0.5 bg-destructive rounded-full"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(90deg, hsl(var(--destructive)) 0px, hsl(var(--destructive)) 4px, transparent 4px, transparent 6px)",
                      }}
                    ></div>
                    <span className="text-muted-foreground">Arah Bangunan</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- MODAL DIALOGS --- */}

        {/* Modal/Dialog untuk MapPicker */}
        {isMapPickerOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Pilih Lokasi Anda</CardTitle>
              </CardHeader>
              <CardContent>
                <MapPicker
                  lat={lat || undefined}
                  lng={lng || undefined}
                  onSelect={handleMapSelect}
                />
                <Button
                  onClick={() => setIsMapPickerOpen(false)}
                  variant="secondary"
                  className="mt-4 w-full"
                >
                  Tutup
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal untuk Input DMS */}
        {isDMSInputOpen && (
          <DMSInputModal
            currentLat={lat}
            currentLng={lng}
            onClose={() => setIsDMSInputOpen(false)}
            onSave={handleDMSSelect}
          />
        )}

        {/* Modal/Dialog untuk BuildingOrientationMap */}
        {isBuildingOrientationOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Tentukan Arah Bangunan</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Asumsi BuildingOrientationMap memiliki prop initialAngle dan onSelect */}
                <BuildingOrientationMap
                  initialAngle={buildAngle}
                  onSelect={handleOrientationSelect}
                />
                <Button
                  onClick={() => setIsBuildingOrientationOpen(false)}
                  variant="secondary"
                  className="mt-4 w-full"
                >
                  Tutup
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {isPrintOpen && (
          <Certificate
            latitude={lat}
            longitude={lng}
            qiblaAngle={qiblaAngle}
            buildingAngle={buildAngle}
            deviation={deviation}
            onClose={() => setIsPrintOpen(false)}
          />
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>Koordinat Ka'bah: 21.4225° LU, 39.8262° BT</p>
        </footer>
      </div>
    </div>
  );
};

export default QiblaCalculator;
