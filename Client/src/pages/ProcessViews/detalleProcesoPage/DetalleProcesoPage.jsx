import { BpmnProvider } from "../../../BpmnModule/context/BpmnProvider"
import { VisualizadorProceso } from "./components/VisualizadorProceso";
import { HeaderDetalleProceso } from "./components/HeaderDetalleProceso";
import { ResumenProceso } from "./components/ResumenProceso";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ComentariosMejoras } from "./components/ComentariosMejoras";
import ModalMejorasComentarios from "./components/ModalMejorasComentarios";
import ModalVersiones from "./components/ModalVersiones";
import PulseLoader from "react-spinners/PulseLoader";

//agregar comentarios (todos) y oportunidades
export const DetalleProcesoPage = () => {
    const { idProceso, version } = useParams();

    const [resumenProceso, setResumenProceso] = useState({});
    const [ headerProceso, setHeaderProceso] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tabActiva, setTabActiva] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [openModalVersiones, setOpenModalVersiones] = useState(false);
    
        useEffect(() => {
            setIsLoading(false);
            const fetchData = async () => {
                try {
                    const response = await fetch(
                        `http://localhost:3000/api/v1/procesos/get-process/resumen-proceso/${idProceso}/${version}`
                    );
                    const data = await response.json();
                    setResumenProceso(data.data);
                    setHeaderProceso(data.dataHeader);
                    setTimeout(() => {
                        setIsLoading(true);
                        }, 500)
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }, [version]);
    return (
        <BpmnProvider>
            { !isLoading ? 
             <div className="flex justify-center items-center h-screen">
                <PulseLoader color="#10644C" size={15} />
            </div>
            
             : 
            <div className="flex justify-center h-screen mt-6">
                <div className="w-[70%] ">
                    <HeaderDetalleProceso headerProceso={headerProceso} idProceso={idProceso} setOpenModalVersiones={setOpenModalVersiones} version={version}/>
                    {(headerProceso.estadoVersion !== "borrador" && headerProceso.estadoVersion !== "enviado") &&
                        <ComentariosMejoras idProceso={idProceso} setOpenModal={setOpenModal} tabActiva={tabActiva} setTabActiva={setTabActiva}  />}
                    <ResumenProceso resumenProceso={resumenProceso} />
                    <VisualizadorProceso idProceso={idProceso} version={version} />
                </div>
                {openModal && <ModalMejorasComentarios setOpenModal={setOpenModal} menu={tabActiva} idProceso={idProceso} version={version} />}
                {openModalVersiones && <ModalVersiones setOpenModalVersiones={setOpenModalVersiones} idProceso={idProceso} />}
            </div>}
            
        </BpmnProvider>
    );
};
