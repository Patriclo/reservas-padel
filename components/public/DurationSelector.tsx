"use client";

import { DuracionMin } from "@/types";

interface DurationSelectorProps {
  duracion: DuracionMin;
  onSelect: (d: DuracionMin) => void;
}

const opciones: { valor: DuracionMin; etiqueta: string }[] = [
  { valor: 60, etiqueta: "1 hora" },
  { valor: 90, etiqueta: "1h 30min" },
  { valor: 120, etiqueta: "2 horas" },
];

export default function DurationSelector({ duracion, onSelect }: DurationSelectorProps) {
  return (
    <div className="flex gap-2">
      {opciones.map((op) => (
        <button
          key={op.valor}
          onClick={() => onSelect(op.valor)}
          className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
            duracion === op.valor
              ? "bg-padel-green border-padel-green text-white"
              : "bg-white border-gray-200 text-gray-700 hover:border-padel-green-light"
          }`}
        >
          {op.etiqueta}
        </button>
      ))}
    </div>
  );
}
