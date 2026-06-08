import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import TablaEquipos from "@/components/TablaEquipos";
import type { Perfil, Consorcio } from "@/lib/types";

export default async function AdminPage() {
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

  if (!perfil || perfil.rol !== "admin") redirect("/");

  // Cargar TODOS los equipos con joins (incluye km del consorcio)
  const { data: equipos } = await supabase
    .from("equipos")
    .select(`
      *,
      tipos_equipo ( id, nombre, categoria_id, requiere_chasis_motor, categorias_equipo ( nombre ) ),
      consorcios ( id, nombre, numero, km, zona_id ),
      zonas ( id, nombre, sede )
    `)
    .order("zona_id")
    .order("created_at", { ascending: false });

  // Lista completa de consorcios para el filtro
  const { data: consorcios } = await supabase
    .from("consorcios")
    .select("id, nombre, numero, zona_id, km")
    .order("zona_id")
    .order("numero");

  const todos = equipos ?? [];
  const listaConsorcios = (consorcios ?? []) as Consorcio[];

  // Métricas por zona
  const porZona = [1, 2, 3, 4, 5].map((z) => {
    const zona = todos.filter((e) => e.zona_id === z);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencidas = zona.filter((e) => e.poliza_vencimiento && new Date(e.poliza_vencimiento + "T00:00:00") < hoy);
    return {
      zona: z,
      total: zona.length,
      dvp: zona.filter((e) => e.propietario === "DVP").length,
      consorcios: zona.filter((e) => e.propietario === "Consorcio").length,
      polizasVencidas: vencidas.length,
    };
  });

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const totalVencidas = todos.filter((e) => e.poliza_vencimiento && new Date(e.poliza_vencimiento + "T00:00:00") < hoy).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar perfil={perfil} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-vialidad-azul">Panel Administrador</h1>
          <p className="text-sm text-gray-500 mt-1">Vista consolidada — {todos.length} equipos en 5 zonas</p>
        </div>

        {totalVencidas > 0 && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6 flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.73 0L3.268 16.5C2.5 18.333 3.46 20 5 20z" />
            </svg>
            <p className="font-semibold text-red-800 text-sm">
              {totalVencidas} equipo{totalVencidas > 1 ? "s" : ""} con póliza de seguro VENCIDA en toda la provincia
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {porZona.map((z) => (
            <div key={z.zona} className={`card text-center ${z.polizasVencidas > 0 ? "border-red-300" : ""}`}>
              <p className="text-xs font-medium text-gray-500 mb-1">Zona {z.zona}</p>
              <p className="text-2xl font-bold text-vialidad-azul">{z.total}</p>
              <p className="text-xs text-gray-500">{z.dvp} DVP · {z.consorcios} Consorcios</p>
              {z.polizasVencidas > 0 && (
                <p className="text-xs font-semibold text-red-600 mt-1">
                  ⚠ {z.polizasVencidas} póliza{z.polizasVencidas > 1 ? "s" : ""} vencida{z.polizasVencidas > 1 ? "s" : ""}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Inventario completo</h2>
          <TablaEquipos equipos={todos} consorcios={listaConsorcios} modoAdmin={true} />
        </div>
      </main>
    </div>
  );
}
