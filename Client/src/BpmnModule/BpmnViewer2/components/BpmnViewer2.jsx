import { CanvasContainer } from "../../components/CanvasContainer";
import { ViewetInitializer2 } from "./ViewerInitializer2"; 

export const BpmnViewer2 = ({height, setElementoSeleccionado, border}) => {
    return (
        <div className="flex flex-col items-center w-full h-full">
            <CanvasContainer height = {height} border={border}/>
            <ViewetInitializer2 setElementoSeleccionado={setElementoSeleccionado} />
        </div>
    );
};
