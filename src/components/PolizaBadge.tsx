import { diasHastaVencimiento } from "@/lib/types";

interface Props {
  fecha: string | null;
  numero?: string | null;
}

export default function PolizaBadge({ fecha, numero }: Props) {
  if (!fecha) {
    return <span className="text-gray-400 text-xs">Sin póliza</span>;
  }

  const dias = diasHastaVencimiento(fecha);
  const fechaFormateada = new Date(fecha + "T00:00:00").toLocaleDateString("es-AR");

  let claseTexto = "poliza-vigente";
  let etiqueta = "";

  if (dias !== null && dias < 0) {
    claseTexto = "poliza-vencida";
    etiqueta = `VENCIDA hace ${Math.abs(dias)} días`;
  } else if (dias !== null && dias <= 30) {
    claseTexto = "poliza-por-vencer";
    etiqueta = `Vence en ${dias} días`;
  } else {
    etiqueta = `Vigente al ${fechaFormateada}`;
  }

  return (
    <div className="text-xs">
      {numero && <span className="text-gray-500 mr-1">N°{numero}</span>}
      <span className={claseTexto}>{etiqueta}</span>
    </div>
  );
}
