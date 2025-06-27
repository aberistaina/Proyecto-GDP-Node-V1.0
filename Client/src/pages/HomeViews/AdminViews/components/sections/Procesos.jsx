import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { FaEdit,FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useAdminData } from "../../../../../context/AdminDataContext";
import { useConfirmAlert } from "../../../../../context/ConfirmAlertProvider";
import { useSnackbar } from "notistack";
import { CreateButton } from "./CreateButton";
import {  handleUpdateClick, handleDeleteClick, getAllRoles } from "../../../../../utils/adminFetch";
import { FiltroTexto } from "../FiltroTexto";
import { FiltroCheck } from "../FiltroCheck";
import { FiltroOptions } from "../FiltroOptions";

export const Procesos = () => {

    const { procesos, setModo, setID, type, getAllRoles } = useAdminData();
    const navigate = useNavigate()
    const [ busqueda, setBusqueda ] = useState("")
    const [macroproceso, setMacroproceso] = useState(false);
    const [ nivel, setNivel ] = useState("")
    const [ estado, setEstado ] = useState("")

    const niveles = [
        {id: 1, nombre: "Procesos Estratégicos"},
        {id: 2, nombre: "Procesos Operativos"},
        {id: 3, nombre: "Procesos Soporte"}
    ]

    const estados = [
        {id: "borrador", nombre: "Borrador"},
        {id: "activo", nombre: "Activo"},
        {id: "archivado", nombre: "Archivado"}
    ]

    const handleVerClick = (idProceso, version) =>{
        console.log(idProceso)
        console.log(version);;
        navigate(`/process-details/${idProceso}/${version}`)
    }

    const elementosFiltrados = procesos.filter((proceso) => {
        const filtroTexto =
            proceso.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
            proceso.creador?.toLowerCase().includes(busqueda.toLowerCase());

        const filtroMacroproceso = macroproceso ? proceso.macroproceso === true : true;

        const filtroNivel = nivel ? proceso.id_nivel === Number(nivel) : true;

        const filtroEstado = estado ? proceso.estado === estado : true;


        return filtroTexto && filtroMacroproceso && filtroNivel && filtroEstado;
    });

  return (
    <>
            
            <div className="flex flex-col justify-center items-center">
                <div className="w-full mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FiltroTexto setBusqueda={setBusqueda}/>
                    <FiltroOptions values={niveles} setOptions={setNivel} label={"Nivel"} value={nivel} initialState={"Selecciona un Nivel"} />
                    <FiltroOptions values={estados} setOptions={setEstado} label={"Estado"} value={estado} initialState={"Selecciona un Estado"} />
                    <FiltroCheck check={macroproceso} setCheck={setMacroproceso} label={"Macroproceso"}/>
                </div>
                <div className="w-[50%]">
                </div>
                { elementosFiltrados.length === 0 ? (
                    <h1>No hay Procesos</h1>
                ) : 
                (
                    <table className="w-[50%] divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden mb-6 p-4">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                Creador
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                Nivel
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                Macroproceso
                            </th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                                <div className="flex justify-center">
                                    <FaEdit fill="#FBBF24" className="text-xl" />
                                </div>
                            </th>
    
                            <th className="px-6 py-3 items-center text-sm font-medium text-gray-600 uppercase tracking-wider">
                                <div className="flex justify-center">
                                    <MdDelete fill="#cd0805" className="text-xl"/>
                                </div>
                            </th>
                            <th className="px-6 py-3 items-center text-sm font-medium text-gray-600 uppercase tracking-wider">
                                <div className="flex justify-center">
                                    <FaEye fill="#16A34A" className="text-xl"/>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {elementosFiltrados.map((proceso) => (
                            <tr key={proceso.id_proceso} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-wrap text-sm text-gray-800 min-w-[300px]">
                                    {proceso.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {proceso.estado}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {proceso.creador}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {proceso.nivel}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {proceso.macroproceso ? 
                                        <FaCheckCircle className="ext-center text-xl ms-8 text-green-400" />
                                        :
                                        <FaTimesCircle className="text-center text-xl ms-8 text-red-400" />
                                    }
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    <div className="flex justify-center items-center min-h-full">
                                        <button className="px-4 flex items-center py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-md  transition duration-200 ease-in-out transform hover:scale-105"
                                        /* onClick={() => handleUpdateClick(setModo, setIsOpenCreateUpdateModal, rol.id_rol, setID)} */
                                        >
                                            <FaEdit className="me-2" />Modificar
                                        </button>
                                    </div>
                                </td>
    
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    <div className="flex justify-center items-center min-h-full">
                                        <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-105" 
                                        /* onClick={()=> handleDeleteClick(rol.id_rol, enqueueSnackbar, type, getAllRoles, confirm)} */
                                            >
                                            <FaEdit className="me-2" />Eliminar
                                        </button>
                                    </div>
                                </td>

                                <td className="px-6 py-4  text-sm text-gray-800">
                                    <div className="flex justify-center items-center min-h-full">
                                        <button className="flex items-center justify-center px-4 py-2 min-w-[108px] bg-green-600 text-white rounded-md hover:bg-green-800 transition duration-200 ease-in-out transform hover:scale-105" 
                                        onClick={()=> handleVerClick(proceso.id_bpmn, proceso.version)}
                                            >
                                            <FaEye className="me-2" />Ver
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>
        </>
  )
}
