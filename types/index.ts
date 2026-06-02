export type EstadoReserva = "pendiente" | "confirmado" | "cancelado";
export type DuracionMin = 60 | 90 | 120;

export interface Reserva {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fecha: string;        // "YYYY-MM-DD"
  hora_inicio: string;  // "HH:MM:SS"
  duracion_min: DuracionMin;
  precio: number;
  estado: EstadoReserva;
  created_at: string;
}

export interface NuevaReserva {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fecha: string;
  hora_inicio: string;
  duracion_min: DuracionMin;
}

export interface TurnoSlot {
  hora: string;         // "HH:MM"
  disponible: boolean;
  estado?: EstadoReserva;
  reservaId?: string;
}
