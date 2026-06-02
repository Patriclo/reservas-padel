import { DuracionMin } from "@/types";
import { isWeekend, parseISO, getHours, getMinutes } from "date-fns";

const PRECIO_BASE_SEMANA_MANANA = 55000;  // antes 17:00 días de semana
const PRECIO_BASE_ALTO = 70000;           // 17:00+ semana, fines de semana

function getPrecioBase(fecha: string, horaInicio: string): number {
  const date = parseISO(fecha);
  if (isWeekend(date)) return PRECIO_BASE_ALTO;

  const [horas, minutos] = horaInicio.split(":").map(Number);
  const minutosDelDia = horas * 60 + minutos;
  return minutosDelDia < 17 * 60 ? PRECIO_BASE_SEMANA_MANANA : PRECIO_BASE_ALTO;
}

export function calcularPrecio(
  fecha: string,
  horaInicio: string,
  duracionMin: DuracionMin
): number {
  const base = getPrecioBase(fecha, horaInicio);
  // Proporcional en base a 90min, redondeado hacia abajo en miles
  const precio = Math.floor((base / 90) * duracionMin / 1000) * 1000;
  return precio;
}

export function formatPrecio(precio: number): string {
  return `$${precio.toLocaleString("es-AR")}`;
}
