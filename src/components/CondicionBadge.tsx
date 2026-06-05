import type { Condicion } from "@/lib/types";

const CLASES: Record<Condicion, string> = {
  "Operativo": "badge-operativo",
  "En reparación": "badge-reparacion",
  "Fuera de servicio": "badge-fuera",
  "Para baja": "badge-baja",
};

export default function CondicionBadge({ condicion }: { condicion: Condicion }) {
  return <span className={CLASES[condicion]}>{condicion}</span>;
}
