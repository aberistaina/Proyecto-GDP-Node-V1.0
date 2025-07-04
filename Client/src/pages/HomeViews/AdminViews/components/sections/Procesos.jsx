import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { FaEdit,FaCheckCircle, FaTimesCircle, FaEye, FaHistory } from "react-icons/fa";
import { MdDelete, MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";

import { useAdminData } from "../../../../../context/AdminDataContext";
import { FiltroTexto } from "../FiltroTexto";
import { FiltroCheck } from "../FiltroCheck";
import { FiltroOptions } from "../FiltroOptions";

export const Procesos = ({ setOpenModalProcess, setModo }) => {

    const { procesos, setID } = useAdminData();
    const navigate = useNavigate()
    const [ busqueda, setBusqueda ] = useState("")
    const [macroproceso, setMacroproceso] = useState(false);
    const [ nivel, setNivel ] = useState("")
    const [ estado, setEstado ] = useState("")
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 10;

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
        navigate(`/process-details/${idProceso}/${version}`)
    }
    const handleUpdateClick = (id_proceso) =>{
        setOpenModalProcess(true)
        setID(id_proceso)
    }

    const handleVersion = (id_proceso) =>{
        setModo("version")
        setID(id_proceso)
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

    const paginacion = elementosFiltrados.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
    );

    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    const totalPaginas = Math.ceil(elementosFiltrados.length / elementosPorPagina);

    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda, macroproceso, nivel, estado]);

  return (
    <>
            
            <div className="flex flex-col">
                <div className="flex flex-wrap items-center justify-start mb-4">
                    <FiltroTexto setBusqueda={setBusqueda}/>
                    <FiltroOptions values={niveles} setOptions={setNivel} label={"Nivel"} value={nivel} initialState={"Selecciona un Nivel"} />
                    <FiltroOptions values={estados} setOptions={setEstado} label={"Estado"} value={estado} initialState={"Selecciona un Estado"} />
                    <FiltroCheck check={macroproceso} setCheck={setMacroproceso} label={"Macroproceso"}/>
                </div>
                <div className="overflow-x-auto">
                    { paginacion.length === 0 ? (
                    <h1>No hay Procesos</h1>
                ) : 
                (
                    <table className=" divide-y divide-gray-200 shadow-md rounded-lg p-4">
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
                                Macroproceso
                            </th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                                <div className="flex justify-center">
                                    <FaEdit fill="#FBBF24" className="text-xl" />
                                </div>
                            </th>
    
                            {/* <th className="px-6 py-3 items-center text-sm font-medium text-gray-600 uppercase tracking-wider">
                                <div className="flex justify-center">
                                    <MdDelete fill="#cd0805" className="text-xl"/>
                                </div>
                            </th> */}

                            <th className="px-6 py-3 items-center text-sm font-medium text-gray-600 uppercase tracking-wider">
                                <div className="flex justify-center">
                                    <FaHistory fill="#3B82F6" className="text-xl"/>
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
                        {paginacion.map((proceso) => (
                            <tr key={proceso.id_proceso} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-wrap text-sm text-gray-800 min-w-[200px] max-w-[250px] lg:max-w-[400px]">
                                    {proceso.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {proceso.estado}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {proceso.creador}
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
                                        onClick={() => handleUpdateClick(proceso.id_proceso)}
                                        >
                                            <FaEdit className="me-2" />Modificar
                                        </button>
                                    </div>
                                </td>
    
                                {/* <td className="px-6 py-4 text-sm text-gray-800">
                                    <div className="flex justify-center items-center min-h-full">
                                        <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-105" 
                                        onClick={()=> handleDeleteClick(rol.id_rol, enqueueSnackbar, type, getAllRoles, confirm)}
                                            >
                                            <FaEdit className="me-2" />Eliminar
                                        </button>
                                    </div>
                                </td> */}

                                <td className="px-6 py-4  text-sm text-gray-800">
                                    <div className="flex justify-center items-center min-h-full">
                                        <button className="flex items-center justify-center px-4 py-2 min-w-[108px] bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200 ease-in-out transform hover:scale-105" 
                                        onClick={()=> handleVersion(proceso.id_proceso)}

                                            >
                                            <FaHistory className="me-2" />Versiones
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
                <div className="w-full bg-[#EFF0F2] flex justify-center items-center mb-6">
                    <span className="text-center text-sm">{`Mostrando un total de ${elementosFiltrados.length} procesos`}</span>
                </div>
                
                {/* Paginación */}
                <div className="flex justify-center items-center">
                    <button 
                        onClick={() => cambiarPagina(paginaActual - 1)} 
                        disabled={paginaActual === 1} 
                        className="px-1 py-1 text-lg bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-all duration-300 cursor-pointer">
                        <MdOutlineNavigateBefore className="inline-block mb-1 mr-1" />
                    </button>
                    <span className="text-lg text-slate-200">
                        {paginaActual} de {totalPaginas}
                    </span>
                    <button 
                        onClick={() => cambiarPagina(paginaActual + 1)} 
                        disabled={paginaActual === totalPaginas} 
                        className="px-1 py-1 text-lg bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-all duration-300 cursor-pointer">
                        <MdOutlineNavigateNext className="inline-block mb-1 mr-1" />
                    </button>
                </div>
            </div>
        </>
  )
}
