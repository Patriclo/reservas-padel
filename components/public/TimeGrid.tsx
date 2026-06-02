"use client";

import { TurnoSlot } from "@/types";

interface TimeGridProps {
  slots: TurnoSlot[];
  horaSeleccionada: string | null;
  onSelect: (hora: string) => void;
  cargando: boolean;
}

export default function TimeGrid({ slots, horaSeleccionada, onSelect, cargando }: TimeGridProps) {
  if (cargando) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No hay turnos disponibles para este día.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {slots.map((slot) => {
        const seleccionado = slot.hora === horaSeleccionada;
        const bloqueado = !slot.disponible;

        return (
          <button
            key={slot.hora}
            disabled={bloqueado}
            onClick={() => onSelect(slot.hora)}
            title={
              bloqueado
                ? slot.estado === "pendiente"
                  ? "Solicitud pendiente de confirmación"
                  : "Turno confirmado"
                : `Turno disponible`
            }
            className={`h-12 rounded-lg text-sm font-medium transition-all ${
              bloqueado
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : seleccionado
                ? "bg-padel-green text-white border-2 border-padel-green shadow-md"
                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-padel-green hover:text-padel-green"
            }`}
          >
            {slot.hora}
          </button>
        );
      })}
    </div>
  );
}
