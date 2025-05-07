
import { FaFolder } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

//nombre, fecha publicacion, version, creador, aprobadores
export const TipoProcesoTable = ({ vista, setVista, handleClickMacroprocesos, handleClickProcesos, procesos, procesoSeleccionado, subProcesos }) => {
  return (
    <div className="bg-white">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="border-b-2">
                            <th className="px-10 py-2 text-left">
                                <input type="checkbox" name="" id="" />
                            </th>
                            <th className="px-10 py-2 text-left">Nombre</th>
                            <th className="px-10 py-2 text-left">Modificado</th>
                            <th className="px-10 py-2 text-left">Tipo</th>
                            <th className="px-10 py-2 text-left">Creador</th>
                        </tr>
                    </thead>
                    <tbody>
                    {vista ==="inicio" && (
                            <tr className="border-b hover:bg-gray-100" >
                                <th className="px-10 py-2 text-left">
                                    <input type="checkbox" name="" id="" />
                                </th>
                                <td className="px-10 py-2 flex items-center space-x-2">
                                    <FaFolder className="fill-[#f8d101]" />
                                    <p className="italic cursor-pointer"
                                    onClick={handleClickMacroprocesos}
                                    >Macroproceso de la gestion comercial de energia</p>
                                </td>
                                <td className="px-10 py-2 italic">22-10-2025</td>
                                <td className="px-10 py-2 italic">Carpeta</td>
                                <td className="px-10 py-2 italic">Maximiliano Rojas</td>
                            </tr>
                        )}  
                        
                        {vista ==="macroprocesos" && (
                            procesos.map((proceso) => (
                                <tr key={proceso.idProceso} className="border-b hover:bg-gray-100">
                                    <th className="px-10 py-2 w-1 text-left">
                                        <input type="checkbox" name="" id="" />
                                    </th>
                                    <td className="px-10 py-2 flex items-center space-x-2">
                                        <FaFolder className="fill-[#f8d101]" />
                                        <p className="italic cursor-pointer"
                                        onClick={(e) => handleClickProcesos(proceso.nombre, proceso.idProceso)}
                                        >{proceso.nombre}</p>
                                    </td>
                                    <td className="px-10 py-2 italic">22-10-2025</td>
                                    <td className="px-10 py-2 italic">Carpeta</td>
                                    <td className="px-10 py-2 italic">Maximiliano Rojas</td> 
                                </tr>
                            ))
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
                                                {procesoSeleccionado.nombre}
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
