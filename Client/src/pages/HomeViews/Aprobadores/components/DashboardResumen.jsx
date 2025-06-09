import { IoDocumentTextOutline } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import { LuBriefcase } from "react-icons/lu";

export const DashboardResumen = ({ procesosPendientes }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Borradores Activos*/}
                    <div className="flex flex-col  px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md">
                        <div className="flex items-center gap-4">
                            <div>
                                <IoDocumentTextOutline
                                    className="text-5xl bg-[#EBF5D6] p-2 rounded-lg"
                                    stroke="#99CC33"
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
                                        {procesosPendientes.length}
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
                                Procesos enviados y esperando validación.
                            </p>
                        </div>
                    </div>
        
                    {/* Borradores Pendientes de Aprobación*/}
        
                    <div className="flex flex-col  px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md">
                        <div className="flex items-center gap-4">
                            <div>
                                <LuBriefcase
                                    className="text-5xl bg-[#EEDDFD] p-2 rounded-lg"
                                    stroke="#A855F7"
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
