import { useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { useBpmnContext } from "../context/useBpmnContext";
import { useConfirmAlert } from "../../context/ConfirmAlertProvider";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { exportDiagramXml } from "../utils/bpmnUtils";
import { useSelector } from "react-redux";
import { createDiagram } from "../utils/bpmnUtils";

//Componente que crea el menú contextual para vincular procesos con subprocesos
export const CustomMenuContextual = ({modo}) => {
    const [subProcess, setSubProcess] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { openMenuContextual, setEmptyDiagram, bpmnModelerRef } = useBpmnContext();
    const { alert, confirm } = useConfirmAlert();
    const { x, y, subProcessId, processID, callActivity } = openMenuContextual;
    const { idProceso, version } = useParams();

    const guardarCambios = async() =>{
            try {
                const URL = import.meta.env.VITE_APP_MODE === "desarrollo" ? import.meta.env.VITE_URL_DESARROLLO : import.meta.env.VITE_URL_PRODUCCION;
    
                const xmlContent = await exportDiagramXml(bpmnModelerRef);
                const blob = new Blob([xmlContent], { type: "application/xml" })
                console.log("USUARIOOOO", user);
                const loggedUser = user.usuario?.id_usuario

                const formData = new FormData();
                formData.append("archivo", blob, `process.bpmn`);
                formData.append("id_creador", loggedUser);
                const datosProceso =  JSON.parse(sessionStorage.getItem("datos"));
    
                let response = null
                if(!idProceso && !version){
                    formData.append("nombre", datosProceso.nombre)
                    formData.append("descripcion", datosProceso.descripcion)
                    formData.append("aprobadores", datosProceso.aprobadores);
                    formData.append("nivel", datosProceso.nivel)
                    formData.append("esMacroproceso", datosProceso.macroproceso);
                    const requestOptions = {
                        method: "POST",
                        body: formData,
                        credentials: "include"
                    }
                    response = await fetch(`${URL}/api/v1/procesos/save-process-changes`, requestOptions)
                }else if(idProceso && version){
                    formData.append("idProceso", idProceso)
                    formData.append("version", version)
                    const requestOptions = {
                        method: "POST",
                        body: formData,
                        credentials: "include"
                    }
                    response = await fetch(`${URL}/api/v1/procesos/save-new-version-changes`, requestOptions)
                }
                
                const data = await response.json()
                
                if(data.code == 201){
                    enqueueSnackbar(data.message, { variant: "success" });
                }else{
                    enqueueSnackbar(data.message, { variant: "error" });
                } 
                } catch (error) {
                    console.log(error)
                }
        }

    const goToProcess = async() => {
        if (!subProcessId && modo === "viewer") {
            alert("No existe ningún subproceso vinculado");
        } else if(subProcess && modo === "viewer") {
            navigate(`/subproceso/${subProcessId}`);
        }else if(idProceso && modo === "designer"){
            const confirmacion = await confirm("Se van a guardar los cambios antes de continuar",
                {
                    title: "Alerta",
                    confirmText: "Sí, Deseo continuar",
                    cancelText: "Cancelar"
                });
            if(confirmacion){
                guardarCambios()
                navigate(`/subproceso/${callActivity}/${processID}`)
            }else{
                return
            }
        }else{
            const confirmacion = await confirm("Se van a guardar los cambios antes de continuar",
                {
                    title: "Alerta",
                    confirmText: "Sí, Deseo continuar",
                    cancelText: "Cancelar"
                });
            if(confirmacion){
                guardarCambios()
                window.open(`/subproceso/${callActivity}/${processID}`, "_blank")
            }else{
                return
            }
            
        }
    };

    const insertarSubproceso = async (idSubproceso) => {
        try {
            const data = JSON.parse(sessionStorage.getItem("datos"));
            const loggedUser = user.usuario?.id_usuario
            const formData = new FormData();
            if(data){
                formData.append("nombre", data.nombre)
                formData.append("descripcion", data.descripcion)
                formData.append("aprobadores", data.aprobadores);
                formData.append("nivel", data.nivel)
                formData.append("esMacroproceso", data.macroproceso);
                formData.append("id_creador", loggedUser);
            }
            
            formData.append("idProceso", processID);
            formData.append("calledElement", idSubproceso);
            formData.append("callActivity", callActivity);

            version ? formData.append("version", version) : null;
            const xmlContent = await exportDiagramXml(bpmnModelerRef);
            const blob = new Blob([xmlContent], { type: "application/xml" })
            formData.append("archivo", blob, `process.bpmn`);

            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;
            
            const requestOptions = {
                method: "POST",
                body: formData,
                credentials: "include"
            }

            const response = await fetch(`${URL}/api/v1/procesos/connect-subprocess`, requestOptions);
            const xml = await response.text()
            
            if (response.ok) {
                createDiagram(bpmnModelerRef, xml);
                enqueueSnackbar("Proceso vinculado correctamente", { variant: "success" });
                
            } else {
                enqueueSnackbar("Hubo un error al vincular el proceso", { variant: "error" });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const getAllSubprocess = async () => {
            try {
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;

                const response = await fetch(`${URL}/api/v1/procesos/get-all`, {credentials: "include"})
                const data = await response.json()
                console.log(data);
                setSubProcess(data.data || []);
            } catch (error) {
                console.log("Error al cargar subprocesos:", error);
            }
        };

        getAllSubprocess();
    }, []);

    if (!openMenuContextual.state) return null;



    return (
        <ul
            className="absolute z-50 bg-white shadow-md border border-gray-300 rounded text-sm"
            id="menu-contextual"
            style={{ top: y, left: x }}
        >
            {/* Submenú */}
            <li className="relative group px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                <span>Vincular Subproceso</span>
                <svg
                    className="w-3 h-3 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>

                <ul className="absolute top-0 left-full mt-[-1px] min-w-[160px] hidden group-hover:flex flex-col bg-white border border-gray-300 shadow-md rounded z-50">
                    {subProcess.length > 0 ? (
                        subProcess.map((subproceso) => {
                            if (subproceso.id_proceso !== subProcessId && !subproceso.macroproceso) {
                                return (
                                    <li
                                        key={subproceso.id_proceso}
                                        className="px-4 py-2 hover:bg-gray-100 whitespace-nowrap cursor-pointer"
                                        id={subproceso.id_proceso}
                                        onClick={() =>
                                            insertarSubproceso(
                                                subproceso.id_bpmn
                                            )
                                        }
                                    >
                                        {subproceso.nombre}
                                    </li>
                                );
                            }
                            return null;
                        })
                    ) : (
                        <li className="px-4 py-2 text-gray-500 italic">
                            Sin subprocesos
                        </li>
                    )}
                </ul>
            </li>
        </ul>
    );
};
