import { MdOutlineInbox, MdAccessAlarms, MdOutlineCancel } from "react-icons/md";

export const DashboardResumen = ({ borradoresActivos }) => {

    const borradores = borradoresActivos.filter((b) => b.estado === "borrador");
    const borradoresEnEspera = borradoresActivos.filter((b) => b.estado === "enviado");
    const borradoresRechazados = borradoresActivos.filter((b) => b.estado === "rechazado");
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
                className={`flex items-center justify-between px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md`}
            >
                <div className="flex items-center gap-2">
                    <MdOutlineInbox className="text-2xl" fill="#4C83FD"/>
                    <p className="text-md">Borradores Activos</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-[#AAAAAA]">{borradores.length}</p>
                </div>
            </div>

            <div
                className={`flex items-center justify-between px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md`}
            >
                <div className="flex items-center gap-2">
                    <MdAccessAlarms className="text-2xl" fill="#4C83FD"/>
                    <p className="text-md">Borradores En Espera</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-[#AAAAAA]">{borradoresEnEspera.length}</p>
                </div>
            </div>

            <div
                className={`flex items-center justify-between px-10 rounded-lg py-4 text-black bg-slate-50 shadow-md`}
            >   <div className="flex items-center gap-2">
                    <MdOutlineCancel className="text-2xl" fill="#4C83FD"/>
                    <p className="text-md">Borradores Rechazados</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-[#AAAAAA]">{borradoresRechazados.length}</p>
                </div>
            </div>
        </div>
    );
};
