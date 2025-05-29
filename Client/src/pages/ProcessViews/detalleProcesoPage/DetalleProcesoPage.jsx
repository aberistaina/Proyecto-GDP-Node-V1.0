import { BpmnProvider } from "../../../BpmnModule/context/BpmnProvider";
import { VisualizadorProceso } from "./components/VisualizadorProceso";
import { HeaderDetalleProceso } from "./components/HeaderDetalleProceso";
import { ResumenProceso } from "./components/ResumenProceso";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ComentariosMejoras } from "./components/ComentariosMejoras";
import ModalMejorasComentarios from "./components/ModalMejorasComentarios";
import ModalVersiones from "./components/ModalVersiones";
import PulseLoader from "react-spinners/PulseLoader";

//agregar comentarios (todos) y oportunidades
export const DetalleProcesoPage = () => {
    const user = useSelector((state) => state.auth.user);
    const { idProceso, version } = useParams();

    const [resumenProceso, setResumenProceso] = useState({});
    const [headerProceso, setHeaderProceso] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tabActiva, setTabActiva] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [openModalVersiones, setOpenModalVersiones] = useState(false);
    const [estaAprobado, setEstaAprobado ] = useState()
    const [mostrarModal, setMostrarModal] = useState(false);
    const [comentarios, setComentarios ] = useState([])
    const [ oportunidades, SetOportunidades ] = useState([])
    const [versiones, setVeriones ] = useState([])

const getAllComentaries = async() =>{
            try {
                const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(`${URL}/api/v1/procesos/comentarios/getAll/${idProceso}/${version}`)
                const data = await response.json()
                setComentarios(data.data)
            } catch (error) {
                console.log(error);
            }
        }

        const getAllOpportunities = async () => {
            try {
                const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(`${URL}/api/v1/procesos/oportunidades/getAll/${idProceso}/${version}`)
                const data = await response.json()
                console.log(data)
                SetOportunidades(data.data)
            } catch (error) {
                console.log(error)
            }
            
        }


    const getData = async () => {
        try {
            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;
            const response = await fetch(
                `${URL}/api/v1/procesos/get-process/resumen-proceso/${idProceso}/${version}`
            );
            const data = await response.json();
            setResumenProceso(data.data);
            setHeaderProceso(data.dataHeader);
            setTimeout(() => {
                setIsLoading(true);
            }, 500);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getPendingProcess = async() =>{
                try {
                    const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
                    const response = await fetch(`${URL}/api/v1/procesos/get-pending-process/${user.usuario.id_usuario}`)
                    const data = await response.json()
                    const estadoProcesoActual = data.data.find((proceso) =>(
                        proceso.idVersionProceso == version
                    ))
                    if (!estadoProcesoActual) {
                        setEstaAprobado(false);
                        return;
                    }
                    const estado = estadoProcesoActual.estadoAprobacion === "pendiente";
                    setEstaAprobado(estado);
                } catch (error) {
                    console.log(error);
                }
    }

    useEffect(() => {
        setIsLoading(false);
        const fetchData = async () => {
            await getData()
            await getPendingProcess()
        };
        fetchData();
    }, [version]);

    useEffect(() => {
        const getAllVersions = async() =>{
        try {
            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;

            const response = await fetch(`${URL}/api/v1/procesos/get-versiones/${idProceso}`);
            const data = await response.json();
            console.log(data);
            setVeriones(data.data)

        } catch (error) {
            console.log(error);
        }
    }
    getAllVersions()
    
    }, [])
    
    return (
        <BpmnProvider>
            {!isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <PulseLoader color="#10644C" size={15} />
                </div>
            ) : (
                <div className="flex justify-center h-screen mt-6">
                    <div className="w-[95%] ">
                        <HeaderDetalleProceso
                            headerProceso={headerProceso}
                            idProceso={idProceso}
                            setOpenModalVersiones={setOpenModalVersiones}
                            version={version}
                            getPendingProcess={getPendingProcess}
                            estaAprobado={estaAprobado}
                            versiones={versiones}
                            getData={getData}
                        />
                        {headerProceso.estadoVersion !== "borrador" &&
                            headerProceso.estadoVersion !== "enviado" && (
                                <ComentariosMejoras
                                    idProceso={idProceso}
                                    setOpenModal={setOpenModal}
                                    tabActiva={tabActiva}
                                    setTabActiva={setTabActiva}
                                    version={version}
                                    comentarios={comentarios}
                                    getAllComentaries={getAllComentaries}
                                    oportunidades={oportunidades}
                                    getAllOpportunities={getAllOpportunities}
                                    
                                />
                            )}
                        <ResumenProceso resumenProceso={resumenProceso}/>
                        <VisualizadorProceso
                            idProceso={idProceso}
                            version={version}
                        />
                        
                    </div>
                    {openModal && (
                        <ModalMejorasComentarios
                            setOpenModal={setOpenModal}
                            menu={tabActiva}
                            idProceso={idProceso}
                            version={version}
                            getAllComentaries={getAllComentaries}
                            getAllOpportunities={getAllOpportunities}
                        />
                    )}
                    {openModalVersiones && (
                        <ModalVersiones
                            setOpenModalVersiones={setOpenModalVersiones}
                            idProceso={idProceso}
                            versiones={versiones}
                        />
                    )}
                </div>
            )}
        </BpmnProvider>
    );
};
