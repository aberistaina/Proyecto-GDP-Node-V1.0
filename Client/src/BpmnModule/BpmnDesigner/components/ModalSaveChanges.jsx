import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import {exportDiagramXml} from "../../utils/bpmnUtils";
import { useBpmnContext } from "../../context/useBpmnContext";
import { useSelector } from "react-redux";
import { fetchHook } from "../../../hooks/fetchHook";
import { useNavigate } from "react-router-dom";

export const ModalSaveChanges = ({ setShowModalSaveChanges }) => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user);
    const { bpmnModelerRef, setRefreshProcess } = useBpmnContext();
    const { enqueueSnackbar } = useSnackbar();
    const { idProcesoPadre, callActivity, idProceso, version } = useParams();


    const guardarCambios = async() =>{
            try {
                const URL = import.meta.env.VITE_APP_MODE === "desarrollo" ? import.meta.env.VITE_URL_DESARROLLO : import.meta.env.VITE_URL_PRODUCCION;
    
                const xmlContent = await exportDiagramXml(bpmnModelerRef);
                const blob = new Blob([xmlContent], { type: "application/xml" });
                const loggedUser = user.usuario?.id_usuario

                const datosProceso =  JSON.parse(sessionStorage.getItem("datos"));

                const formData = new FormData();
                formData.append("archivo", blob, `process.bpmn`);
                formData.append("id_creador", loggedUser);
    
                let data = null
                if(idProcesoPadre && callActivity){
                    formData.append("idProcesoPadre", idProcesoPadre)
                    formData.append("callActivity", callActivity)
                    data = await fetchHook(`${URL}/api/v1/procesos/save-subprocess-changes`, "POST", formData, null)
                }else if(idProceso && version){
                    formData.append("idProceso", idProceso)
                    formData.append("version", version)
                    data = await fetchHook(`${URL}/api/v1/procesos/save-new-version-changes`, "POST", formData, null)
                    navigate(`/process-details/${idProceso}/${version}`)
                }else{
                    formData.append("nombre", datosProceso.nombre)
                    formData.append("descripcion", datosProceso.descripcion)
                    formData.append("aprobadores", datosProceso.aprobadores);
                    formData.append("nivel", datosProceso.nivel)
                    formData.append("esMacroproceso", datosProceso.macroproceso);
                    data = await fetchHook(`${URL}/api/v1/procesos/save-process-changes`, "POST", formData, null)
                }
                
                if(data.code == 201){
                    setRefreshProcess(true)
                    enqueueSnackbar(data.message, { variant: "success" });
                    setShowModalSaveChanges(false)
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
                <h2 className="text-xl font-bold mb-2 text-center">
                    Guardar Proceso
                </h2>

                <h3 className="text-lg mb-4 text-center">¿Estas Seguro que desea guardar el Proceso?</h3>


                <div className="flex justify-center space-x-4">
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
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};
