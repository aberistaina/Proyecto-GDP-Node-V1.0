import { CanvasContainer } from "../../components/CanvasContainer";
import { ViewetInitializer } from "./ViewerInitializer"; 

export const BpmnViewer = ({height}) => {
    return (
        <div className="flex flex-col items-center w-full h-full">
            <CanvasContainer height={height} />
            <ViewetInitializer />
        </div>
    );
};
