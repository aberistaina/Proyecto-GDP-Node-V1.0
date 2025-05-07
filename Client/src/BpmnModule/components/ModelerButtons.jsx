import { useBpmnContext } from "../context/useBpmnContext";
import {exportDiagramXml, generateBpmnFile, importDiagram} from "../utils/bpmnUtils";
import { FaFileImport } from "react-icons/fa6";
import { CgExport } from "react-icons/cg";
import { VscTerminal } from "react-icons/vsc";
import { FaRegSave } from "react-icons/fa";


export const ModelerButtons = ({ modo, setShowModalSaveChanges }) => {
    const { bpmnModelerRef } = useBpmnContext();

    const handleExportBpmn = async () => {
        const xmlContent = await exportDiagramXml(bpmnModelerRef);
        if (xmlContent) {
            generateBpmnFile(xmlContent);
        }
    };


    return (
        <>
            <div className="flex justify-center mt-4 space-x-4 mb-12">
                {/* Botón de Transformar XML */}
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                    onClick={() => exportDiagramXml(bpmnModelerRef)}
                >
                    <VscTerminal className="me-2 text-xl" />
                    Generar XML Consola
                </button>
                {/* Botón de exportación */}
                <button
                    className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                    onClick={() => handleExportBpmn()}
                >
                    <CgExport className="me-2 text-xl" />
                    Exportar como BPMN
                </button>

                {/* Botón de importación */}
                <label className="bg-amber-400 hover:bg-amber-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer flex items-center">
                    <FaFileImport className="me-2" />
                    Importar BPMN
                    <input
                        type="file"
                        accept=".bpmn,.xml"
                        className="hidden"
                        onChange={(e) => importDiagram(e, bpmnModelerRef)}
                    />
                </label>
                {/* Botón de Guardar */}
                {modo === "designer" && (
                    <button
                        className="bg-green-600 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                        onClick={() => setShowModalSaveChanges(true)}
                    ><FaRegSave className="me-2" />
                        Guardar Cambios
                    </button>
                )}
            </div>
        </>
    );
};
