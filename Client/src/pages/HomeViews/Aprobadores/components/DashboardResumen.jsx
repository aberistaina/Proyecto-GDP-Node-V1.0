import {
    MdOutlineInbox,
    MdAccessAlarms,
    MdOutlineCancel,
    MdOutlineCheckCircle
} from "react-icons/md";

export const DashboardResumen = ({ procesosPendientes }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
                className={`flex items-center justify-between px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md`}
            >
                <div className="flex items-center gap-2">
                    <MdAccessAlarms className="text-2xl" fill="#4C83FD" />
                    <p className="text-md">Aprobaciones Pendientes</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-[#AAAAAA]">
                        {procesosPendientes.length}
                    </p>
                </div>
            </div>

            <div
                className={`flex items-center justify-between px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md`}
            >
                <div className="flex items-center gap-2">
                    <MdOutlineCheckCircle className="text-2xl" fill="#4C83FD" />
                    <p className="text-md">Procesos aprobados</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-[#AAAAAA]">
                        {procesosPendientes.length}
                    </p>
                </div>
            </div>

            <div
                className={`flex items-center justify-between px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md`}
            >
                <div className="flex items-center gap-2">
                    <MdOutlineCancel className="text-2xl" fill="#4C83FD" />
                    <p className="text-md">Procesos Rechazados</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-[#AAAAAA]">
                        {procesosPendientes.length}
                    </p>
                </div>
            </div>
        </div>
    );
};
