import { BpmnProvider } from "../../../BpmnModule/context/BpmnProvider"
import { VisualizadorProceso } from "./components/VisualizadorProceso";
import { HeaderDetalleProceso } from "./components/HeaderDetalleProceso";
import { ResumenProceso } from "./components/ResumenProceso";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ComentariosMejoras } from "./components/ComentariosMejoras";
import ModalMejorasComentarios from "./components/ModalMejorasComentarios";

//agregar comentarios (todos) y oportunidades
export const DetalleProcesoPage = () => {
    const { idProceso } = useParams();

    const [resumenProceso, setResumenProceso] = useState([]);
    const [ headerProceso, setHeaderProceso] = useState([]);
    const [tabActiva, setTabActiva] = useState("");
    const [openModal, setOpenModal] = useState(false);
    
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch(
                        `http://localhost:3000/api/v1/procesos/get-process/resumen-proceso/${idProceso}`
                    );
                    const data = await response.json();
                    setResumenProceso(data.data);
                    setHeaderProceso(data.dataHeader);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }, [idProceso]);
    return (
        <BpmnProvider>
            <div className="flex justify-center h-screen mt-6">
                <div className="w-[70%] ">
                    <HeaderDetalleProceso headerProceso={headerProceso} />
                    <ComentariosMejoras idProceso={idProceso} setOpenModal={setOpenModal} tabActiva={tabActiva} setTabActiva={setTabActiva}  />
                    <ResumenProceso resumenProceso={resumenProceso} />
                    <VisualizadorProceso idProceso={idProceso}  />
                </div>
            </div>
            {openModal && <ModalMejorasComentarios setOpenModal={setOpenModal} menu={tabActiva} idProceso={idProceso} />}
        </BpmnProvider>
    );
};
