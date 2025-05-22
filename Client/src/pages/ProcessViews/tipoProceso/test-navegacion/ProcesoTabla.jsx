import { Link } from "react-router-dom";
import { FaFolder } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

export const ProcesoTabla = ({ procesoActual, procesos, entrarAProceso }) => {
  return (
    <table className="w-full table-auto border rounded">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="px-4 py-2 text-left">Nombre</th>
          <th className="px-4 py-2 text-left">Fecha de Creación</th>
          <th className="px-4 py-2 text-left">Tipo</th>
          <th className="px-4 py-2 text-left">Creador</th>
        </tr>
      </thead>
      <tbody>
        {/* Mostrar el archivo del proceso actual */}
        {procesoActual && (
          <tr className="border-b hover:bg-gray-50">
            <td className="px-4 py-2 flex items-center gap-2">
              <IoDocumentTextOutline />
              <Link
                to={`/process-details/${procesoActual.id_bpmn}/${procesoActual.version}`}
                className="text-indigo-700 underline font-medium"
              >
                {procesoActual.nombre}
              </Link>
            </td>
            <td className="px-4 py-2 italic">{procesoActual.created_at}</td>
            <td className="px-4 py-2 italic">Flujo</td>
            <td className="px-4 py-2 italic">{procesoActual.creador}</td>
          </tr>
        )}

        {/* Subprocesos como carpetas */}
        {procesos.map((proceso) => (
          <tr key={proceso.id_proceso} className="border-b hover:bg-gray-50">
            <td className="px-4 py-2 flex items-center gap-2">
              <FaFolder className="text-yellow-500" />
              <span
                onClick={() => entrarAProceso(proceso)}
                className="text-indigo-700 cursor-pointer font-medium"
              >
                {proceso.nombre}
              </span>
            </td>
            <td className="px-4 py-2 italic">{proceso.created_at}</td>
            <td className="px-4 py-2 italic">Carpeta</td>
            <td className="px-4 py-2 italic">{proceso.creador}</td>
          </tr>
        ))}

        {/* Si no hay subprocesos */}
        {procesos.length === 0 && !procesoActual && (
          <tr>
            <td colSpan={4} className="text-center py-6 text-gray-400 italic">
              No hay procesos para mostrar
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
