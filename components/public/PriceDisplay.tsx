"use client";

import { DuracionMin } from "@/types";
import { calcularPrecio, formatPrecio } from "@/lib/pricing";

interface PriceDisplayProps {
  fecha: string;
  hora: string | null;
  duracion: DuracionMin;
}

export default function PriceDisplay({ fecha, hora, duracion }: PriceDisplayProps) {
  if (!hora) return null;

  const precio = calcularPrecio(fecha, hora, duracion);

  return (
    <div className="bg-padel-green/10 border border-padel-green/30 rounded-xl p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">Precio del turno</p>
        <p className="text-xs text-gray-500">
          {hora} hs · {duracion === 60 ? "1h" : duracion === 90 ? "1h 30min" : "2h"}
        </p>
      </div>
      <p className="text-2xl font-bold text-padel-green">{formatPrecio(precio)}</p>
    </div>
  );
}
