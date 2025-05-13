import { FaFolder } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

//nombre, fecha publicacion, version, creador, aprobadores
export const TipoProcesoTable = ({ vista, setVista, handleClickMacroprocesos, handleClickProcesos, procesos, procesoSeleccionado, subProcesos, macroProcesoSeleccionado }) => {

  return (
    <div className="bg-white">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="border-b-2">
                            <th className="px-10 py-2 text-left">
                            </th>
                            <th className="px-10 py-2 text-left">Nombre</th>
                            <th className="px-10 py-2 text-left">Fecha de Creación</th>
                            <th className="px-10 py-2 text-left">Tipo</th>
                            <th className="px-10 py-2 text-left">Creador</th>
                        </tr>
                    </thead>
                    <tbody>
                    
                    {vista ==="inicio" && procesos && procesos.filter((proceso) => proceso.macroproceso === true).map((proceso) =>(
                        <tr key={proceso.id_proceso} className="border-b hover:bg-gray-100" >
                            <th className="px-10 py-2 text-left">
                                <input type="checkbox" name="" id="" />
                            </th>
                            <td className="px-10 py-2 flex items-center space-x-2">
                                <FaFolder className="fill-[#f8d101]" />
                                <p className="italic cursor-pointer"
                                onClick={(e) => handleClickMacroprocesos(proceso.nombre,proceso.id_proceso, proceso.id_bpmn, proceso.created_at, proceso.creador, proceso.version)}
                                >{proceso.nombre}</p>
                            </td>
                            <td className="px-10 py-2 italic">{proceso.created_at}</td>
                            <td className="px-10 py-2 italic">Carpeta</td>
                            <td className="px-10 py-2 italic">{proceso.creador}</td>
                        </tr>    
                    ))} 
                        {vista ==="macroprocesos" && (
                            <>
                                {subProcesos.map((subproceso) => (
                                    <tr key={subproceso.id_proceso} className="border-b hover:bg-gray-100">
                                        <th className="px-10 py-2 w-1 text-left">
                                            <input type="checkbox" name="" id="" />
                                        </th>
                                        <td className="px-10 py-2 flex items-center space-x-2">
                                            <FaFolder className="fill-[#f8d101]" />
                                            <p className="italic cursor-pointer"
                                            onClick={(e) => handleClickProcesos(subproceso.nombre, subproceso.subprocesoPadre, subproceso.id_bpmn, subproceso.created_at, subproceso.creador, subproceso.version)}
                                            >{subproceso.nombre}</p>
                                        </td>
                                        <td className="px-10 py-2 italic">{subproceso.created_at}</td>
                                        <td className="px-10 py-2 italic">Carpeta</td>
                                        <td className="px-10 py-2 italic">{subproceso.creador}</td> 
                                    </tr>
                                ))}
                                <tr key={macroProcesoSeleccionado.idProceso} className="border-b hover:bg-gray-100">
                                        <th className="px-10 py-2 w-1 text-left">
                                            <input type="checkbox" name="" id="" />
                                        </th>
                                        <td className="px-10 py-2 flex items-center space-x-2">
                                            <IoDocumentTextOutline className="fill-[#f8d101]" />
                                            <p className="italic cursor-pointer">
                                                <Link to={`/process-details/${macroProcesoSeleccionado.id_bpmn}/${macroProcesoSeleccionado.version}`}>{macroProcesoSeleccionado.nombre}</Link>
                                            </p>
                                        </td>
                                        <td className="px-10 py-2 italic">{macroProcesoSeleccionado.created_at}</td>
                                        <td className="px-10 py-2 italic">Archivo</td>
                                        <td className="px-10 py-2 italic">{macroProcesoSeleccionado.creador}</td> 
                                    </tr>
                            </>
                        )}

                        {vista === "procesos" && (
                            <>
                                <tr className="border-b hover:bg-gray-100">
                                    <th className="px-10 py-2 w-1 text-left">
                                        <input type="checkbox" name="" id="" />
                                    </th>
                                        <td className="px-10 py-2 flex items-center space-x-2">
                                            <IoDocumentTextOutline />
                                            <p className="italic cursor-pointer">
                                                <Link to={`/process-details/${procesoSeleccionado.id_bpmn}/${procesoSeleccionado.version}`}>{procesoSeleccionado.nombre}</Link>
                                            </p>
                                        </td>
                                        <td className="px-10 py-2 italic">22-10-2025</td>
                                        <td className="px-10 py-2 italic">Flujo</td>
                                        <td className="px-10 py-2 italic">Maximiliano Rojas</td>
                                </tr>
                                <tr className="border-b hover:bg-gray-100">
                                    <th className="px-10 py-2 w-1 text-left">
                                        <input type="checkbox" name="" id="" />
                                    </th>
                                        <td className="px-10 py-2 flex items-center space-x-2">
                                        <FaFolder className="fill-[#f8d101]" />
                                            <p className="italic cursor-pointer" onClick={()=> setVista("subprocesos")}>
                                                Subprocesos
                                            </p>
                                        </td>
                                        <td className="px-10 py-2 italic">22-10-2025</td>
                                        <td className="px-10 py-2 italic">Flujo</td>
                                        <td className="px-10 py-2 italic">Maximiliano Rojas</td>
                                </tr>
                            </>
                        )}

                        {vista ==="subprocesos" &&  subProcesos && (
                            subProcesos.map((subproceso) => (
                                <tr key={subproceso.idProceso} className="border-b hover:bg-gray-100">
                                    <th className="px-10 py-2 w-1 text-left">
                                        <input type="checkbox" name="" id="" />
                                    </th>
                                    <td className="px-10 py-2 flex items-center space-x-2">
                                        <IoDocumentTextOutline />
                                        <p className="italic cursor-pointer"
                                        >{subproceso.nombre}</p>
                                    </td>
                                    <td className="px-10 py-2 italic">22-10-2025</td>
                                    <td className="px-10 py-2 italic">Carpeta</td>
                                    <td className="px-10 py-2 italic">Maximiliano Rojas</td> 
                                </tr>
                            ))
                        )}

                        {vista === "subprocesos" && subProcesos.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-10 py-4 text-center italic text-gray-500">
                                    Este proceso no tiene Subprocesos vinculados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
  )
}
