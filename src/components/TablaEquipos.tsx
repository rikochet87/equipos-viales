"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Equipo, Consorcio } from "@/lib/types";
import CondicionBadge from "./CondicionBadge";
import PolizaBadge from "./PolizaBadge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Props {
  equipos: Equipo[];
  consorcios?: Consorcio[];
  modoAdmin?: boolean;
}

export default function TablaEquipos({ equipos, consorcios = [], modoAdmin = false }: Props) {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [filtroZona, setFiltroZona] = useState("");
  const [filtroConsorcio, setFiltroConsorcio] = useState("");
  const [filtroPropietario, setFiltroPropietario] = useState<"" | "DVP" | "Consorcio">("");
  const [filtroCondicion, setFiltroCondicion] = useState("");
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [confirmarId, setConfirmarId] = useState<string | null>(null);
  const [listaEquipos, setListaEquipos] = useState<Equipo[]>(equipos);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Consorcios filtrados por zona seleccionada (para el dropdown de consorcio)
  const consorciosPorZona = filtroZona
    ? consorcios.filter((c) => c.zona_id === Number(filtroZona))
    : consorcios;

  const filtrados = listaEquipos.filter((e) => {
    const tipo = (e as any).tipos_equipo?.nombre ?? "";
    const consorcio = (e as any).consorcios?.nombre ?? "";
    const texto = `${tipo} ${e.marca ?? ""} ${e.modelo ?? ""} ${e.dominio ?? ""} ${e.legajo ?? ""} ${consorcio}`.toLowerCase();

    if (busqueda && !texto.includes(busqueda.toLowerCase())) return false;
    if (filtroZona && e.zona_id !== Number(filtroZona)) return false;
    if (filtroConsorcio && e.consorcio_id !== Number(filtroConsorcio)) return false;
    if (filtroPropietario && e.propietario !== filtroPropietario) return false;
    if (filtroCondicion && e.condicion !== filtroCondicion) return false;
    return true;
  });

  // ── Helpers de exportación ──────────────────────────────────────
  function buildEncabezados(): string[] {
    const cols = [
      "Tipo", "Propietario", "Consorcio", "Km Red",
      "Marca", "Modelo", "Año", "Legajo", "Dominio",
      "N° Chasis", "N° Motor", "Condición", "Póliza Nro", "Póliza Vto", "Observaciones",
    ];
    return modoAdmin ? ["Zona", ...cols] : cols;
  }

  function buildFila(e: Equipo): (string | number)[] {
    const fila: (string | number)[] = [
      (e as any).tipos_equipo?.nombre ?? "",
      e.propietario,
      (e as any).consorcios?.nombre ?? "",
      (e as any).consorcios?.km ?? "",
      e.marca ?? "", e.modelo ?? "", e.anio ?? "",
      e.legajo ?? "", e.dominio ?? "", e.n_chasis ?? "", e.n_motor ?? "",
      e.condicion, e.poliza_numero ?? "", e.poliza_vencimiento ?? "",
      e.observaciones ?? "",
    ];
    return modoAdmin ? [e.zona_id, ...fila] : fila;
  }

  function fecha() { return new Date().toISOString().slice(0, 10); }

  function descargar(contenido: string, nombre: string, tipo: string) {
    const blob = new Blob([contenido], { type: tipo });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = nombre; a.click();
    URL.revokeObjectURL(url);
  }

  // ── Exportar CSV ────────────────────────────────────────────────
  function exportarCSV() {
    const csv = [buildEncabezados(), ...filtrados.map(buildFila)]
      .map((fila) => fila.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    descargar("﻿" + csv, `equipos_viales_${fecha()}.csv`, "text/csv;charset=utf-8;");
  }

  // ── Exportar Excel ──────────────────────────────────────────────
  async function exportarExcel() {
    try {
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.aoa_to_sheet([buildEncabezados(), ...filtrados.map(buildFila)]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Equipos");
      XLSX.writeFile(wb, `equipos_viales_${fecha()}.xlsx`);
    } catch {
      alert("Error al exportar Excel. Intentá con CSV.");
    }
  }

  // ── Exportar PDF ────────────────────────────────────────────────
  async function exportarPDF() {
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");
      const doc = new jsPDF({ orientation: "landscape" });
      doc.setFontSize(14);
      doc.text("Equipos Viales — DVP Chaco", 14, 15);
      doc.setFontSize(9);
      doc.text(`Generado: ${new Date().toLocaleDateString("es-AR")}  |  ${filtrados.length} equipos`, 14, 22);
      autoTable(doc, {
        head: [buildEncabezados()],
        body: filtrados.map(buildFila),
        startY: 27,
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [15, 52, 96], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
      });
      doc.save(`equipos_viales_${fecha()}.pdf`);
    } catch {
      alert("Error al exportar PDF.");
    }
  }

  // ── Eliminar equipo ─────────────────────────────────────────────
  async function eliminarEquipo(id: string) {
    setEliminandoId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("equipos").delete().eq("id", id);
      if (error) throw error;
      setListaEquipos((prev) => prev.filter((e) => e.id !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      alert("Error al eliminar: " + msg);
    } finally {
      setEliminandoId(null);
      setConfirmarId(null);
    }
  }

  const colSpanTotal = modoAdmin ? 10 : 9;

  return (
    <div>
      {/* ── Filtros ── */}
      <div className="flex flex-wrap gap-2 mb-4 items-end">
        <div className="flex-1 min-w-[160px]">
          <input
            type="text"
            placeholder="Buscar tipo, marca, dominio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-field"
          />
        </div>

        {modoAdmin && (
          <select
            value={filtroZona}
            onChange={(e) => { setFiltroZona(e.target.value); setFiltroConsorcio(""); }}
            className="input-field w-auto"
          >
            <option value="">Todas las zonas</option>
            {[1, 2, 3, 4, 5].map((z) => (
              <option key={z} value={z}>Zona {z}</option>
            ))}
          </select>
        )}

        {modoAdmin && consorcios.length > 0 && (
          <select
            value={filtroConsorcio}
            onChange={(e) => setFiltroConsorcio(e.target.value)}
            className="input-field w-auto"
          >
            <option value="">Todos los consorcios</option>
            {consorciosPorZona.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre ?? `Consorcio ${c.numero}`}
                {c.km ? ` (${c.km} km)` : ""}
              </option>
            ))}
          </select>
        )}

        <select
          value={filtroPropietario}
          onChange={(e) => setFiltroPropietario(e.target.value as any)}
          className="input-field w-auto"
        >
          <option value="">Todos los propietarios</option>
          <option value="DVP">DVP</option>
          <option value="Consorcio">Consorcio</option>
        </select>

        <select
          value={filtroCondicion}
          onChange={(e) => setFiltroCondicion(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">Todas las condiciones</option>
          <optgroup label="── Operativo">
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Malo">Malo</option>
          </optgroup>
          <optgroup label="── No operativo">
            <option value="En reparación">En reparación</option>
            <option value="Desuso">Desuso</option>
            <option value="Baja">Baja</option>
          </optgroup>
        </select>

        <div className="flex gap-2">
          <button onClick={exportarCSV} className="btn-secondary whitespace-nowrap text-xs px-3 py-2">
            ↓ CSV
          </button>
          <button
            onClick={exportarExcel}
            className="btn-secondary whitespace-nowrap text-xs px-3 py-2 !text-green-700 !border-green-300 hover:!bg-green-50"
          >
            ↓ Excel
          </button>
          <button
            onClick={exportarPDF}
            className="btn-secondary whitespace-nowrap text-xs px-3 py-2 !text-red-700 !border-red-300 hover:!bg-red-50"
          >
            ↓ PDF
          </button>
        </div>
      </div>

      {/* ── Tabla ── */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {modoAdmin && <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona</th>}
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propietario</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Km Red</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca / Modelo</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dominio / Legajo</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condición</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Póliza</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={colSpanTotal} className="px-3 py-8 text-center text-gray-400">
                  No se encontraron equipos
                </td>
              </tr>
            ) : (
              filtrados.map((equipo) => {
                const polizaVencida = equipo.poliza_vencimiento
                  ? new Date(equipo.poliza_vencimiento + "T00:00:00") < hoy
                  : false;
                const kmRed = (equipo as any).consorcios?.km;
                const estaEliminando = eliminandoId === equipo.id;

                return (
                  <tr
                    key={equipo.id}
                    className={`hover:bg-gray-50 transition-colors ${polizaVencida ? "bg-red-50 hover:bg-red-100" : ""} ${estaEliminando ? "opacity-40 pointer-events-none" : ""}`}
                  >
                    {modoAdmin && (
                      <td className="px-3 py-3 whitespace-nowrap font-medium text-vialidad-azul">
                        Zona {equipo.zona_id}
                      </td>
                    )}
                    <td className="px-3 py-3 font-medium text-gray-900">
                      {(equipo as any).tipos_equipo?.nombre ?? "-"}
                    </td>
                    <td className="px-3 py-3 text-gray-600">
                      {equipo.propietario === "Consorcio"
                        ? <span title={(equipo as any).consorcios?.nombre}>Consorcio {(equipo as any).consorcios?.numero ?? ""}</span>
                        : "DVP"}
                    </td>
                    <td className="px-3 py-3 text-gray-600 text-xs">
                      {equipo.propietario === "Consorcio" && kmRed != null
                        ? <span className="font-medium">{kmRed} km</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-3 py-3 text-gray-700">
                      {[equipo.marca, equipo.modelo].filter(Boolean).join(" ") || "-"}
                    </td>
                    <td className="px-3 py-3 text-gray-600">{equipo.anio ?? "-"}</td>
                    <td className="px-3 py-3 text-gray-600 font-mono text-xs">
                      {equipo.dominio ?? equipo.legajo ?? "-"}
                    </td>
                    <td className="px-3 py-3">
                      <CondicionBadge condicion={equipo.condicion} />
                    </td>
                    <td className="px-3 py-3">
                      <PolizaBadge fecha={equipo.poliza_vencimiento} numero={equipo.poliza_numero} />
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/equipos/${equipo.id}`}
                          className="text-xs font-semibold rounded px-2 py-0.5 transition-opacity hover:opacity-80"
                          style={{ backgroundColor: "#FFE400", color: "#333333" }}
                        >
                          Ver / Editar
                        </Link>
                        {confirmarId === equipo.id ? (
                          <span className="flex items-center gap-1">
                            <button
                              onClick={() => eliminarEquipo(equipo.id)}
                              disabled={estaEliminando}
                              className="text-xs text-white bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded disabled:opacity-50"
                            >
                              {estaEliminando ? "..." : "Confirmar"}
                            </button>
                            <button
                              onClick={() => setConfirmarId(null)}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              Cancelar
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setConfirmarId(equipo.id)}
                            className="text-xs text-red-400 hover:text-red-600"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        {filtrados.length} de {listaEquipos.length} equipos
      </p>
    </div>
  );
}
