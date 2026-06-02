"use client";

import { useState } from "react";
import { Reserva } from "@/types";
import StatusBadge from "./StatusBadge";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { formatPrecio } from "@/lib/pricing";

interface ReservationCardProps {
  reserva: Reserva;
  onActualizar: (id: string, estado: "confirmado" | "cancelado") => void;
}

export default function ReservationCard({ reserva, onActualizar }: ReservationCardProps) {
  const [accionando, setAccionando] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const fechaFormateada = format(parseISO(reserva.fecha), "EEEE d 'de' MMMM yyyy", { locale: es });
  const duracionLabel = reserva.duracion_min === 60 ? "1h" : reserva.duracion_min === 90 ? "1h 30min" : "2h";

  async function accionar(estado: "confirmado" | "cancelado") {
    setAccionando(estado);
    try {
      const res = await fetch(`/api/reservas/${reserva.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      if (!res.ok) throw new Error();
      onActualizar(reserva.id, estado);
      setToast(estado === "confirmado" ? "✅ Reserva confirmada" : "❌ Reserva cancelada");
      setTimeout(() => setToast(""), 3000);
    } catch {
      setToast("Error al actualizar la reserva");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setAccionando(null);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      {toast && (
        <div className="mb-3 text-sm px-3 py-2 rounded-lg bg-gray-50 text-gray-700 font-medium">
          {toast}
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">
            {reserva.nombre} {reserva.apellido}
          </h3>
          <p className="text-sm text-gray-500 capitalize">{fechaFormateada}</p>
        </div>
        <StatusBadge estado={reserva.estado} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <InfoItem label="Hora" value={`${reserva.hora_inicio.substring(0, 5)} hs`} />
        <InfoItem label="Duración" value={duracionLabel} />
        <InfoItem label="Precio" value={formatPrecio(reserva.precio)} highlight />
        <InfoItem label="Teléfono" value={reserva.telefono} />
      </div>

      <p className="text-sm text-gray-500 mb-4">
        📧 <a href={`mailto:${reserva.email}`} className="hover:underline text-padel-green">{reserva.email}</a>
      </p>

      {reserva.estado === "pendiente" && (
        <div className="flex gap-2">
          <button
            onClick={() => accionar("confirmado")}
            disabled={accionando !== null}
            className="flex-1 bg-padel-green hover:bg-padel-green-dark text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {accionando === "confirmado" ? "Confirmando..." : "✅ Confirmar"}
          </button>
          <button
            onClick={() => accionar("cancelado")}
            disabled={accionando !== null}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {accionando === "cancelado" ? "Cancelando..." : "❌ Cancelar"}
          </button>
        </div>
      )}

      {reserva.estado === "confirmado" && (
        <button
          onClick={() => accionar("cancelado")}
          disabled={accionando !== null}
          className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {accionando === "cancelado" ? "Cancelando..." : "Cancelar reserva"}
        </button>
      )}
    </div>
  );
}

function InfoItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`font-semibold text-sm ${highlight ? "text-padel-green" : "text-gray-800"}`}>{value}</p>
    </div>
  );
}
