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
import { ModalArchivos } from "./components/ModalArchivos";
//agregar comentarios (todos) y oportunidades
export const DetalleProcesoPage = () => {
    const user = useSelector((state) => state.auth.user);
    const { idProceso, version } = useParams();

    const [resumenProceso, setResumenProceso] = useState({});
    const [headerProceso, setHeaderProceso] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tabActiva, setTabActiva] = useState("oportunidades");
    const [openModal, setOpenModal] = useState(false);
    const [openModalVersiones, setOpenModalVersiones] = useState(false);
    const [estaAprobado, setEstaAprobado ] = useState()
    const [comentarios, setComentarios ] = useState([])
    const [ oportunidades, SetOportunidades ] = useState([])
    const [versiones, setVeriones ] = useState([])
    const [comentarioBitacora, setComentarioBitacora] = useState("");
    const [ openModalArchivos, setOpenModalArchivos ] = useState(false)
    const [ idComentario, setIdComentario ] = useState("")

const getAllComentaries = async() =>{
            try {
                const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(`${URL}/api/v1/comentarios/getAll/${idProceso}/${version}`, {credentials: "include"})
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
                const response = await fetch(`${URL}/api/v1/oportunidades/getAll/${idProceso}/${version}`, {credentials: "include"})
                const data = await response.json()
                SetOportunidades(data.data)
            } catch (error) {
                console.log(error)
            }
            
        }

        const getComentariosBitacora = async () => {
            try {
                const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(`${URL}/api/v1/bitacora/get-bitacora-aprobaciones/${version}`, {credentials: "include"})
                const data = await response.json()
                setComentarioBitacora(data.data)
                console.log(data);
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
                `${URL}/api/v1/procesos/get-process/resumen-proceso/${idProceso}/${version}`, {credentials: "include"}
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
                    const response = await fetch(`${URL}/api/v1/procesos/get-pending-process/${user.usuario.id_usuario}`, {credentials: "include"})
                    const data = await response.json()
                    const estadoProcesoActual = data.data.find((proceso) =>(
                        proceso.idVersionProceso == version
                    ))
                    if (!estadoProcesoActual) {
                        setEstaAprobado(false);
                        return;
                    }
                    const estado = estadoProcesoActual.estado === "pendiente";
                    setEstaAprobado(estado);
                } catch (error) {
                    console.log(error);
                }
    }

    useEffect(() => {
        setIsLoading(false);
        const fetchData = async () => {
            await getData()
            if(user?.usuario?.id_rol === 2){
                await getPendingProcess() 
            }
            
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

            const response = await fetch(`${URL}/api/v1/procesos/get-versiones/${idProceso}`, {credentials: "include"});
            const data = await response.json();
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
                <div className="flex justify-center h-screen my-6">
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
                        <ResumenProceso resumenProceso={resumenProceso}/>
                        <VisualizadorProceso
                            idProceso={idProceso}
                            version={version}
                        />
                        
                        <div className="pb-10">
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
                                    getComentariosBitacora={getComentariosBitacora}
                                    comentarioBitacora={comentarioBitacora}
                                    setOpenModalArchivos={setOpenModalArchivos}
                                    setIdComentario={setIdComentario}
                                    
                                />
                            )}
                        </div>

                    </div>
                    {openModal && (
                        <ModalMejorasComentarios
                            setOpenModal={setOpenModal}
                            menu={tabActiva}
                            idProceso={idProceso}
                            version={version}
                            getAllComentaries={getAllComentaries}
                            getAllOpportunities={getAllOpportunities}
                            getComentariosBitacora={getComentariosBitacora}
                        />
                    )}
                    {openModalVersiones && (
                        <ModalVersiones
                            setOpenModalVersiones={setOpenModalVersiones}
                            idProceso={idProceso}
                            versiones={versiones}
                            
                        />
                    )}

                    {openModalArchivos && (
                        <ModalArchivos setOpenModalArchivos={setOpenModalArchivos} version= {version} idComentario={idComentario} tabActiva={tabActiva}/>
                    )}
                </div>
            )}
        </BpmnProvider>
    );
};
