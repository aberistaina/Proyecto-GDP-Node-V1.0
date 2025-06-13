import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import {exportDiagramXml} from "../../utils/bpmnUtils";
import { useBpmnContext } from "../../context/useBpmnContext";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { crearImagenFlujo } from "../../utils/bpmnUtils";

//Componente con mensaje para guardar cambios en el flujo que se está trabajando
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
                const imagen  = await crearImagenFlujo(bpmnModelerRef.current, idProceso )
                console.log(imagen);
                const formData = new FormData();
                formData.append("archivo", blob, `process.bpmn`);
                formData.append("imagen", imagen, `process.png`);
                formData.append("id_creador", loggedUser);
    
                let response = null
                if(idProcesoPadre && callActivity){
                    formData.append("idProcesoPadre", idProcesoPadre)
                    formData.append("callActivity", callActivity)
                    const requestOptions = {
                        method: "POST",
                        body: formData,
                        credentials: "include"
                    }
                    response = await fetch(`${URL}/api/v1/procesos/save-subprocess-changes`, requestOptions)
                }else if(idProceso && version){
                    const requestOptions = {
                        method: "POST",
                        body: formData,
                        credentials: "include"
                    }
                    formData.append("idProceso", idProceso)
                    formData.append("version", version)
                    response = await fetch(`${URL}/api/v1/procesos/save-new-version-changes`, requestOptions)
                    navigate(`/process-details/${idProceso}/${version}`)
                }else{
                    const requestOptions = {
                        method: "POST",
                        body: formData,
                        credentials: "include"
                    }
                    formData.append("nombre", datosProceso.nombre)
                    formData.append("descripcion", datosProceso.descripcion)
                    formData.append("aprobadores", datosProceso.aprobadores);
                    formData.append("nivel", datosProceso.nivel)
                    formData.append("esMacroproceso", datosProceso.macroproceso);
                    response = await fetch(`${URL}/api/v1/procesos/save-process-changes`, requestOptions)
                }
                const data = await response.json()
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
