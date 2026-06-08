import type { Condicion } from "@/lib/types";

const CLASES: Record<Condicion, string> = {
  "Bueno":         "badge-bueno",
  "Regular":       "badge-regular",
  "Malo":          "badge-malo",
  "En reparación": "badge-reparacion",
  "Desuso":        "badge-desuso",
  "Baja":          "badge-baja",
};

export default function CondicionBadge({ condicion }: { condicion: Condicion }) {
  return <span className={CLASES[condicion]}>{condicion}</span>;
}
