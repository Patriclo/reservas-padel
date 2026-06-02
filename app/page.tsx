"use client";

import { useState, useEffect, useCallback } from "react";
import DateSelector from "@/components/public/DateSelector";
import TimeGrid from "@/components/public/TimeGrid";
import DurationSelector from "@/components/public/DurationSelector";
import PriceDisplay from "@/components/public/PriceDisplay";
import BookingModal from "@/components/public/BookingModal";
import { generarFechasDisponibles, generarTurnos } from "@/lib/timeSlots";
import { DuracionMin, Reserva, TurnoSlot } from "@/types";

export default function HomePage() {
  const fechas = generarFechasDisponibles();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(fechas[0]);
  const [duracion, setDuracion] = useState<DuracionMin>(90);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [slots, setSlots] = useState<TurnoSlot[]>([]);
  const [cargando, setCargando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [reservaExitosa, setReservaExitosa] = useState(false);

  const cargarTurnos = useCallback(async () => {
    setCargando(true);
    setHoraSeleccionada(null);
    try {
      const res = await fetch(`/api/reservas?fecha=${fechaSeleccionada}`);
      const data = await res.json();
      const reservas: Reserva[] = Array.isArray(data) ? data : [];
      setSlots(generarTurnos(reservas, duracion));
    } catch {
      setSlots(generarTurnos([], duracion));
    } finally {
      setCargando(false);
    }
  }, [fechaSeleccionada, duracion]);

  useEffect(() => {
    cargarTurnos();
  }, [cargarTurnos]);

  function handleHoraSelect(hora: string) {
    setHoraSeleccionada(hora);
    setReservaExitosa(false);
  }

  function handleReservaExitosa() {
    setModalAbierto(false);
    setReservaExitosa(true);
    setHoraSeleccionada(null);
    cargarTurnos();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-padel-green text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎾</span>
            <div>
              <h1 className="text-2xl font-bold">Reservas Pádel</h1>
              <p className="text-padel-accent text-sm">Reservá tu turno online</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Mensaje de éxito */}
        {reservaExitosa && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-800">¡Solicitud enviada!</p>
              <p className="text-green-700 text-sm">Tu turno quedó en estado pendiente. Te confirmaremos por email a la brevedad.</p>
            </div>
          </div>
        )}

        {/* Selección de fecha */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Elegí un día
          </h2>
          <DateSelector
            fechas={fechas}
            fechaSeleccionada={fechaSeleccionada}
            onSelect={(f) => { setFechaSeleccionada(f); setReservaExitosa(false); }}
          />
        </section>

        {/* Duración */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Duración del turno
          </h2>
          <DurationSelector duracion={duracion} onSelect={setDuracion} />
        </section>

        {/* Grilla de turnos */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Horarios disponibles
            </h2>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-padel-green inline-block" /> Disponible
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-gray-200 inline-block" /> Ocupado
              </span>
            </div>
          </div>
          <TimeGrid
            slots={slots}
            horaSeleccionada={horaSeleccionada}
            onSelect={handleHoraSelect}
            cargando={cargando}
          />
        </section>

        {/* Precio y acción */}
        {horaSeleccionada && !cargando && (
          <section className="space-y-3">
            <PriceDisplay fecha={fechaSeleccionada} hora={horaSeleccionada} duracion={duracion} />
            <button
              onClick={() => setModalAbierto(true)}
              className="w-full bg-padel-green hover:bg-padel-green-dark text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-md"
            >
              Reservar este turno
            </button>
          </section>
        )}

        {/* Info */}
        <section className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-2">💰 Precios</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• <strong>Lun–Vie antes de 17:00:</strong> $55.000 / 1h30</li>
            <li>• <strong>Lun–Vie desde 17:00:</strong> $70.000 / 1h30</li>
            <li>• <strong>Sáb y Dom:</strong> $70.000 / 1h30</li>
          </ul>
          <p className="text-xs text-gray-400 mt-2">1h y 2h calculados proporcionalmente.</p>
        </section>
      </div>

      {/* Modal */}
      {modalAbierto && horaSeleccionada && (
        <BookingModal
          fecha={fechaSeleccionada}
          hora={horaSeleccionada}
          duracion={duracion}
          onClose={() => setModalAbierto(false)}
          onSuccess={handleReservaExitosa}
        />
      )}
    </main>
  );
}
