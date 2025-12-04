import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  latitude: number;
  longitude: number;
  qiblaAngle: number;
  buildingAngle: number;
  deviation: number;
  onClose: () => void;
}

const Certificate: React.FC<Props> = ({
  latitude,
  longitude,
  qiblaAngle,
  buildingAngle,
  deviation,
  onClose,
}) => {
  // Auto print
  useEffect(() => {
    setTimeout(() => {
      window.print();
      onClose();
    }, 500);
  }, []);

  return (
    <div className="fixed inset-0 bg-white text-black p-10 z-[9999] overflow-auto print:p-0">
      <div className="max-w-3xl mx-auto border border-gray-400 p-10 rounded-md print:border-none">
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Sertifikat Penentuan Arah Kiblat
        </h1>
        <p className="text-center mb-8 text-gray-700">
          Berdasarkan hasil perhitungan geografis dan astronomis
        </p>

        <Card className="shadow-none border print:border-none">
          <CardContent className="space-y-4 mt-6 text-lg">
            <div className="flex justify-between">
              <span>Lintang</span>
              <span>{latitude.toFixed(6)}°</span>
            </div>

            <div className="flex justify-between">
              <span>Bujur</span>
              <span>{longitude.toFixed(6)}°</span>
            </div>

            <div className="flex justify-between">
              <span>Arah Kiblat</span>
              <span>{qiblaAngle.toFixed(2)}°</span>
            </div>

            <div className="flex justify-between">
              <span>Arah Bangunan</span>
              <span>{buildingAngle.toFixed(2)}°</span>
            </div>

            <div className="flex justify-between">
              <span>Penyimpangan</span>
              <span>{deviation.toFixed(2)}°</span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-right">
          <p>__________________________</p>
          <p>Petugas Survey</p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
