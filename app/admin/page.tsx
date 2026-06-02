import { createServerClient } from "@/lib/supabase";
import ReservationList from "@/components/admin/ReservationList";
import SignOutButton from "./SignOutButton";
import { Reserva } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let reservas: Reserva[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("reservas")
      .select("*")
      .order("created_at", { ascending: false });
    reservas = data || [];
  }
  const pendientes = reservas.filter((r) => r.estado === "pendiente").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-padel-green text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎾</span>
            <div>
              <h1 className="font-bold text-lg leading-tight">Panel Admin</h1>
              <p className="text-padel-accent text-xs">Reservas Pádel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pendientes > 0 && (
              <span className="bg-yellow-400 text-yellow-900 text-sm font-bold px-2.5 py-1 rounded-full">
                {pendientes} pendiente{pendientes !== 1 ? "s" : ""}
              </span>
            )}
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <ReservationList reservasIniciales={reservas} />
      </main>
    </div>
  );
}
