import { BpmnProvider } from "../../../BpmnModule/context/BpmnProvider"
import { VisualizadorProceso } from "./components/VisualizadorProceso";
import { HeaderDetalleProceso } from "./components/HeaderDetalleProceso";
import { ResumenProceso } from "./components/ResumenProceso";

//agregar comentarios (todos) y oportunidades
export const DetalleProcesoPage = () => {
    return (
        <BpmnProvider>
            <div className="flex justify-center h-screen mt-6">
                <div className="w-[70%] ">
                    <HeaderDetalleProceso />
                    <ResumenProceso />
                    <VisualizadorProceso />
                </div>
            </div>
        </BpmnProvider>
    );
};
