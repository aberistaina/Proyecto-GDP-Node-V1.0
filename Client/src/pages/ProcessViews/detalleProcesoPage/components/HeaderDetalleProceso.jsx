import { FaUserLarge } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { MdOutlinePendingActions } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi2";
import { TfiMenuAlt } from "react-icons/tfi";
import { GrDocumentDownload } from "react-icons/gr";
import { RiFolderDownloadLine } from "react-icons/ri";


export const HeaderDetalleProceso = ({headerProceso}) => {

    return (
        <div className="bg-[#ececec] rounded-lg drop-shadow-lg py-5 mb-8 flex justify-evenly shadow-[6px_6px_4px_#c0c0c0]">
            <div className="flex justify-between w-full mx-auto">

                {/* Lado izquierdo */}
                {/*Agregar etiquetas de Nombre creador y fecha aprovación*/ }
                <div className="w-3/4 pr-4 border-r-2 border-r-[#adadad]">
                    <div className="flex items-center px-8">
                        <IoMdDownload title="Descargar Proceso" className="text-4xl rounded-full bg-[#48752c] p-1 hover:bg-[#294618] cursor-pointer" fill="#ffffff" />
                        <h1 className="text-3xl font-bold px-2">
                            {headerProceso.nombre}
                        </h1>
                    </div>
                    <p className="italic text-md px-[4.8rem] mb-1 text-gray-700">{headerProceso.descripcion}</p>

                    <div className="flex items-center ms-[2.7rem]">
                        <FaUserLarge title="Creador del proceso" />
                        <p className="italic ms-4">{headerProceso.creador}</p>
                    </div>

                    <div className="flex items-center ms-[2.6rem]">
                        <FaRegCalendarAlt title="Fecha de Creación" />
                        <p className="italic ms-4">{headerProceso.fechaCreacion}</p>
                    </div>
                </div>

                {/* Lado derecho */}
                {/*Visualizadores versión, quienes aprobaron (quitar estado actual y detalle avanzado). eliminar fecha de modificación, documentacion y adjuntos*/ }
                <div className="w-[30%] pl-4 flex flex-col justify-between gap-y-1">
                    <div>
                        <h1 className="text-2xl ms-5">
                            Detalles
                        </h1>
                    </div>

                    <div className="flex items-center ms-[0.9rem] px-5">
                        <MdOutlinePendingActions title="Estado Actual" className="fill-[#b89230] text-xl" />
                        <p className="italic ms-4">{headerProceso.estado}</p>
                    </div>

                    <div className="flex items-center ms-[0.9rem] px-5">
                        <HiUserGroup title="Aprobadores" className="text-xl" />
                        <p className="italic ms-4">{headerProceso.aprobadores && headerProceso.aprobadores.length > 0 ? headerProceso.aprobadores.join(", ") : "No hay aprobadores"}</p>
                    </div>

                    <div className="flex items-center ms-[0.9rem] px-5">
                        <GrDocumentDownload title="Estado Actual" className="text-xl" />
                        <p className="italic ms-4 cursor-pointer hover:text-[#48752c]">Documentación</p>
                    </div>

                    <div className="flex items-center ms-[0.9rem] px-5">
                        <RiFolderDownloadLine title="Estado Actual" className="text-xl" />
                        <p className="italic ms-4 cursor-pointer hover:text-[#48752c]">Adjuntos</p>
                    </div>

                    <div className="flex items-center ms-4 px-5">
                        <TfiMenuAlt className="rotate-180 text-lg" />
                        <p className="italic ms-4">Versión {headerProceso.version}</p>
                    </div>

                    <div className="flex justify-end pr-4">
                        <p className="italic text-sm underline cursor-pointer hover:text-[#48752c] transition">
                            Ver detalle avanzado
                        </p>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};
