import type { Auditoria } from "@/lib/types";

const LABELS: Record<string, string> = {
  tipo_id: "Tipo de equipo",
  propietario: "Propietario",
  consorcio_id: "Consorcio",
  legajo: "Legajo",
  dominio: "Dominio",
  marca: "Marca",
  modelo: "Modelo",
  anio: "Año",
  n_chasis: "N° Chasis",
  n_motor: "N° Motor",
  condicion: "Condición",
  en_servicio: "En servicio",
  poliza_numero: "N° Póliza",
  poliza_vencimiento: "Vto. Póliza",
  observaciones: "Observaciones",
};

export default function HistorialAuditoria({ registros }: { registros: Auditoria[] }) {
  if (registros.length === 0) {
    return <p className="text-sm text-gray-400">Sin registros de cambios.</p>;
  }

  return (
    <div className="divide-y divide-gray-100 text-sm">
      {registros.map((r) => (
        <div key={r.id} className="py-2.5">
          <div className="flex items-start justify-between">
            <span className="font-medium text-gray-700">
              {r.accion === "crear" && "✦ Equipo creado"}
              {r.accion === "eliminar" && "✖ Equipo eliminado"}
              {r.accion === "editar" && `✎ ${LABELS[r.campo_modificado!] ?? r.campo_modificado}`}
            </span>
            <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
              {new Date(r.created_at).toLocaleString("es-AR")}
            </span>
          </div>
          {r.accion === "editar" && (
            <div className="mt-0.5 text-xs text-gray-500">
              <span className="line-through text-red-400">{r.valor_anterior ?? "–"}</span>
              {" → "}
              <span className="text-green-700">{r.valor_nuevo ?? "–"}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
