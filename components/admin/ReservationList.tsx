"use client";

import { useState } from "react";
import { Reserva, EstadoReserva } from "@/types";
import ReservationCard from "./ReservationCard";

interface ReservationListProps {
  reservasIniciales: Reserva[];
}

const TABS: { key: EstadoReserva | "todas"; label: string }[] = [
  { key: "pendiente",  label: "Pendientes"  },
  { key: "confirmado", label: "Confirmadas" },
  { key: "cancelado",  label: "Canceladas"  },
  { key: "todas",      label: "Todas"       },
];

export default function ReservationList({ reservasIniciales }: ReservationListProps) {
  const [reservas, setReservas] = useState<Reserva[]>(reservasIniciales);
  const [tabActiva, setTabActiva] = useState<EstadoReserva | "todas">("pendiente");

  function handleActualizar(id: string, nuevoEstado: "confirmado" | "cancelado") {
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r))
    );
  }

  const filtradas =
    tabActiva === "todas"
      ? reservas
      : reservas.filter((r) => r.estado === tabActiva);

  const countPendientes = reservas.filter((r) => r.estado === "pendiente").length;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTabActiva(tab.key)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              tabActiva === tab.key
                ? "bg-white text-padel-green shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
            {tab.key === "pendiente" && countPendientes > 0 && (
              <span className="ml-1.5 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {countPendientes}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtradas.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">📭</p>
          <p>No hay reservas en esta categoría</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtradas.map((reserva) => (
            <ReservationCard
              key={reserva.id}
              reserva={reserva}
              onActualizar={handleActualizar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
