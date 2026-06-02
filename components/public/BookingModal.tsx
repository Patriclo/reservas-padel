"use client";

import { useState } from "react";
import { DuracionMin, NuevaReserva } from "@/types";
import { calcularPrecio, formatPrecio } from "@/lib/pricing";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface BookingModalProps {
  fecha: string;
  hora: string;
  duracion: DuracionMin;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingModal({ fecha, hora, duracion, onClose, onSuccess }: BookingModalProps) {
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", telefono: "" });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const precio = calcularPrecio(fecha, hora, duracion);
  const fechaFormateada = format(parseISO(fecha), "EEEE d 'de' MMMM", { locale: es });
  const duracionLabel = duracion === 60 ? "1 hora" : duracion === 90 ? "1h 30min" : "2 horas";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setEnviando(true);

    try {
      const body: NuevaReserva = {
        ...form,
        fecha,
        hora_inicio: hora,
        duracion_min: duracion,
      };

      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        let mensaje = "Error al realizar la reserva";
        try {
          const data = JSON.parse(text);
          if (data.error) mensaje = data.error;
        } catch {}
        throw new Error(mensaje);
      }

      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-padel-green px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Solicitar turno</h2>
            <p className="text-padel-accent text-sm capitalize">{fechaFormateada} · {hora} hs · {duracionLabel}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {/* Precio */}
        <div className="px-6 py-3 bg-padel-green/10 border-b border-padel-green/20">
          <p className="text-padel-green font-bold text-xl">{formatPrecio(precio)}</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-padel-green"
                placeholder="Juan"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Apellido</label>
              <input
                type="text"
                required
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-padel-green"
                placeholder="García"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-padel-green"
              placeholder="juan@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
            <input
              type="tel"
              required
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-padel-green"
              placeholder="+54 11 1234-5678"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-padel-green hover:bg-padel-green-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {enviando ? "Enviando solicitud..." : "Solicitar turno"}
          </button>
          <p className="text-xs text-gray-400 text-center">
            Tu solicitud quedará pendiente hasta ser confirmada por el administrador.
          </p>
        </form>
      </div>
    </div>
  );
}
