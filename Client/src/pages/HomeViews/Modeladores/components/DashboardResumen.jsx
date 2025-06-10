import { IoDocumentTextOutline } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import { BsClipboard2Check } from "react-icons/bs";

export const DashboardResumen = ({ borradoresActivos }) => {
    const borradores = borradoresActivos.filter((b) => b.estado === "borrador");
    const borradoresEnEspera = borradoresActivos.filter(
        (b) => b.estado === "enviado"
    );
    const borradoresRechazados = borradoresActivos.filter(
        (b) => b.estado === "rechazado"
    );
    const borradoresAprobados = borradoresActivos.filter((b) => b.estado === "aprobado");
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Borradores Activos*/}
            <div className="flex flex-col  px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md">
                <div className="flex items-center gap-4">
                    <div>
                        <IoDocumentTextOutline
                            className="text-5xl bg-[#FEF9C3] p-2 rounded-lg"
                            stroke="#d5c507"
                        />
                    </div>
                    <div>
                        <div>
                            <p className="text-3xl font-bold ">
                                {borradores.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-lg text-slate-600">
                                Borradores Activos
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-[#AAAAAA] text-xs pt-4">
                        Procesos en etapa de diseño o revisión.
                    </p>
                </div>
            </div>

            {/* Borradores Pendientes de Aprobación*/}
            <div className="flex flex-col  px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md">
                <div className="flex items-center gap-4">
                    <div>
                        <BsSend
                            className="text-5xl bg-[#D8E6FD] p-2 rounded-lg"
                            fill="#3B82F6"
                        />
                    </div>
                    <div>
                        <div>
                            <p className="text-3xl font-bold ">
                                {borradoresEnEspera.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-lg text-slate-600">
                                Borradores Pendientes
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-[#AAAAAA] text-xs pt-4">
                        Procesos enviados y esperando validación.
                    </p>
                </div>
            </div>

            {/* Borradores Rechazados*/}

            <div className="flex flex-col  px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md">
                <div className="flex items-center gap-4">
                    <div>
                        <BiErrorCircle
                            className="text-5xl bg-red-200 p-2 rounded-lg"
                            stroke="#A855F7"
                            fill="#f91818"
                        />
                    </div>
                    <div>
                        <div>
                            <p className="text-3xl font-bold ">
                                {borradoresRechazados.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-lg text-slate-600">
                                Procesos Rechazados
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-[#AAAAAA] text-xs pt-4">
                        Procesos Rechazados y esperando nuevas mejoras.
                    </p>
                </div>
            </div>

            {/* Borradores Aprobados*/}

            <div className="flex flex-col  px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md">
                <div className="flex items-center gap-4">
                    <div>
                        <BsClipboard2Check
                            className="text-5xl bg-[#BBF7D0] p-2 rounded-lg"
                            stroke="#008000"
                            fill="#008000"
                        />
                    </div>
                    <div>
                        <div>
                            <p className="text-3xl font-bold ">
                                {borradoresAprobados.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-lg text-slate-600">
                                Procesos Aprobados
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-[#AAAAAA] text-xs pt-4">
                        Procesos Aprobados .
                    </p>
                </div>
            </div>
            

        </div>

        
    );
};
