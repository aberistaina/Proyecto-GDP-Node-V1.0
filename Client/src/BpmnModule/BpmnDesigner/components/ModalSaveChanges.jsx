import { useState } from "react";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import {exportDiagramXml} from "../../utils/bpmnUtils";
import { useBpmnContext } from "../../context/useBpmnContext";
import { fetchHook } from "../../../hooks/fetchHook"
import { useSelector } from "react-redux";

export const ModalSaveChanges = ({ setShowModalSaveChanges }) => {
    const user = useSelector((state) => state.auth.user);
    const { bpmnModelerRef, setRefreshProcess } = useBpmnContext();
    const [estado, setEstado] = useState("borrador");
    const [aprobadores, setAprobadores] = useState("");
    const [esMacroproceso, setEsMacroproceso] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { idProcesoPadre, callActivity } = useParams();

    const guardarCambios = async() =>{
            try {
                const URL = import.meta.env.VITE_APP_MODE === "desarrollo" ? import.meta.env.VITE_URL_DESARROLLO : import.meta.env.VITE_URL_PRODUCCION;
    
                const xmlContent = await exportDiagramXml(bpmnModelerRef);
                const blob = new Blob([xmlContent], { type: "application/xml" });
                const loggedUser = user.data?.id_usuario
                const formData = new FormData();
                formData.append("archivo", blob, `process.bpmn`);
                formData.append("estado", estado);
                formData.append("aprobadores", aprobadores);
                formData.append("esMacroproceso", esMacroproceso);
                formData.append("id_creador", loggedUser);
    
                let data = null
                if(idProcesoPadre && callActivity){
                    formData.append("idProcesoPadre", idProcesoPadre)
                    formData.append("callActivity", callActivity)
                    data = await fetchHook(`${URL}/api/v1/procesos/save-subprocess-changes`, "POST", formData, null)
                }else{
                    data = await fetchHook(`${URL}/api/v1/procesos/save-process-changes`, "POST", formData, null)
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-center">
                    Confirmar Guardado
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Estado del Proceso
                    </label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    >
                        <option value="borrador">Borrador</option>
                        <option value="final">Versión Final</option>
                        <option value="en_aprobacion">En Aprobación</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Aprobadores
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        placeholder="Ej: Juan Pérez, María Soto"
                        value={aprobadores}
                        onChange={(e) => setAprobadores(e.target.value)}
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <input
                        id="macroproceso"
                        type="checkbox"
                        checked={esMacroproceso}
                        onChange={(e) => setEsMacroproceso(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="macroproceso" className="text-sm">
                        ¿Es macroproceso?
                    </label>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                        onClick={() => setShowModalSaveChanges(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={guardarCambios}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Confirmar y Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};
