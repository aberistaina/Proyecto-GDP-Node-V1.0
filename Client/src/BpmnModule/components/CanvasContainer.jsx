import { useEffect } from "react";
import { useBpmnContext } from "../context/useBpmnContext";
import { RiResetLeftFill } from "react-icons/ri";
import { LuImageDown } from "react-icons/lu";
import { guardarImagenFlujo } from "../utils/bpmnUtils";
import { useParams } from "react-router-dom";


//Componente que actúa como contenedor del modelo (Acá se renderiza el modelador o visualizador BPMN)
export const CanvasContainer = ({ height , border, modo }) => {
    const { containerRef, bpmnModelerRef } = useBpmnContext();
    const { idProceso } = useParams();

    useEffect(() => {
        if (!containerRef.current) {
            console.warn("Canvas aún no está montado.");
        }
    }, []);

    const zoomIn = () => {
        const canvas = bpmnModelerRef.current.get("canvas");
        const currentZoom = canvas.zoom();
        canvas.zoom(currentZoom + 0.1);
    };

    const zoomOut = () => {
        const canvas = bpmnModelerRef.current.get("canvas");
        const currentZoom = canvas.zoom();
        canvas.zoom(currentZoom - 0.1);
    };

    const resetZoom = () => {
        const canvas = bpmnModelerRef.current.get("canvas");
        canvas.zoom("fit-viewport");
    };

    return (
        <div
            ref={containerRef}
            className={`w-full ${height === "details" ? "h-[555px]" : height === "viewer" ? "h-screen" : "h-[800px]"} bg-white rounded-lg relative ${border ? "shadow-md border border-black" : "shadow-lg"}`}


        >
            <div className="absolute bottom-4 right-4 z-10 bg-white/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-lg p-2 flex flex-col gap-2">
                <button
                    className="w-9 h-9 flex items-center justify-center text-lg font-bold bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                    onClick={zoomIn}
                    title="Acercar"
                >
                    +
                </button>
                <button
                    className="w-9 h-9 flex items-center justify-center text-lg font-bold bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                    onClick={zoomOut}
                    title="Alejar"
                >
                    −
                </button>
                <button
                    className="w-9 h-9 flex items-center justify-center text-xs font-medium bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                    onClick={resetZoom}
                    title="Reiniciar Zoom"
                >
                    <RiResetLeftFill className="text-lg"/>
                </button>

                {modo === "visualizador" &&
                <button
                    className="w-9 h-9 flex items-center justify-center text-xs font-medium bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                    
                    title="Descargar Imágen"
                    onClick={() => guardarImagenFlujo(bpmnModelerRef.current, idProceso)}
                >
                    <LuImageDown className="text-lg"/>
                </button>
                
                }
            </div>
        </div>
        
    );
};
