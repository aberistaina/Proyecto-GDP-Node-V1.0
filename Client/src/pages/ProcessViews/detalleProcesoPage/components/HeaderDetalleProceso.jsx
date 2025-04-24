import { FaUserLarge } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { MdOutlinePendingActions } from "react-icons/md";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { TfiMenuAlt } from "react-icons/tfi";

// Mockup Proceso
const proceso = {
    nombre: "Solicitud De Vacaciones",
    descripcion: "Proceso que gestiona las solicitudes de Vacaciones",
    creador: "Alejandro Beristain",
    fechaCreacion: "Lunes 14 De Abril 2025",
    fechaModificacion: "Jueves 17 De Abril 2025",
    estado: "Pendiente de Aprobación",
    version: "V 1.0.5"
};

export const HeaderDetalleProceso = () => {
    return (
        <div className="bg-[#ececec] rounded-lg drop-shadow-lg py-5 mb-8 flex justify-evenly shadow-[6px_6px_4px_#c0c0c0]">
            <div className="flex justify-between w-full mx-auto">

                {/* Lado izquierdo */}
                {/*Agregar etiquetas de Nombre creador y fecha aprovación*/ }
                <div className="w-3/4 pr-4 border-r-2 border-r-[#adadad]">
                    <div className="flex items-center px-8">
                        <IoMdDownload className="text-4xl rounded-full bg-[#48752c] p-1" fill="#ffffff" />
                        <h1 className="text-3xl font-bold px-2">
                            {proceso.nombre}
                        </h1>
                    </div>
                    <p className="italic text-md px-[4.8rem] mb-1 text-gray-700">{proceso.descripcion}</p>

                    <div className="flex items-center ms-[2.7rem]">
                        <FaUserLarge />
                        <p className="italic ms-4">{proceso.creador}</p>
                    </div>

                    <div className="flex items-center ms-[2.6rem]">
                        <FaRegCalendarAlt />
                        <p className="italic ms-4">{proceso.fechaCreacion}</p>
                    </div>
                </div>

                {/* Lado derecho */}
                {/*Visualizadores versión, quienes aprobaron (quitar estado actual y detalle avanzado). eliminar fecha de modificación, documentacion y adjuntos*/ }
                <div className="w-[30%] pl-4 flex flex-col justify-between">
                    <div>
                        <h1 className="text-2xl ms-5">
                            Detalles
                        </h1>
                    </div>

                    <div className="flex items-center ms-[0.9rem] px-5">
                        <MdOutlinePendingActions className="fill-[#b89230] text-xl" />
                        <p className="font-semibold ms-4">{proceso.estado}</p>
                    </div>

                    <div className="flex items-center ms-4 px-5">
                        <RxCounterClockwiseClock className="text-lg" />
                        <p className="italic ms-4">
                            Modificado el {proceso.fechaModificacion}
                        </p>
                    </div>

                    <div className="flex items-center ms-4 px-5">
                        <TfiMenuAlt className="rotate-180 text-lg" />
                        <p className="italic ms-4">Versión {proceso.version}</p>
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
