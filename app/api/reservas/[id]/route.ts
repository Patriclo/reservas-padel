import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createServerClient } from "@/lib/supabase";
import { emailConfirmacion, emailCancelacion } from "@/lib/email";
import { EstadoReserva } from "@/types";

// PATCH /api/reservas/[id] — confirmar o cancelar (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const { estado }: { estado: EstadoReserva } = await request.json();

  if (!["confirmado", "cancelado"].includes(estado)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("reservas")
    .update({ estado })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  if (estado === "confirmado") {
    emailConfirmacion(data).catch(console.error);
  } else if (estado === "cancelado") {
    emailCancelacion(data).catch(console.error);
  }

  return NextResponse.json(data);
}
