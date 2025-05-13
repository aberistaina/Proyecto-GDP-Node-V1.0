import { useState, useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";


export default function Comentarios({idProceso}) {
    const [comentarios, setComentarios ] = useState([])

    useEffect(() => {
        const getAllComentaries = async() =>{
            try {
                const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(`${URL}/api/v1/procesos/comentarios/getAll/${idProceso}`)
                const data = await response.json()
                setComentarios(data.data)
            } catch (error) {
                console.log(error);
            }
        }
        getAllComentaries()
    }, [])
    

    return (
      <div className="overflow-x-auto max-h-52 bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Comentario</th>
            <th className="px-4 py-3">Usuario</th>
            </tr>
        </thead>
        <tbody>
            {comentarios.map((comentario) => (
            <tr key={comentario.id_comentario} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 flex gap-1 items-center min-w-44 max-w-44 "><FaRegCalendarAlt />{comentario.created_at}</td>
                <td className="px-4 py-2 text-gray-600">{comentario.comentario}</td>
                <td className="px-4 py-2 text-green-700 font-medium min-w-40 max-w-40">{comentario.nombre_creador}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>  
    );
  }
  