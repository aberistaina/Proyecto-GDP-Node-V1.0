import { useEffect, useRef } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";

export const Bpmn = () => {
    const containerRef = useRef(null);
    const bpmnModelerRef = useRef(null);

    // Exportar el diagrama como XML
    const exportDiagramAsXML = async () => {
        try {
            if (bpmnModelerRef.current) {
                const { xml } = await bpmnModelerRef.current.saveXML({
                    format: true,
                });
                console.log("Diagrama exportado como XML:", xml);
                return xml;
            }
        } catch (err) {
            console.error("Error al exportar el diagrama:", err);
            return null;
        }
    };

    // Generar archivo BPMN a partir del contenido XML
    const generateBpmnFile = (xmlContent) => {
        const blob = new Blob([xmlContent], { type: "application/xml" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "diagrama.bpmn";
        link.click();
    };

    // Función de exportación al hacer clic en el botón
    const handleExport = async () => {
        const xmlContent = await exportDiagramAsXML();
        if (xmlContent) {
            generateBpmnFile(xmlContent);
        }
    };


    // useEffect para inicializar el modelador
    useEffect(() => {
        const container = containerRef.current;

        // Inicializa el modelador
        bpmnModelerRef.current = new BpmnModeler({
            container,
        });

        // Crear un diagrama vacío
        const createDiagram = async () => {
            try {
                await bpmnModelerRef.current.createDiagram();
                console.log("Diagrama vacío creado correctamente");
            } catch (err) {
                console.error("Error al crear el diagrama:", err);
            }
        };

        createDiagram();

        // Limpieza al desmontar el componente
        return () => {
            if (bpmnModelerRef.current) {
                bpmnModelerRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-center w-full">
            <div
                className="w-full h-[80vh] border rounded-lg shadow-md bg-white"
                ref={containerRef}
            ></div>
            <div className="flex justify-center mt-4 space-x-4">
                <button
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={handleExport}
                >
                    Exportar como XML
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Volver al Proceso Principal
                </button>
            </div>
        </div>
    );
};
