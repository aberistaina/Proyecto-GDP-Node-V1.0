import PulseLoader from "react-spinners/PulseLoader";


export const ListaProcesosPendientes = ({ procesosPendientes, isLoading }) => {
    

    if (!isLoading) return <PulseLoader color="#10644C" size={15} />
    if (procesosPendientes.length === 0) return <p>No Hay Procsos Pendientes Para Aprobar</p>;
    return (
        <>
            
                <div className="bg-white p-5 rounded-lg shadow">
                <h2 className="text-lg font-bold mb-2">
                    Procesos pendientes de aprobación
                </h2>

            <ul className="space-y-3">
                {procesosPendientes.map((proceso) => (
                    <li
                        key={proceso.idAprobador}
                        className="flex justify-between items-center border-b pb-2"
                    >
                        <div>
                            <p className="font-semibold text-gray-800">
                                {proceso.nombreProceso}
                            </p>
                            <p className="text-xs text-gray-500">
                                Versión {proceso.nombreVersion} · {proceso.fechaCreacionAprobacion} ·{" "}
                                <span className="ml-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {proceso.estadoAprobacion}
                                </span>
                            </p>
                        </div>
                        <button className="bg-[#6f42c1] hover:bg-[#8556d4] text-white text-sm px-3 py-1 rounded-full transition-all">
                            Revisar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
             
        </> 
    );
};
