"use client";

import { format, parseISO, isToday } from "date-fns";
import { es } from "date-fns/locale";

interface DateSelectorProps {
  fechas: string[];
  fechaSeleccionada: string;
  onSelect: (fecha: string) => void;
}

export default function DateSelector({ fechas, fechaSeleccionada, onSelect }: DateSelectorProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max px-1">
        {fechas.map((fecha) => {
          const date = parseISO(fecha);
          const seleccionada = fecha === fechaSeleccionada;
          const hoy = isToday(date);
          return (
            <button
              key={fecha}
              onClick={() => onSelect(fecha)}
              className={`flex flex-col items-center px-4 py-3 rounded-xl border-2 transition-all min-w-[70px] ${
                seleccionada
                  ? "bg-padel-green border-padel-green text-white"
                  : "bg-white border-gray-200 text-gray-700 hover:border-padel-green-light hover:text-padel-green"
              }`}
            >
              <span className="text-xs font-medium uppercase tracking-wide">
                {hoy ? "Hoy" : format(date, "EEE", { locale: es })}
              </span>
              <span className="text-2xl font-bold leading-tight">{format(date, "d")}</span>
              <span className="text-xs">{format(date, "MMM", { locale: es })}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
