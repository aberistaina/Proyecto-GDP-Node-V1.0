import { BpmnProvider } from "../context/BpmnProvider"
import { BpmnViewer } from "./components/BpmnViewer"
import { PopupDescripcion } from "./components/PopupDescripcion"
import { useState } from "react"




//Módulo que contiene todos los componentes del visualizador
export const BpmnViewerModule = ({ border, height }) => {
    const [elementoSeleccionado, setElementoSeleccionado] = useState(null);

    return (
        <BpmnProvider>
            <div className="w-full flex flex-col items-center justify-start space-y-8">
                <BpmnViewer border={border} setElementoSeleccionado={setElementoSeleccionado} height={height} />
                <PopupDescripcion
                    elementoSeleccionado={elementoSeleccionado}
                    onClose={() => setElementoSeleccionado(null)}
                />
            </div>
        </BpmnProvider>
    );
};
