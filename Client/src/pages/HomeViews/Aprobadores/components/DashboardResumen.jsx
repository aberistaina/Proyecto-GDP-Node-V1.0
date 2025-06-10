import { IoDocumentTextOutline } from "react-icons/io5";
import { BsClipboard2Check } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";

export const DashboardResumen = ({ procesos }) => {

    const procesosPendientes = procesos.filter((p) => p.estado === "pendiente")
    const procesosAprobados = procesos.filter((p) => p.estado === "rechazado")
    const procesosRechazados = procesos.filter((p) => p.estado === "aprobado")

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Aprobaciones Pendientes*/}
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
                                        {procesosPendientes.length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg text-slate-600">
                                        Aprobaciones Pendientes
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
        
                    {/* Procesos Aprobados*/}
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
                                        {procesosAprobados.length}
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
                                Procesos Aprobados.
                            </p>
                        </div>
                    </div>
        
                    {/*Procesos Rechazados*/}
        
                    <div className="flex flex-col  px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md">
                        <div className="flex items-center gap-4">
                            <div>
                                <BiErrorCircle
                                    className="text-5xl bg-red-200 p-2 rounded-lg"
                                    stroke="#f91818"
                                    fill="#f91818"
                                />
                            </div>
                            <div>
                                <div>
                                    <p className="text-3xl font-bold ">
                                        {procesosRechazados.length}
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
                    
                       
                </div>
    );
};
