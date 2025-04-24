import { useEffect } from "react";
import { BpmnViewer } from "../../../../BpmnModule/BpmnViewer/components/BpmnViewer";
import { FaDiagramProject } from "react-icons/fa6";
import { useBpmnContext } from "../../../../BpmnModule/context/useBpmnContext";
import { useParams } from "react-router-dom";


export const VisualizadorProceso = () => {
    const { setEmptyDiagram } = useBpmnContext();
    const { idProceso } = useParams();

    useEffect(() => {
        const getData = async () => {
            try {
                const url = `http://localhost:3000/api/v1/procesos/get-process/${idProceso}`
                const response = await fetch(url)
                const data = await response.text()
                setEmptyDiagram(data)
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
        getData()
    
    }, [idProceso])
    
    return (
        <>
            <div 
            className="bg-[#ececec] rounded-lg pb-8 pt-5 ps-8 pe-8 shadow-[6px_6px_4px_#c0c0c0] h-[50%]
            ">
                <div className="flex space-x-3 items-center mb-4 ">
                    <FaDiagramProject fill="#666666" className="text-xl" />
                    <h1 className="text-xl">Flujo del proceso</h1>
                </div>
                    <div className="h-[85%]">
                    <BpmnViewer height={"h-full"} />
                    </div>
            </div>
        </>
    );
};
