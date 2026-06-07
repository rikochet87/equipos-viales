import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import FormularioEquipo from "@/components/FormularioEquipo";
import HistorialAuditoria from "@/components/HistorialAuditoria";
import type { Perfil } from "@/lib/types";

export default async function DetalleEquipoPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", user.id)
    .single<Perfil>();

  if (!perfil) redirect("/login");

  // Cargar equipo
  const { data: equipo } = await supabase
    .from("equipos")
    .select("*, tipos_equipo(*), consorcios(*)")
    .eq("id", params.id)
    .single();

  if (!equipo) notFound();

  // Verificar permisos
  if (perfil.rol !== "admin" && equipo.zona_id !== perfil.zona_id) {
    redirect("/");
  }

  // Catálogos
  const [{ data: tipos }, { data: consorcios }, { data: categorias }, { data: auditoria }] = await Promise.all([
    supabase.from("tipos_equipo").select("*, categorias_equipo(nombre)").eq("activo", true).order("categoria_id").order("nombre"),
    supabase.from("consorcios").select("id, numero, nombre, zona_id, km").order("zona_id").order("nombre"),
    supabase.from("categorias_equipo").select("*").order("id"),
    supabase.from("auditoria").select("*").eq("equipo_id", params.id).order("created_at", { ascending: false }).limit(50),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar perfil={perfil} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-vialidad-celeste hover:underline">← Volver</a>
          <h1 className="text-xl font-bold text-vialidad-azul mt-2">
            {equipo.tipos_equipo?.nombre ?? "Equipo"} — {equipo.marca ?? ""} {equipo.modelo ?? ""}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">ID: {equipo.id}</p>
        </div>

        <div className="card mb-6">
          <FormularioEquipo
            tipos={tipos ?? []}
            consorcios={consorcios ?? []}
            categorias={categorias ?? []}
            zonaId={perfil.rol === "admin" ? null : perfil.zona_id}
            perfil={perfil}
            equipoInicial={equipo}
          />
        </div>

        {/* Historial de cambios */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-3">Historial de cambios</h2>
          <HistorialAuditoria registros={auditoria ?? []} />
        </div>
      </main>
    </div>
  );
}
