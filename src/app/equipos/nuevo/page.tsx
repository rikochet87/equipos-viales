import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import FormularioEquipo from "@/components/FormularioEquipo";
import type { Perfil } from "@/lib/types";

export default async function NuevoEquipoPage() {
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

  const zonaId = perfil.rol === "admin" ? null : perfil.zona_id;

  // Cargar catálogos
  const [{ data: tipos }, { data: consorcios }, { data: categorias }] = await Promise.all([
    supabase.from("tipos_equipo").select("*, categorias_equipo(nombre)").eq("activo", true).order("categoria_id").order("nombre"),
    supabase.from("consorcios").select("id, numero, nombre, zona_id, km").order("zona_id").order("nombre"),
    supabase.from("categorias_equipo").select("*").order("id"),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar perfil={perfil} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-vialidad-celeste hover:underline">← Volver</a>
          <h1 className="text-xl font-bold text-vialidad-azul mt-2">Registrar nuevo equipo</h1>
        </div>
        <div className="card">
          <FormularioEquipo
            tipos={tipos ?? []}
            consorcios={consorcios ?? []}
            categorias={categorias ?? []}
            zonaId={zonaId}
            perfil={perfil}
          />
        </div>
      </main>
    </div>
  );
}
