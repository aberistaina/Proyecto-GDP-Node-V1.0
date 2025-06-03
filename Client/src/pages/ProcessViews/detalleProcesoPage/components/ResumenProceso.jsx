import { IoDocumentTextSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

//Subprocesos, responsables, tiempo sla poner links a subprocesos
const colores = [
    "border-l-[6px] border-yellow-500",
    "border-l-[6px] border-green-600",
    "border-l-[6px] border-teal-500",
    "border-l-[6px] border-blue-800",
    "border-l-[6px] border-pink-600",
    "border-l-[6px] border-sky-500",
];
export const ResumenProceso = ({ resumenProceso }) => {

    return (

        <div className="bg-[#ececec] rounded-lg drop-shadow-lg py-5 px-5 mb-8 shadow-[6px_6px_4px_#c0c0c0] z-40">
            <div className="flex space-x-3 mb-4 ms-4 items-center ">
                <IoDocumentTextSharp fill="#666666" className="text-2xl" />
                <h1 className="text-xl">Resumen</h1>
            </div>

            
            <div className="flex overflow-x-auto gap-4 pb-4 mb-2">

                {/* Card Subprocesos*/ }
                <div className={`min-w-64 max-h-52 overflow-y-auto bg-gray-200 rounded-lg p-4 ${colores[0]} }`}
                >
                    <h3 className="text-lg font-semibold border-b border-gray-400 mb-2 ">
                        SubProcesos
                    </h3>
                    <ul className="text-sm text-gray-700 list-disc  list-inside space-y-1">
                        { resumenProceso && resumenProceso?.subprocesos?.length === 0 ? (
                            <li className="italic text-gray-600">
                                No hay subprocesos asociados
                            </li>
                        ) : (
                            resumenProceso.subprocesos?.map(
                                (subproceso, index) => (
                                    <li
                                        key={index}
                                        className="italic text-gray-600 hover:text-blue-500"
                                    >
                                        <Link
                                            to={`/process-details/${subproceso.id}/${subproceso.version}`}
                                        >
                                            {subproceso.nombre}
                                        </Link>
                                    </li>
                                )
                            )
                        )}
                    </ul>
                </div>

                {/* Card Ejecutantes*/ }
                <div
                    className={`min-w-64  max-h-52 overflow-y-auto bg-gray-200 rounded-lg p-4 ${colores[1]} }`}
                >
                    <h3 className="text-lg font-semibold border-b border-gray-400 mb-2 ">
                        Ejecutantes
                    </h3>
                    <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                        { resumenProceso && resumenProceso?.ejecutantes?.length === 0 ? (
                            <li className="italic text-gray-600">
                                No hay ejecutantes asociados
                            </li>
                        ) : (
                            resumenProceso.ejecutantes?.map(
                                (ejecutante, index) => (
                                    <li
                                        key={index}
                                        className="italic text-gray-600 hover:text-blue-500">
                                    {ejecutante}
                                    </li>
                                )
                            )
                        )}
                    </ul>
                </div>

                {/* Card Responsables*/ }
                <div
                    className={`min-w-64 max-h-52 overflow-y-auto bg-gray-200 rounded-lg p-4 ${colores[2]} }`}
                >
                    <h3 className="text-lg font-semibold border-b border-gray-400 mb-2 ">
                        Responsables
                    </h3>
                    <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                        { resumenProceso && resumenProceso?.responsable?.length === 0 ? (
                            <li className="italic text-gray-600">
                                No hay responsables asociados
                            </li>
                        ) : (
                            resumenProceso.responsable?.map(
                                (r, index) => (
                                    <li
                                        key={index}
                                        className="italic text-gray-600 hover:text-blue-500">
                                    {r}
                                    </li>
                                )
                            )
                        )}
                    </ul>
                </div>

                {/* Card Consultados*/ }
                <div
                    className={`min-w-64 max-h-52 overflow-y-auto bg-gray-200 rounded-lg p-4 ${colores[3]} }`}
                >
                    <h3 className="text-lg font-semibold border-b border-gray-400 mb-2 ">
                        Consultados
                    </h3>
                    <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                        { resumenProceso && resumenProceso?.consultado?.length === 0 ? (
                            <li className="italic text-gray-600">
                                No hay consultados asociados
                            </li>
                        ) : (
                            resumenProceso.consultado?.map(
                                (c, index) => (
                                    <li
                                        key={index}
                                        className="italic text-gray-600 hover:text-blue-500">
                                    {c}
                                    </li>
                                )
                            )
                        )}
                    </ul>
                </div>

                {/* Card Informados*/ }

                <div
                    className={`min-w-64 max-h-52 overflow-y-auto bg-gray-200 rounded-lg p-4 ${colores[4]} }`}
                >
                    <h3 className="text-lg font-semibold border-b border-gray-400 mb-2 ">
                        Informados
                    </h3>
                    <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                        { resumenProceso && resumenProceso?.informado?.length === 0 ? (
                            <li className="italic text-gray-600">
                                No hay informados asociados
                            </li>
                        ) : (
                            resumenProceso.informado?.map(
                                (i, index) => (
                                    <li
                                        key={index}
                                        className="italic text-gray-600 hover:text-blue-500">
                                    {i}
                                    </li>
                                )
                            )
                        )}
                    </ul>
                </div>

                {/* Card SLA*/ }

                <div
                    className={`min-w-64 max-h-52 overflow-y-auto bg-gray-200 rounded-lg p-4 ${colores[5]} }`}
                >
                    <h3 className="text-lg font-semibold border-b border-gray-400 mb-2 ">
                        SLA
                    </h3>
                    <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                        { resumenProceso && resumenProceso?.tiempoSLA?.length === 0 ? (
                            <li className="italic text-gray-600">
                                No hay SLA asociado
                            </li>
                        ) : (
                            resumenProceso.tiempoSLA?.map(
                                (sla, index) => (
                                    <li
                                        key={index}
                                        className="italic text-gray-600 hover:text-blue-500">
                                    {sla}
                                    </li>
                                )
                            )
                        )}
                    </ul>
                </div>

                
            </div>
        </div>
    );
};
