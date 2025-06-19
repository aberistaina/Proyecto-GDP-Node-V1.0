import { Link } from "react-router-dom";
import { FaFolder } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

export const ProcesoTabla = ({ procesoActual, procesos, entrarAProceso }) => {
  return (
    <table className="w-full table-auto border rounded">
      <thead>
        <tr className="bg-gray-100 border-b border-black">
          <th className="px-4 py-2 text-left font-normal italic">Nombre</th>
          <th className="px-4 py-2 text-left font-normal italic">Fecha de Creación</th>
          <th className="px-4 py-2 text-left font-normal italic">Tipo</th>
          <th className="px-4 py-2 text-left font-normal italic">Creador</th>
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
                className="text-slate-600 font-extralight italic cursor-pointer hover:text-blue-500"
              >
                {procesoActual.nombre}
              </Link>
            </td>
            <td className="px-4 py-2 text-slate-600 font-extralight italic ">{procesoActual.created_at}</td>
            <td className="px-4 py-2 text-slate-600 font-extralight italic">Flujo</td>
            <td className="px-4 py-2 text-slate-600 font-extralight italic">{procesoActual.creador}</td>
          </tr>
        )}

        {/* Subprocesos como carpetas */}
        {procesos.map((proceso) => (
          <tr key={proceso.id_bpmn} className="border-b hover:bg-gray-50">
            <td className="px-4 py-2 flex items-center gap-2">
              <FaFolder className="text-yellow-500" />
              <span
                onClick={() => entrarAProceso(proceso)}
                className="text-slate-600 font-extralight italic cursor-pointer hover:text-blue-500"
              >
                {proceso.nombre}
              </span>
            </td>
            <td className="px-4 py-2 text-slate-600 font-extralight italic ">{proceso.created_at}</td>
            <td className="px-4 py-2 text-slate-600 font-extralight italic">Carpeta</td>
            <td className="px-4 py-2 text-slate-600 font-extralight italic">{proceso.creador}</td>
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
