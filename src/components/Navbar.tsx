"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Perfil } from "@/lib/types";

interface NavbarProps {
  perfil: Perfil;
}

export default function Navbar({ perfil }: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav style={{ backgroundColor: "#333333" }} className="text-white shadow-md">
      <div className="h-1" style={{ backgroundColor: "#FFE400" }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#FFE400" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <div>
              <span className="font-bold text-base leading-none">Equipos Viales</span>
              <p className="text-xs leading-none mt-0.5" style={{ color: "#FFE400" }}>
                Dirección de Conservación Vial
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium leading-none">{perfil.nombre}</p>
              <p className="text-xs leading-none mt-0.5" style={{ color: "#FFE400" }}>
                {perfil.rol === "admin" ? "Administrador" : `Zona ${perfil.zona_id}`}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold rounded px-3 py-1.5 transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#FFE400", color: "#333333" }}
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
