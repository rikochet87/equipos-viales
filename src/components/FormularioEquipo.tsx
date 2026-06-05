"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { TipoEquipo, Consorcio, CategoriaEquipo, Perfil } from "@/lib/types";

interface Props {
  tipos: TipoEquipo[];
  consorcios: Consorcio[];
  categorias: CategoriaEquipo[];
  zonaId: number | null; // null = admin puede elegir zona
  perfil: Perfil;
  // Para edición
  equipoInicial?: any;
}

export default function FormularioEquipo({ tipos, consorcios, zonaId, perfil, equipoInicial }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const modoEdicion = !!equipoInicial;

  const [form, setForm] = useState({
    zona_id: equipoInicial?.zona_id ?? zonaId ?? 1,
    tipo_id: equipoInicial?.tipo_id ?? "",
    propietario: equipoInicial?.propietario ?? "DVP",
    consorcio_id: equipoInicial?.consorcio_id ?? "",
    legajo: equipoInicial?.legajo ?? "",
    dominio: equipoInicial?.dominio ?? "",
    marca: equipoInicial?.marca ?? "",
    modelo: equipoInicial?.modelo ?? "",
    anio: equipoInicial?.anio ?? "",
    n_chasis: equipoInicial?.n_chasis ?? "",
    n_motor: equipoInicial?.n_motor ?? "",
    condicion: equipoInicial?.condicion ?? "Operativo",
    en_servicio: equipoInicial?.en_servicio ?? true,
    poliza_numero: equipoInicial?.poliza_numero ?? "",
    poliza_vencimiento: equipoInicial?.poliza_vencimiento ?? "",
    observaciones: equipoInicial?.observaciones ?? "",
  });

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tipoSeleccionado = tipos.find((t) => t.id === Number(form.tipo_id));
  const requiereChasisMotor = tipoSeleccionado?.requiere_chasis_motor ?? false;
  const esConsorcio = form.propietario === "Consorcio";

  const consorciosFiltrados = consorcios.filter(
    (c) => c.zona_id === Number(form.zona_id)
  );

  function setField(campo: string, valor: any) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  // Validar si la póliza está vencida
  const polizaVencida =
    form.poliza_vencimiento &&
    new Date(form.poliza_vencimiento + "T00:00:00") < new Date(new Date().toDateString());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    if (!form.tipo_id) {
      setError("Debés seleccionar el tipo de equipo.");
      setGuardando(false);
      return;
    }
    if (esConsorcio && !form.consorcio_id) {
      setError("Debés seleccionar el consorcio.");
      setGuardando(false);
      return;
    }

    const payload: any = {
      zona_id: Number(form.zona_id),
      tipo_id: Number(form.tipo_id),
      propietario: form.propietario,
      consorcio_id: esConsorcio ? Number(form.consorcio_id) : null,
      legajo: form.legajo || null,
      dominio: form.dominio || null,
      marca: form.marca || null,
      modelo: form.modelo || null,
      anio: form.anio ? Number(form.anio) : null,
      n_chasis: requiereChasisMotor ? (form.n_chasis || null) : null,
      n_motor: requiereChasisMotor ? (form.n_motor || null) : null,
      condicion: form.condicion,
      en_servicio: form.en_servicio,
      poliza_numero: form.poliza_numero || null,
      poliza_vencimiento: form.poliza_vencimiento || null,
      observaciones: form.observaciones || null,
    };

    let queryError;

    if (modoEdicion) {
      const { error: e } = await supabase
        .from("equipos")
        .update(payload)
        .eq("id", equipoInicial.id);
      queryError = e;
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      payload.creado_por = user?.id;
      const { error: e } = await supabase.from("equipos").insert(payload);
      queryError = e;
    }

    if (queryError) {
      setError("Error al guardar: " + queryError.message);
      setGuardando(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Zona (solo admin puede cambiar) */}
      {perfil.rol === "admin" && (
        <div>
          <label className="label-field">Zona *</label>
          <select
            className="input-field"
            value={form.zona_id}
            onChange={(e) => { setField("zona_id", e.target.value); setField("consorcio_id", ""); }}
            required
          >
            {[1, 2, 3, 4, 5].map((z) => (
              <option key={z} value={z}>Zona {z}</option>
            ))}
          </select>
        </div>
      )}

      {/* Propietario */}
      <div>
        <label className="label-field">Propietario *</label>
        <div className="flex gap-4 mt-1">
          {["DVP", "Consorcio"].map((p) => (
            <label key={p} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="propietario"
                value={p}
                checked={form.propietario === p}
                onChange={() => { setField("propietario", p); setField("consorcio_id", ""); }}
                className="text-vialidad-azul"
              />
              <span className="text-sm font-medium">{p}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Consorcio (solo si propietario = Consorcio) */}
      {esConsorcio && (
        <div>
          <label className="label-field">Consorcio *</label>
          <select
            className="input-field"
            value={form.consorcio_id}
            onChange={(e) => setField("consorcio_id", e.target.value)}
            required
          >
            <option value="">— Seleccionar consorcio —</option>
            {consorciosFiltrados.map((c) => (
              <option key={c.id} value={c.id}>
                N°{c.numero} — {c.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tipo de equipo */}
      <div>
        <label className="label-field">Tipo de equipo *</label>
        <select
          className="input-field"
          value={form.tipo_id}
          onChange={(e) => setField("tipo_id", e.target.value)}
          required
        >
          <option value="">— Seleccionar tipo —</option>
          {tipos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Marca / Modelo / Año */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label-field">Marca</label>
          <input type="text" className="input-field" value={form.marca}
            onChange={(e) => setField("marca", e.target.value)} placeholder="John Deere" />
        </div>
        <div>
          <label className="label-field">Modelo</label>
          <input type="text" className="input-field" value={form.modelo}
            onChange={(e) => setField("modelo", e.target.value)} placeholder="6120E" />
        </div>
        <div>
          <label className="label-field">Año</label>
          <input type="number" className="input-field" value={form.anio}
            onChange={(e) => setField("anio", e.target.value)} min={1970} max={2099} placeholder="2020" />
        </div>
      </div>

      {/* Legajo / Dominio */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-field">Legajo (DVP)</label>
          <input type="text" className="input-field" value={form.legajo}
            onChange={(e) => setField("legajo", e.target.value)} placeholder="EJ-001" />
        </div>
        <div>
          <label className="label-field">Dominio / Patente</label>
          <input type="text" className="input-field" value={form.dominio}
            onChange={(e) => setField("dominio", e.target.value.toUpperCase())} placeholder="AB123CD" />
        </div>
      </div>

      {/* Chasis / Motor (solo si el tipo lo requiere) */}
      {requiereChasisMotor && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">N° de Chasis</label>
            <input type="text" className="input-field font-mono" value={form.n_chasis}
              onChange={(e) => setField("n_chasis", e.target.value)} />
          </div>
          <div>
            <label className="label-field">N° de Motor</label>
            <input type="text" className="input-field font-mono" value={form.n_motor}
              onChange={(e) => setField("n_motor", e.target.value)} />
          </div>
        </div>
      )}

      {/* Condición */}
      <div>
        <label className="label-field">Condición *</label>
        <select
          className="input-field"
          value={form.condicion}
          onChange={(e) => setField("condicion", e.target.value)}
          required
        >
          <option value="Operativo">Operativo</option>
          <option value="En reparación">En reparación</option>
          <option value="Fuera de servicio">Fuera de servicio</option>
          <option value="Para baja">Para baja</option>
        </select>
      </div>

      {/* Póliza de seguro */}
      <div className={`rounded-lg border p-4 ${polizaVencida ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
        <h3 className={`text-sm font-semibold mb-3 ${polizaVencida ? "text-red-700" : "text-gray-700"}`}>
          {polizaVencida ? "⚠ Póliza de seguro — VENCIDA" : "Póliza de seguro"}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Número de póliza</label>
            <input type="text" className="input-field" value={form.poliza_numero}
              onChange={(e) => setField("poliza_numero", e.target.value)} placeholder="00012345" />
          </div>
          <div>
            <label className="label-field">Fecha de vencimiento</label>
            <input
              type="date"
              className={`input-field ${polizaVencida ? "border-red-400 text-red-700 font-semibold" : ""}`}
              value={form.poliza_vencimiento}
              onChange={(e) => setField("poliza_vencimiento", e.target.value)}
            />
            {polizaVencida && (
              <p className="text-xs text-red-600 font-semibold mt-1">
                ¡Esta póliza está vencida! Actualizá la cobertura.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Observaciones */}
      <div>
        <label className="label-field">Observaciones</label>
        <textarea
          className="input-field"
          rows={3}
          value={form.observaciones}
          onChange={(e) => setField("observaciones", e.target.value)}
          placeholder="Estado general, reparaciones pendientes, etc."
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
      )}

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
        <a href="/" className="btn-secondary">Cancelar</a>
        <button type="submit" disabled={guardando} className="btn-primary">
          {guardando ? "Guardando..." : modoEdicion ? "Guardar cambios" : "Registrar equipo"}
        </button>
      </div>
    </form>
  );
}
