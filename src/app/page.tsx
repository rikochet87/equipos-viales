import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import TablaEquipos from "@/components/TablaEquipos";
import type { Perfil } from "@/lib/types";

export default async function HomePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Obtener perfil
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", user.id)
    .single<Perfil>();

  if (!perfil) redirect("/login");

  // Admin → redirigir al panel admin
  if (perfil.rol === "admin") redirect("/admin");

  // Cargar equipos de la zona del usuario
  const { data: equipos } = await supabase
    .from("equipos")
    .select(`
      *,
      tipos_equipo ( id, nombre, categoria_id, requiere_chasis_motor, categorias_equipo ( nombre ) ),
      consorcios ( id, nombre, numero, km )
    `)
    .eq("zona_id", perfil.zona_id!)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar perfil={perfil} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de zona */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-vialidad-azul">
              Zona {perfil.zona_id}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {equipos?.length ?? 0} equipos registrados
            </p>
          </div>
          <a
            href="/equipos/nuevo"
            className="text-sm font-semibold rounded-md px-4 py-2 transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#FFE400", color: "#333333" }}
          >
            + Nuevo equipo
          </a>
        </div>

        {/* Alertas póliza vencida */}
        <PolizasVencidas equipos={equipos ?? []} />

        {/* Tabla de equipos */}
        <div className="card mt-4">
          <TablaEquipos equipos={equipos ?? []} />
        </div>
      </main>
    </div>
  );
}

function PolizasVencidas({ equipos }: { equipos: any[] }) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const vencidas = equipos.filter((e) => {
    if (!e.poliza_vencimiento) return false;
    return new Date(e.poliza_vencimiento + "T00:00:00") < hoy;
  });

  if (vencidas.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.73 0L3.268 16.5C2.5 18.333 3.46 20 5 20z" />
        </svg>
        <div>
          <p className="font-semibold text-red-800 text-sm">
            {vencidas.length} equipo{vencidas.length > 1 ? "s" : ""} con póliza vencida
          </p>
          <ul className="mt-1 text-sm text-red-700 space-y-0.5">
            {vencidas.map((e) => (
              <li key={e.id}>
                {e.tipos_equipo?.nombre}{e.marca ? ` ${e.marca}` : ""}{e.modelo ? ` ${e.modelo}` : ""} — vence{" "}
                {new Date(e.poliza_vencimiento + "T00:00:00").toLocaleDateString("es-AR")}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
