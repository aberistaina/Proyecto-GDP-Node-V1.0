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
export const ResumenProceso = ({resumenProceso}) => {
    
    
    return (
        <div className="bg-[#ececec] rounded-lg drop-shadow-lg py-5 px-5 mb-8 shadow-[6px_6px_4px_#c0c0c0] z-40">
            <div className="flex space-x-3 mb-4 ms-4 items-center ">
                <IoDocumentTextSharp fill="#666666" className="text-2xl" />
                <h1 className="text-xl">Resumen</h1>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 mb-2">
                {Object.entries(resumenProceso).map(([key, values], index) => (
                    <div
                        key={key}
                        className={`min-w-64 bg-gray-200 rounded-lg p-4 ${colores[index]} }`}
                    >
                        <h3 className="text-lg font-semibold border-b border-gray-400 mb-2 ">
                            {key}
                        </h3>
                        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                        {key === "Subprocesos" && values.length === 0 && (
                            <li className="italic text-gray-600">No hay subprocesos asociados</li>
                            )}
                            {values.map((item, index) =>
                                key === "Subprocesos" ? (
                                    <li
                                        key={index}
                                        className="italic text-gray-600 hover:text-blue-500"
                                    >
                                        <Link
                                            to={`/process-details/${item.id}`}
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ) : (
                                    <li
                                        key={index}
                                        className="italic text-gray-600"
                                    >
                                        {item}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};
