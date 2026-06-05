"use client";

import { useState } from "react";
import type { Equipo } from "@/lib/types";
import CondicionBadge from "./CondicionBadge";
import PolizaBadge from "./PolizaBadge";
import Link from "next/link";

interface Props {
  equipos: Equipo[];
  modoAdmin?: boolean;
}

export default function TablaEquipos({ equipos, modoAdmin = false }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroPropietario, setFiltroPropietario] = useState<"" | "DVP" | "Consorcio">("");
  const [filtroCondicion, setFiltroCondicion] = useState("");

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const filtrados = equipos.filter((e) => {
    const tipo = (e as any).tipos_equipo?.nombre ?? "";
    const consorcio = (e as any).consorcios?.nombre ?? "";
    const texto = `${tipo} ${e.marca ?? ""} ${e.modelo ?? ""} ${e.dominio ?? ""} ${e.legajo ?? ""} ${consorcio}`.toLowerCase();

    if (busqueda && !texto.includes(busqueda.toLowerCase())) return false;
    if (filtroPropietario && e.propietario !== filtroPropietario) return false;
    if (filtroCondicion && e.condicion !== filtroCondicion) return false;
    return true;
  });

  function exportarCSV() {
    const encabezados = [
      "Tipo", "Propietario", "Consorcio", "Marca", "Modelo", "Año",
      "Legajo", "Dominio", "N° Chasis", "N° Motor",
      "Condición", "Póliza Nro", "Póliza Vto", "Observaciones"
    ];
    const filas = filtrados.map((e) => [
      (e as any).tipos_equipo?.nombre ?? "",
      e.propietario,
      (e as any).consorcios?.nombre ?? "",
      e.marca ?? "", e.modelo ?? "", e.anio ?? "",
      e.legajo ?? "", e.dominio ?? "", e.n_chasis ?? "", e.n_motor ?? "",
      e.condicion, e.poliza_numero ?? "", e.poliza_vencimiento ?? "",
      e.observaciones ?? ""
    ]);
    const csv = [encabezados, ...filas]
      .map((fila) => fila.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `equipos_viales_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-4 items-end">
        <div className="flex-1 min-w-[180px]">
          <input
            type="text"
            placeholder="Buscar tipo, marca, dominio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-field"
          />
        </div>
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
          <option value="Operativo">Operativo</option>
          <option value="En reparación">En reparación</option>
          <option value="Fuera de servicio">Fuera de servicio</option>
          <option value="Para baja">Para baja</option>
        </select>
        <button onClick={exportarCSV} className="btn-secondary whitespace-nowrap">
          ↓ Exportar CSV
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {modoAdmin && <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona</th>}
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propietario</th>
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
                <td colSpan={modoAdmin ? 9 : 8} className="px-3 py-8 text-center text-gray-400">
                  No se encontraron equipos
                </td>
              </tr>
            ) : (
              filtrados.map((equipo) => {
                const polizaVencida = equipo.poliza_vencimiento
                  ? new Date(equipo.poliza_vencimiento + "T00:00:00") < hoy
                  : false;

                return (
                  <tr
                    key={equipo.id}
                    className={`hover:bg-gray-50 transition-colors ${polizaVencida ? "bg-red-50 hover:bg-red-100" : ""}`}
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
                    <td className="px-3 py-3 text-right">
                      <Link href={`/equipos/${equipo.id}`} className="text-vialidad-celeste hover:underline text-xs">
                        Ver / Editar
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        {filtrados.length} de {equipos.length} equipos
      </p>
    </div>
  );
}
