import { BpmnProvider } from "../context/BpmnProvider"
import { BpmnViewer2 } from "./components/BpmnViewer2"
import { LateralPanel } from "./components/LateralPanel"
import { useState } from "react"




export const BpmnViewerModule2 = ({height, border}) => {
    const [elementoSeleccionado, setElementoSeleccionado] = useState(null);
    return (
        <>
            <BpmnProvider>
            <div className="h-full w-full flex flex-col items-center justify-start ">
                <div className="w-[100%] h-full space-y-8 mt-10">   
                    <BpmnViewer2 height={height} border={border} setElementoSeleccionado={setElementoSeleccionado} />
                    <LateralPanel elementoSeleccionado={elementoSeleccionado} onClose={() => setElementoSeleccionado(null)} />
                </div>
            </div>
            </BpmnProvider>
        </>
    )
}