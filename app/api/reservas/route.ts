import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { calcularPrecio } from "@/lib/pricing";
import { emailReciboSolicitud } from "@/lib/email";
import { NuevaReserva } from "@/types";

// GET /api/reservas?fecha=YYYY-MM-DD
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fecha = searchParams.get("fecha");

  if (!fecha) {
    return NextResponse.json({ error: "Falta parámetro fecha" }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json([]);
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("reservas")
    .select("*")
    .eq("fecha", fecha)
    .neq("estado", "cancelado")
    .order("hora_inicio");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/reservas — crear nueva reserva
export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json(
      { error: "Base de datos no configurada. Completá las credenciales de Supabase en .env.local" },
      { status: 503 }
    );
  }

  const body: NuevaReserva = await request.json();
  const { nombre, apellido, email, telefono, fecha, hora_inicio, duracion_min } = body;

  if (!nombre || !apellido || !email || !telefono || !fecha || !hora_inicio || !duracion_min) {
    return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
  }

  if (![60, 90, 120].includes(duracion_min)) {
    return NextResponse.json({ error: "Duración inválida" }, { status: 400 });
  }

  const precio = calcularPrecio(fecha, hora_inicio, duracion_min);

  const supabase = createServerClient();

  // Verificar que no haya conflicto
  const { data: existentes } = await supabase
    .from("reservas")
    .select("hora_inicio, duracion_min")
    .eq("fecha", fecha)
    .neq("estado", "cancelado");

  const inicioNuevo = toMinutos(hora_inicio);
  const finNuevo = inicioNuevo + duracion_min;

  const conflicto = existentes?.some((r) => {
    const ini = toMinutos(r.hora_inicio);
    const fin = ini + r.duracion_min;
    return inicioNuevo < fin && finNuevo > ini;
  });

  if (conflicto) {
    return NextResponse.json(
      { error: "El horario seleccionado ya no está disponible" },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("reservas")
    .insert({ nombre, apellido, email, telefono, fecha, hora_inicio, duracion_min, precio })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Enviar emails (no bloquear respuesta si falla)
  emailReciboSolicitud(data).catch(console.error);

  return NextResponse.json(data, { status: 201 });
}

function toMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}
