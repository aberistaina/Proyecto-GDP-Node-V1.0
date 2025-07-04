import { useEffect } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useAdminData } from "../../../../../context/AdminDataContext";

export const Versiones = ({setModo, setOpenModalVersion, getVersions, versiones, setVersiones}) => {
    
    const { id, setVersion } = useAdminData();
    const navigate = useNavigate()

    const handleVerClick = (idProceso, version) => {
        navigate(`/process-details/${idProceso}/${version}`)
    }

    const handleUpdateClick = (version) => {
        setOpenModalVersion(true)
        setVersion(version)
    }

    useEffect(() => {
        getVersions(id, setVersiones)
    }, [])
    
    return (
        <div>
            <button className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition duration-200 ease-in-out transform hover:scale-105 mb-2"
            onClick={() => setModo("proceso")}
            >
                <IoArrowBackOutline className="me-2" />Volver
            </button>
            <div className="overflow-x-auto">
                {versiones.length === 0 ? (
                <h1>No hay Versiones para este proceso</h1>
            ) : (
                <table className="w-[50%] divide-y divide-gray-200 shadow-md rounded-lg p-4">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                Versión
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                Creador
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                Fecha Creación
                            </th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                                <div className="flex justify-center">
                                    <FaEdit
                                        fill="#FBBF24"
                                        className="text-xl"
                                    />
                                </div>
                            </th>
                            <th className="px-6 py-3 items-center text-sm font-medium text-gray-600 uppercase tracking-wider">
                                <div className="flex justify-center">
                                    <MdDelete
                                        fill="#cd0805"
                                        className="text-xl"
                                    />
                                </div>
                            </th>
                            <th className="px-6 py-3 items-center text-sm font-medium text-gray-600 uppercase tracking-wider">
                                <div className="flex justify-center">
                                    <FaEye fill="#16A34A" className="text-xl" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {versiones.map((version) => (
                            <tr
                                key={version.id_proceso}
                                className="hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-4 whitespace-wrap text-sm text-gray-800 min-w-[300px]">
                                    {version.nombre_proceso}
                                </td>
                                <td className="px-6 py-4 whitespace-wrap text-sm text-gray-800">
                                    {version.nombre_version}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {version.estado}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {version.creador}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {version.created_at}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    <div className="flex justify-center items-center min-h-full">
                                        <button
                                            className="px-4 flex items-center py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-md  transition duration-200 ease-in-out transform hover:scale-105"
                                            onClick={() =>handleUpdateClick(version.id_version_proceso)}>
                                            <FaEdit className="me-2" />
                                            Modificar
                                        </button>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-800">
                                    <div className="flex justify-center items-center min-h-full">
                                        <button
                                            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-105"
                                            /* onClick={()=> handleDeleteClick(rol.id_rol, enqueueSnackbar, type, getAllRoles, confirm)} */
                                        >
                                            <FaEdit className="me-2" />
                                            Eliminar
                                        </button>
                                    </div>
                                </td>

                                <td className="px-6 py-4  text-sm text-gray-800">
                                    <div className="flex justify-center items-center min-h-full">
                                        <button
                                            className="flex items-center justify-center px-4 py-2 min-w-[108px] bg-green-600 text-white rounded-md hover:bg-green-800 transition duration-200 ease-in-out transform hover:scale-105"
                                            onClick={() =>
                                                handleVerClick(
                                                    version.id_bpmn,
                                                    version.id_version_proceso
                                                )
                                            }
                                        >
                                            <FaEye className="me-2" />
                                            Ver
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            </div>
        </div>
    );
};
