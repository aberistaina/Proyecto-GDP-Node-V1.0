import { useBpmnContext } from "../context/useBpmnContext";
import {exportDiagramXml, generateBpmnFile, importDiagram} from "../utils/bpmnUtils";
import { FaFileImport } from "react-icons/fa6";
import { CgExport } from "react-icons/cg";
import { VscTerminal } from "react-icons/vsc";
import { FaRegSave } from "react-icons/fa";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";

export const ModelerButtons = ({ modo }) => {
    const { bpmnModelerRef, setRefreshProcess } = useBpmnContext();
    const { enqueueSnackbar } = useSnackbar();
    const { idProcesoPadre, callActivity } = useParams();

    const handleExportBpmn = async () => {
        const xmlContent = await exportDiagramXml(bpmnModelerRef);
        if (xmlContent) {
            generateBpmnFile(xmlContent);
        }
    };

    const guardarCambios = async() =>{
        try {
            const URL = import.meta.env.VITE_APP_MODE === "desarrollo" ? import.meta.env.VITE_URL_DESARROLLO : import.meta.env.VITE_URL_PRODUCCION;

            const xmlContent = await exportDiagramXml(bpmnModelerRef);
            const processIdRegex = /<bpmn:process\s+id="([^"]+)"[^>]*>/;
            const processIdMatch = xmlContent.match(processIdRegex);
            const idProceso = processIdMatch
            const blob = new Blob([xmlContent], { type: "application/xml" });
            const formData = new FormData();
            formData.append("archivo", blob, `${idProceso}.bpmn`);

            let data = null
            if(idProcesoPadre && callActivity){
                formData.append("idProcesoPadre", idProcesoPadre)
                formData.append("callActivity", callActivity)

                const requestOptions = {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
                data = await fetch(`${URL}/api/v1/procesos/save-subprocess-changes`, requestOptions)
            }else{
                const requestOptions = {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
                data = await fetch(`${URL}/api/v1/procesos/save-process-changes`, requestOptions)
            }
            
           if(data.code == 201){
                setRefreshProcess(true)
                enqueueSnackbar(data.message, { variant: "success" });
            }else{
                enqueueSnackbar(data.message, { variant: "error" });
            }
            } catch (error) {
                console.log(error)
            }
    }

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
                        onClick={guardarCambios}
                    ><FaRegSave className="me-2" />
                        Guardar Cambios
                    </button>
                )}
            </div>
        </>
    );
};
