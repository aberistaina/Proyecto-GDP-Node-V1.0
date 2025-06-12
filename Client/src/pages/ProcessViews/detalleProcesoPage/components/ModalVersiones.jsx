import { FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function ModalVersiones({  setOpenModalVersiones, idProceso, versiones }) {

    
    
    const navigate = useNavigate()

    const handleClick = (version) =>{
        try {
            setOpenModalVersiones(false)
            navigate(`/process-details/${idProceso}/${version}`)
            
        } catch (error) {
            console.log(error);
        }
    }

    
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">
                    Versiones
                </h2>

                <div className="flex justify-center">
                    <table className="min-w-[90%] table-auto text-sm text-left text-gray-700">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">Versión</th>
                                <th className="px-8 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {versiones.map((version) => (
                                <tr key={version.id_version_proceso} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2 flex gap-1 items-center min-w-44 max-w-44 "><FaRegCalendarAlt />{version.created_at}</td>
                                    <td className="px-4 py-2 text-gray-600">{version.nombre_version}</td>
                                    <td className="px-4 py-2 flex gap-1 items-center justify-end min-w-44 max-w-44">
                                        <button className="bg-[#16A34A] hover:bg-[#1f8044] w-48 rounded-md py-1 text-white flex justify-center items-center gap-1"
                                        onClick={(e) => handleClick(version.id_version_proceso)}
                                        >
                                            Ver Versión
                                        </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                    <button
                        onClick={() => setOpenModalVersiones(false)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
