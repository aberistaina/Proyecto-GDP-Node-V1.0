import { CanvasContainer } from "../../components/CanvasContainer";
import { ViewetInitializer } from "./ViewerInitializer"; 

//Visualizador BPMN
export const BpmnViewer = ({ setElementoSeleccionado, border }) => {
    return (
        <div className="flex flex-col items-center w-full">
            <CanvasContainer border={border} modo={"visualizador"} />
            <ViewetInitializer setElementoSeleccionado={setElementoSeleccionado} />
        </div>
    );
};

