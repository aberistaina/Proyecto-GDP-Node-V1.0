import { BpmnProvider } from "../context/BpmnProvider"
import { BpmnViewer } from "./components/BpmnViewer"
import { PopupDescripcion } from "./components/PopupDescripcion"
import { useState } from "react"




//Módulo que contiene todos los componentes del visualizador
export const BpmnViewerModule = ({height, border}) => {
    const [elementoSeleccionado, setElementoSeleccionado] = useState(null);
    
    return (
        <>
            <BpmnProvider>
            <div className="h-full w-full flex flex-col items-center justify-start ">
                <div className="w-[100%] h-full space-y-8 mt-10">   
                    <BpmnViewer height={height} border={border} setElementoSeleccionado={setElementoSeleccionado} />
                    <PopupDescripcion elementoSeleccionado={elementoSeleccionado} onClose={() => setElementoSeleccionado(null)} />
                </div>
            </div>
            </BpmnProvider>
        </>
    )
}