import { HiOutlineArchiveBox } from "react-icons/hi2";
import { FiSettings, FiBriefcase } from "react-icons/fi";

export const DashboardResumen = ({ procesos }) => {
    const procesosEstrategicos = procesos.filter((p) => p.id_nivel === 1);
    const procesosOperativos = procesos.filter((p) => p.id_nivel === 2);
    const procesosSoporte = procesos.filter((p) => p.id_nivel === 3);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Aprobaciones Pendientes*/}
            <div className="flex flex-col  px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md">
                <div className="flex items-center gap-4">
                    <div>
                        <FiBriefcase
                            className="text-5xl bg-[#FEF9C3] p-2 rounded-lg"
                            stroke="#d5c507"
                        />
                    </div>
                    <div>
                        <div>
                            <p className="text-3xl font-bold ">
                                {procesosEstrategicos.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-lg text-slate-600">
                                Procesos Estratégicos
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-[#AAAAAA] text-xs pt-4">
                        Procesos clave que guían el rumbo institucional y permiten cumplir los objetivos a largo plazo.
                    </p>
                </div>
            </div>

            {/* Procesos Aprobados*/}
            <div className="flex flex-col  px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md">
                <div className="flex items-center gap-4">
                    <div>
                        <HiOutlineArchiveBox
                            className="text-5xl bg-[#BBF7D0] p-2 rounded-lg"
                            stroke="#008000"
                        />
                    </div>
                    <div>
                        <div>
                            <p className="text-3xl font-bold ">
                                {procesosOperativos.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-lg text-slate-600">
                                Procesos Operativos
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-[#AAAAAA] text-xs pt-4">
                        Procesos enfocados en la ejecución diaria de las actividades principales del servicio.
                    </p>
                </div>
            </div>

            {/*Procesos Rechazados*/}

            <div className="flex flex-col  px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md">
                <div className="flex items-center gap-4">
                    <div>
                        <FiSettings
                            className="text-5xl bg-blue-200 p-2 rounded-lg"
                            stroke="#2563eb"

                        />
                    </div>
                    <div>
                        <div>
                            <p className="text-3xl font-bold ">
                                {procesosSoporte.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-lg text-slate-600">
                                Procesos de Soporte
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-[#AAAAAA] text-xs pt-4">
                        Procesos que brindan apoyo transversal a la organización, como gestión de personas o tecnología.
                    </p>
                </div>
            </div>
        </div>
    );
};
