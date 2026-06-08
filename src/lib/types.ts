export type Zona = {
  id: number;
  nombre: string;
  sede: string;
  jefe: string | null;
  responsable_consorcios: string | null;
  km_totales: number | null;
};

export type Consorcio = {
  id: number;
  numero: number;
  nombre: string;
  zona_id: number;
  km: number | null;
};

export type CategoriaEquipo = {
  id: number;
  nombre: string;
};

export type TipoEquipo = {
  id: number;
  nombre: string;
  categoria_id: number;
  requiere_chasis_motor: boolean;
  activo: boolean;
  created_at: string;
  categorias_equipo?: CategoriaEquipo;
};

export type Condicion = "Bueno" | "Regular" | "Malo" | "En reparación" | "Desuso" | "Baja";
export type Propietario = "DVP" | "Consorcio";

export type Equipo = {
  id: string;
  zona_id: number;
  tipo_id: number;
  propietario: Propietario;
  consorcio_id: number | null;
  legajo: string | null;
  dominio: string | null;
  marca: string | null;
  modelo: string | null;
  anio: number | null;
  n_chasis: string | null;
  n_motor: string | null;
  condicion: Condicion;
  en_servicio: boolean;
  poliza_numero: string | null;
  poliza_vencimiento: string | null; // ISO date string YYYY-MM-DD
  observaciones: string | null;
  creado_por: string | null;
  created_at: string;
  updated_at: string;
  // joins
  tipos_equipo?: TipoEquipo;
  zonas?: Zona;
  consorcios?: Consorcio;
};

export type Auditoria = {
  id: string;
  equipo_id: string;
  usuario_id: string | null;
  accion: "crear" | "editar" | "eliminar";
  campo_modificado: string | null;
  valor_anterior: string | null;
  valor_nuevo: string | null;
  created_at: string;
};

export type Perfil = {
  id: string;
  nombre: string;
  zona_id: number | null;
  rol: "zona" | "admin";
  created_at: string;
};

// Helper: ¿la póliza está vencida?
export function polizaVencida(fecha: string | null): boolean {
  if (!fecha) return false;
  return new Date(fecha) < new Date();
}

// Helper: días hasta vencimiento (negativo = ya venció)
export function diasHastaVencimiento(fecha: string | null): number | null {
  if (!fecha) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const vto = new Date(fecha);
  vto.setHours(0, 0, 0, 0);
  return Math.round((vto.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}
