import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import { LuBriefcase } from "react-icons/lu";
import { BsClipboard2Check } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";

export const ListaProcesosPendientes = ({ procesos, isLoading }) => {
    const navigate = useNavigate();

    const handleClick = (idProceso, version) => {
        try {
            navigate(`/process-details/${idProceso}/${version}`);
        } catch (error) {
            console.log(error);
        }
    };

    const procesosPendientes = procesos.filter((p) => p.estado === "pendiente");
    const procesosAprobados = procesos.filter((p) => p.estado === "aprobado");
    const procesosRechazados = procesos.filter((p) => p.estado === "rechazado");

    if (!isLoading) return <PulseLoader color="#10644C" size={15} />;
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Aprobaciones Pendientes*/}
                <div className="bg-[#FBFBFB] p-5 rounded-lg shadow  ">
                    <div className="mb-2 border-b bg-white rounded-md">
                        <h2 className="text-2xl font-semibold  flex gap-2 items-center">
                            <IoDocumentTextOutline
                                className="text-3xl"
                                stroke="#d5c507"
                            />
                            Aprobaciones Pendientes
                        </h2>
                        <span className="text-[#AAAAAA] text-sm">
                            Procesos que estás editando actualmente.
                        </span>
                    </div>

                    <div className="space-y-3 min-h-[360px] max-h-[360px] overflow-auto">
                        {procesosPendientes.length === 0 ? (
                            <h1 className="text-center text-gray-500">
                                No hay borradores activos
                            </h1>
                        ) : (
                            procesosPendientes.map((proceso) => (
                                <div
                                    key={proceso.idAprobador}
                                    className="flex justify-between items-center bg-white rounded-md px-3 py-4 shadow-lg mt-6"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {proceso.nombreProceso}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Versión {proceso.nombreVersion} ·{" "}
                                            {proceso.fechaCreacionAprobacion} ·{" "}
                                        </p>
                                        <p className="mt-1 inline-block px-3 py-1 rounded-full border border-[#F2D643] text-xs font-bold bg-yellow-100 text-yellow-800">
                                            {proceso.estado}
                                        </p>
                                    </div>
                                    <button
                                        className="bg-[#F4F4F5] text-[#99CC33] hover:bg-[#99CC33] hover:text-white  border border-[#99CC33] text-sm px-3 py-2 flex justify-center items-center gap-1  rounded-md transition duration-200 ease-in-out transform "
                                        onClick={() =>
                                            handleClick(
                                                proceso.idBpmn,
                                                proceso.idVersionProceso
                                            )
                                        }
                                    >
                                        Ver Detalles <IoIosArrowForward />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/*Procesos Aprobados*/}
                <div className="bg-[#FBFBFB] p-5 rounded-lg shadow ">
                    <div className="mb-2 border-b bg-white rounded-md">
                        <h2 className="text-2xl font-semibold  flex gap-2 items-center">
                            <BsClipboard2Check className="text-2xl" fill="#008000" />
                            Procesos Aprobados
                        </h2>
                        <span className="text-[#AAAAAA] text-sm">
                            Procesos que están aprobados.
                        </span>
                    </div>

                    <ul className="space-y-3 min-h-[360px] max-h-[360px] overflow-auto">
                        {procesosAprobados.length === 0 ? (
                            <h1 className="text-center text-gray-500">
                                No hay Procesos Aprobados
                            </h1>
                        ) : (
                            procesosAprobados.map((proceso) => (
                                <div
                                    key={proceso.idAprobador}
                                    className="flex justify-between items-center bg-white rounded-md px-3 py-4 shadow-lg mt-6"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {proceso.nombreProceso}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Versión {proceso.nombreVersion} ·{" "}
                                            {proceso.fechaCreacionAprobacion} ·{" "}
                                        </p>
                                        <p className="mt-1 inline-block px-3 py-1 rounded-full border border-[#008000] text-xs font-bold bg-[#BBF7D0] text-[#008000]">
                                            {proceso.estado}
                                        </p>
                                    </div>
                                    <button
                                        className="bg-[#F4F4F5] text-[#99CC33] hover:bg-[#99CC33] hover:text-white  border border-[#99CC33] text-sm px-3 py-2 flex justify-center items-center gap-1  rounded-md transition duration-200 ease-in-out transform "
                                        onClick={() =>
                                            handleClick(
                                                proceso.idBpmn,
                                                proceso.idVersionProceso
                                            )
                                        }
                                    >
                                        Ver Detalles <IoIosArrowForward />
                                    </button>
                                </div>
                            ))
                        )}
                    </ul>
                </div>
                
                {/*Procesos Rechazados*/}
                <div className="bg-[#FBFBFB] p-5 rounded-lg shadow">
                    <div className="mb-2 border-b bg-white rounded-md ">
                        <h2 className="text-2xl font-semibold  flex gap-2 items-center ">
                            <BiErrorCircle
                                className="text-3xl"
                                fill="#f91818"
                            />
                            Procesos Rechazados
                        </h2>
                        <span className="text-[#AAAAAA] text-sm">
                            Procesos Rechazados que están esperando modificaciones.
                        </span>
                    </div>

                    <div className="space-y-3 min-h-[360px] max-h-[360px] overflow-auto">
                        {procesosRechazados.length === 0 ? (
                            <h1 className="text-center text-gray-500">
                                No hay Procesos Rechazados
                            </h1>
                        ) : (
                            procesosRechazados.map((proceso) => (
                                <div
                                    key={proceso.idAprobador}
                                    className="flex justify-between items-center bg-white rounded-md px-3 py-4 shadow-lg mt-6"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {proceso.nombreProceso}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Versión {proceso.nombreVersion} ·{" "}
                                            {proceso.fechaCreacionAprobacion} ·{" "}
                                        </p>
                                        <p className="mt-1 inline-block px-3 py-1 rounded-full border border-red-600 text-xs font-bold bg-red-200 text-red-600">
                                            {proceso.estado}
                                        </p>
                                    </div>
                                    <button
                                        className="bg-[#F4F4F5] text-[#99CC33] hover:bg-[#99CC33] hover:text-white  border border-[#99CC33] text-sm px-3 py-2 flex justify-center items-center gap-1  rounded-md transition duration-200 ease-in-out transform "
                                        onClick={() =>
                                            handleClick(
                                                proceso.idBpmn,
                                                proceso.idVersionProceso
                                            )
                                        }
                                    >
                                        Ver Detalles <IoIosArrowForward />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </>
    );
};
