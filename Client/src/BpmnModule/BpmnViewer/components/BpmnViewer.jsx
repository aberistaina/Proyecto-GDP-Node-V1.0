import { CanvasContainer } from "../../components/CanvasContainer";
import { ViewetInitializer } from "./ViewerInitializer"; 

//Visualizador BPMN
export const BpmnViewer = ({height, setElementoSeleccionado, border}) => {
    return (
        <div className="flex flex-col items-center w-full h-full">
            <CanvasContainer height = {height} border={border} modo={"visualizador"}/>
            <ViewetInitializer setElementoSeleccionado={setElementoSeleccionado} />
        </div>
    );
};
