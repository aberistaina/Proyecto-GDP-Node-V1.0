import { CanvasContainer } from "../../components/CanvasContainer";
import { ModelerInitializer } from "./ModelerInitializer";

//Modelador
export const BpmnModeler = () => {
    return (
        <div className="flex z-40 flex-col items-center w-full">
            <CanvasContainer />
            <ModelerInitializer />
        </div>
    );
};
