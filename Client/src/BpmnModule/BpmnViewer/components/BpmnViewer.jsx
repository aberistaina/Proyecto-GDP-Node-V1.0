import { CanvasContainer } from "../../components/CanvasContainer";
import { ViewetInitializer } from "./ViewerInitializer"; 

//Visualizador BPMN
export const BpmnViewer = ({ setElementoSeleccionado, border, height }) => {
    return (
        <div className="flex flex-col items-center w-full">
            <CanvasContainer border={border} modo={"visualizador"}  height={height}/>
            <ViewetInitializer setElementoSeleccionado={setElementoSeleccionado} />
        </div>
    );
};

