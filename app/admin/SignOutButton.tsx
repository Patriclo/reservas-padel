"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-white/80 hover:text-white text-sm border border-white/30 px-3 py-1.5 rounded-lg transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
