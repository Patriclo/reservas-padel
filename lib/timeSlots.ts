import { DuracionMin, Reserva, TurnoSlot } from "@/types";

const HORA_APERTURA = 8 * 60;   // 08:00 en minutos
const HORA_CIERRE = 24 * 60;    // 00:00 = 24:00 en minutos

function minutosAHora(minutos: number): string {
  const h = Math.floor(minutos / 60) % 24;
  const m = minutos % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function horaAMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

// Devuelve si un turno se superpone con una reserva existente
function hayConflicto(
  inicioNuevo: number,
  duracion: number,
  reserva: Reserva
): boolean {
  const inicioReserva = horaAMinutos(reserva.hora_inicio.substring(0, 5));
  const finNuevo = inicioNuevo + duracion;
  const finReserva = inicioReserva + reserva.duracion_min;
  return inicioNuevo < finReserva && finNuevo > inicioReserva;
}

export function generarTurnos(
  reservasExistentes: Reserva[],
  duracionMin: DuracionMin
): TurnoSlot[] {
  const slots: TurnoSlot[] = [];

  for (let inicio = HORA_APERTURA; inicio + duracionMin <= HORA_CIERRE; inicio += 30) {
    const horaStr = minutosAHora(inicio);

    const conflicto = reservasExistentes.find((r) =>
      r.estado !== "cancelado" && hayConflicto(inicio, duracionMin, r)
    );

    if (conflicto) {
      slots.push({
        hora: horaStr,
        disponible: false,
        estado: conflicto.estado,
        reservaId: conflicto.id,
      });
    } else {
      slots.push({ hora: horaStr, disponible: true });
    }
  }

  return slots;
}

export function generarFechasDisponibles(): string[] {
  const fechas: string[] = [];
  const hoy = new Date();
  for (let i = 0; i <= 10; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    fechas.push(fecha.toISOString().split("T")[0]);
  }
  return fechas;
}
