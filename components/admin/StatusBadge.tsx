import { EstadoReserva } from "@/types";

const config: Record<EstadoReserva, { label: string; classes: string }> = {
  pendiente:  { label: "Pendiente",  classes: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmado: { label: "Confirmado", classes: "bg-green-100 text-green-800 border-green-200"  },
  cancelado:  { label: "Cancelado",  classes: "bg-red-100 text-red-800 border-red-200"        },
};

export default function StatusBadge({ estado }: { estado: EstadoReserva }) {
  const { label, classes } = config[estado];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
      {label}
    </span>
  );
}
