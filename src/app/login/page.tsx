"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#333333" }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Franja amarilla superior */}
        <div className="h-2" style={{ backgroundColor: "#FFE400" }} />

        <div className="p-8">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: "#FFE400" }}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#333333" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold" style={{ color: "#333333" }}>
              Inventario de Equipos Viales
            </h1>
            <p className="text-sm font-medium mt-1" style={{ color: "#555555" }}>
              Dirección de Conservación Vial
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#888888" }}>
              Dpto. Consorcios Camineros
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="label-field">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="zona1@vialidad.gob.ar"
              />
            </div>

            <div>
              <label htmlFor="password" className="label-field">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 rounded-lg font-semibold text-sm transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#FFE400", color: "#333333" }}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>

        {/* Franja inferior con nombre institución */}
        <div className="px-8 py-3 text-center" style={{ backgroundColor: "#333333" }}>
          <p className="text-xs font-medium" style={{ color: "#FFE400" }}>
            DVP · Dirección de Vialidad Provincial del Chaco
          </p>
        </div>

      </div>
    </div>
  );
}
