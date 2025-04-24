import { FaUserLarge } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { TfiMenuAlt } from "react-icons/tfi";

export const HeaderProcesosOperativos = () => {
    return (
        <div className="bg-[#ececec] rounded-lg drop-shadow-lg h-40 pt-4 mb-8 flex justify-evenly">
            <div className="flex justify-between w-full mx-auto">
                {/* Lado izquierdo */}
                <div className="w-3/4 pr-4 border-r-2 border-r-[#adadad]">
                    <div>
                        <h1 className="text-4xl font-bold px-8 mb-6">
                            Procesos Operativos
                        </h1>
                    </div>

                    {/* Reemplazar con Datos Dinámicos */}
                    <div className="flex items-center ms-4 px-5">
                        <FaUserLarge />
                        <p className="italic ms-4">
                            Maximiliano Rojas
                        </p>
                    </div>

                    {/* Reemplazar con Datos Dinámicos */}
                    <div className="flex items-center ms-4 px-5">
                        <FaRegCalendarAlt />
                        <p className="italic ms-4">
                            Martes 7 de Agosto 2024
                        </p>
                    </div>
                </div>

                {/* Lado derecho */}
                <div className="w-1/4 pl-4 flex flex-col justify-between">
                    <div>
                        <h1 className="text-2xl px-8 mb-4">
                            Detalles
                        </h1>
                    </div>

                    {/* Reemplazar con Datos Dinámicos */}
                    <div className="flex items-center ms-4 px-5">
                        <MdOutlinePendingActions className="fill-[#b89230]"/>
                        <p className="font-semibold ms-4">
                            Pendiente Aprobación
                        </p>
                    </div>

                    {/* Reemplazar con Datos Dinámicos */}
                    <div className="flex items-center ms-4 px-5">
                        <RxCounterClockwiseClock />
                        <p className="italic ms-4">
                            Modificado hace 7 días
                        </p>
                    </div>

                    {/* Reemplazar con Datos Dinámicos */}
                    <div className="flex items-end ms-4 px-5">
                        <TfiMenuAlt className="rotate-180" />
                        <p className="italic ms-4">
                            Versión BPMN 1.6.2
                        </p>
                    </div>

                    {/* Ver detalle avanzado */}
                    <div className="flex justify-end pr-4">
                        <p className="italic">
                            Ver detalle avanzado
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};