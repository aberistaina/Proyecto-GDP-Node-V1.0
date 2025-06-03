import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import { GrOverview } from "react-icons/gr";

export const BorradoresActivos = ({ borradoresActivos, isLoading }) => {
    
    const navigate = useNavigate()

    const handleClick = (idProceso, version) =>{
        try {
                navigate(`/process-details/${idProceso}/${version}`)
    
            
        } catch (error) {
            console.log(error);
        }
    }

    if (!isLoading) return <PulseLoader color="#10644C" size={15} />
    const borradores = borradoresActivos.filter((b) => b.estado === "borrador");
    const borradoresEnEspera = borradoresActivos.filter((b) => b.estado === "enviado");

    return (
        <>
            
                <div className="bg-white p-5 rounded-lg shadow">
                <h2 className="text-lg font-bold mb-2">
                    Borradores Activos
                </h2>

            <ul className="space-y-3">
                {borradores.length === 0 ? ( <h1 className="text-center text-gray-500">No hay borradores activos</h1>) : borradores.map((borrador) => (
                    
                    <li
                        key={borrador.idAprobador}
                        className="flex justify-between items-center border-b pb-2"
                    >
                        <div>
                            <p className="font-semibold text-gray-800">
                                {borrador.nombreProceso}
                            </p>
                            <p className="text-xs text-gray-500">
                                Versión {borrador.nombre_version} · {borrador.fechaCreacion} ·{" "}
                                <span className="ml-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {borrador.estado}
                                </span>
                            </p>
                        </div>
                        <button className="bg-[#6f42c1] hover:bg-[#8556d4] text-white text-sm px-3 py-1 flex justify-center items-center gap-1  rounded-md transition duration-200 ease-in-out transform hover:scale-105"
                        onClick={() => handleClick(borrador.idBpmn, borrador.idVersionProceso )}>
                            <GrOverview /> Ver Borrador
                        </button>
                    </li>
                ))}
            </ul>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
                <h2 className="text-lg font-bold mb-2">
                    Borradores pendientes de aprobación
                </h2>

            <ul className="space-y-3">
                {borradoresEnEspera.length === 0 ? ( <h1 className="text-center text-gray-500">No hay borradores Pendientes de Aprobación</h1>) : borradoresEnEspera.map((borrador) => (
                    <li
                        key={borrador.idAprobador}
                        className="flex justify-between items-center border-b pb-2"
                    >
                        <div>
                            <p className="font-semibold text-gray-800">
                                {borrador.nombreProceso}
                            </p>
                            <p className="text-xs text-gray-500">
                                Versión {borrador.nombre_version} · {borrador.fechaCreacion} ·{" "}
                                <span className="ml-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {borrador.estado}
                                </span>
                            </p>
                        </div>
                        <button className="bg-[#6f42c1] hover:bg-[#8556d4] text-white text-sm px-3 py-1 flex justify-center items-center gap-1  rounded-md transition duration-200 ease-in-out transform hover:scale-105"
                        onClick={() => handleClick(borrador.idBpmn, borrador.idVersionProceso )}>
                            <GrOverview />Ver Borrador
                        </button>
                    </li>
                ))}
            </ul>
        </div>

        </> 
    );
};
