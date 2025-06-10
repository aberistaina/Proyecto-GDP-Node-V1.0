import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import { BsClipboard2Check } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";

export const BorradoresActivos = ({ borradoresActivos, isLoading }) => {
    const navigate = useNavigate();

    const handleClick = (idProceso, version) => {
        try {
            navigate(`/process-details/${idProceso}/${version}`);
        } catch (error) {
            console.log(error);
        }
    };

    if (!isLoading) return <PulseLoader color="#10644C" size={15} />;
    const borradores = borradoresActivos.filter((b) => b.estado === "borrador");
    const borradoresRechazados = borradoresActivos.filter((b) => b.estado === "rechazado");
    const borradoresAprobados = borradoresActivos.filter((b) => b.estado === "aprobado");
    const borradoresEnEspera = borradoresActivos.filter(
        (b) => b.estado === "enviado"
    );

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#FBFBFB] p-5 rounded-lg shadow ">
                    <div className="mb-2 border-b bg-white rounded-md">
                        <h2 className="text-2xl font-semibold  flex gap-2 items-center">
                            <IoDocumentTextOutline
                                className="text-3xl"
                                stroke="#99CC33"
                            />
                            Borradores Activos
                        </h2>
                        <span className="text-[#AAAAAA] text-sm">
                            Procesos que estás editando actualmente.
                        </span>
                    </div>

                    <div className="space-y-3 min-h-[360px] max-h-[360px] overflow-auto">
                        {borradores.length === 0 ? (
                            <h1 className="text-center text-gray-500">
                                No hay borradores activos
                            </h1>
                        ) : (
                            borradores.map((borrador) => (
                                <div
                                    key={borrador.idAprobador}
                                    className="flex justify-between items-center bg-white rounded-md px-3 py-4 shadow-lg mt-6"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {borrador.nombreProceso}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Versión {borrador.nombre_version} ·{" "}
                                            {borrador.fechaCreacion}{" "}
                                        </p>
                                        <p className="mt-1 inline-block px-3 py-1 rounded-full border border-[#F2D643] text-xs font-bold bg-yellow-100 text-yellow-800">
                                            {borrador.estado}
                                        </p>
                                    </div>
                                    <button
                                        className="bg-[#F4F4F5] text-[#99CC33] hover:bg-[#99CC33] hover:text-white  border border-[#99CC33] text-sm px-3 py-2 flex justify-center items-center gap-1  rounded-md transition duration-200 ease-in-out transform "
                                        onClick={() =>
                                            handleClick(
                                                borrador.idBpmn,
                                                borrador.idVersionProceso
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

                <div className="bg-[#FBFBFB] p-5 rounded-lg shadow ">
                    <div className="mb-2 border-b bg-white rounded-md">
                        <h2 className="text-2xl font-semibold  flex gap-2 items-center">
                            <BsSend className="text-2xl" fill="#3B82F6" />
                            Pendientes de Aprobación
                        </h2>
                        <span className="text-[#AAAAAA] text-sm">
                            Procesos que están esperando respuesta.
                        </span>
                    </div>

                    <ul className="space-y-3 min-h-[360px] max-h-[360px] overflow-auto">
                        {borradoresEnEspera.length === 0 ? (
                            <h1 className="text-center text-gray-500">
                                No hay borradores Pendientes de Aprobación
                            </h1>
                        ) : (
                            borradoresEnEspera.map((borrador) => (
                                <div
                                    key={borrador.idAprobador}
                                    className="flex justify-between items-center bg-white rounded-md px-3 py-4 shadow-lg mt-6"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {borrador.nombreProceso}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Versión {borrador.nombre_version} ·{" "}
                                            {borrador.fechaCreacion}{" "}
                                        </p>
                                        <p className="mt-1 inline-block px-3 py-1 rounded-full border border-sky-600 text-xs font-bold bg-sky-200 text-sky-600">
                                            {borrador.estado}
                                        </p>
                                    </div>
                                    <button
                                        className="bg-[#F4F4F5] text-[#99CC33] hover:bg-[#99CC33] hover:text-white  border border-[#99CC33] text-sm px-3 py-2 flex justify-center items-center gap-1  rounded-md transition duration-200 ease-in-out transform "
                                        onClick={() =>
                                            handleClick(
                                                borrador.idBpmn,
                                                borrador.idVersionProceso
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

                <div className="bg-[#FBFBFB] p-5 rounded-lg shadow ">
                    <div className="mb-2 border-b bg-white rounded-md">
                        <h2 className="text-2xl font-semibold  flex gap-2 items-center">
                            <BiErrorCircle
                                className="text-3xl"
                                stroke="#f91818"
                                fill="#f91818"
                            />
                            Borradores Rechazados
                        </h2>
                        <span className="text-[#AAAAAA] text-sm">
                            Procesos que están esperando modificaciones.
                        </span>
                    </div>

                    <div className="space-y-3 min-h-[360px] max-h-[360px] overflow-auto">
                        {borradoresRechazados.length === 0 ? (
                            <h1 className="text-center text-gray-500">
                                No hay borradores rechazados
                            </h1>
                        ) : (
                            borradoresRechazados.map((borrador) => (
                                <div
                                    key={borrador.idAprobador}
                                    className="flex justify-between items-center bg-white rounded-md px-3 py-4 shadow-lg mt-6"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {borrador.nombreProceso}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Versión {borrador.nombre_version} ·{" "}
                                            {borrador.fechaCreacion}{" "}
                                        </p>
                                        <p className="mt-1 inline-block px-3 py-1 rounded-full border border-red-600 text-xs font-bold bg-red-200 text-red-600">
                                            {borrador.estado}
                                        </p>
                                    </div>
                                    <button
                                        className="bg-[#F4F4F5] text-[#99CC33] hover:bg-[#99CC33] hover:text-white  border border-[#99CC33] text-sm px-3 py-2 flex justify-center items-center gap-1  rounded-md transition duration-200 ease-in-out transform "
                                        onClick={() =>
                                            handleClick(
                                                borrador.idBpmn,
                                                borrador.idVersionProceso
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

                <div className="bg-[#FAFAFB] p-5 rounded-lg shadow ">
                    <div className="mb-2 border-b bg-white rounded-md">
                        <h2 className="text-2xl font-semibold  flex gap-2 items-center">
                            <BsClipboard2Check
                                className="text-3xl"
                                fill="#008000"
                            />
                            Procesos Aprobados
                        </h2>
                        <span className="text-[#AAAAAA] text-sm">
                            Procesos que fueron aprobados.
                        </span>
                    </div>

                    <div className="space-y-3 min-h-[360px] max-h-[360px] overflow-auto">
                        {borradoresAprobados.length === 0 ? (
                            <h1 className="text-center text-gray-500">
                                No hay procesos aprobados
                            </h1>
                        ) : (
                            borradoresAprobados.map((borrador) => (
                                <div
                                    key={borrador.idAprobador}
                                    className="flex justify-between items-center bg-white rounded-md  px-3 py-4 shadow-lg mt-6"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {borrador.nombreProceso}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Versión {borrador.nombre_version} ·{" "}
                                            {borrador.fechaCreacion}{" "}
                                        </p>
                                        <p className="mt-1 inline-block px-3 py-1 rounded-full border border-green-600 text-xs font-bold bg-green-200 text-green-600">
                                            {borrador.estado}
                                        </p>
                                    </div>
                                    <button
                                        className="bg-[#F4F4F5] text-[#99CC33] hover:bg-[#99CC33] hover:text-white  border border-[#99CC33] text-sm px-3 py-2 flex justify-center items-center gap-1  rounded-md transition duration-200 ease-in-out transform "
                                        onClick={() =>
                                            handleClick(
                                                borrador.idBpmn,
                                                borrador.idVersionProceso
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
