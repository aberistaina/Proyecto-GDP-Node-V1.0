import { useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";


export const TablaBitacoraComentarios = ({comentarioBitacora, getComentariosBitacora, version }) => {
    
    

    


useEffect(() => {
        const getData = async () => {
            try {
                getComentariosBitacora()
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [version]);

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
                        {comentarioBitacora && comentarioBitacora.map((comentario) => (
                            <tr
                                key={comentario.id_comentario}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="px-4 py-2 flex gap-1 justify-center min-w-44 max-w-44">
                                    <FaRegCalendarAlt /> {comentario.created_at}
                                </td>
                                <td className="px-4 py-2 text-gray-600">
                                    {comentario.comentario}
                                </td>
                                <td className="px-4 py-2 text-green-700 font-medium min-w-40 max-w-40">
                                    {comentario.usuario?.nombre}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
  )
}
