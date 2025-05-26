import { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

export const Oportunidades = ({idProceso, version}) => {
    const [ oportunidades, SetOportunidades ] = useState([])

    useEffect(() => {
        const getOpportunities = async () => {
            try {
                const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(`${URL}/api/v1/procesos/oportunidades/getAll/${idProceso}/${version}`)
                const data = await response.json()
                console.log(data)
                SetOportunidades(data.data)
            } catch (error) {
                console.log(error)
            }
            
        }
        getOpportunities()

    }, [])
    

    return (
      <div className="overflow-x-auto max-h-52 bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Asunto</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {oportunidades.map((oportunidad) => (
              <tr key={oportunidad.id_oportunidad} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 flex gap-1 justify-center min-w-44 max-w-44"><FaRegCalendarAlt />    {oportunidad.created_at}</td>
                <td className="px-4 py-2 font-medium text-gray-900">{oportunidad.asunto}</td>
                <td className="px-4 py-2 text-gray-600">{oportunidad.descripcion}</td>
                <td className="px-4 py-2 text-green-700 font-medium min-w-40 max-w-40">{oportunidad.nombre_creador}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  