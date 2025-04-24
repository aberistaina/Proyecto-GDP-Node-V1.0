import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useBpmnContext } from "../context/useBpmnContext";
import { useConfirmAlert } from "../../context/ConfirmAlertProvider";
import { fetchHook } from "../../hooks/fetchHook";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { exportDiagramXml } from "../utils/bpmnUtils";

export const CustomMenuContextual = ({modo}) => {
    const [subProcess, setSubProcess] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { openMenuContextual, setEmptyDiagram, bpmnModelerRef } = useBpmnContext();
    const { alert, confirm } = useConfirmAlert();
    const { x, y, subProcessId, processID, callActivity } = openMenuContextual;
    const { idProcesoPadre } = useParams();

    const guardarCambios = async() =>{
            try {
                const URL = import.meta.env.VITE_APP_MODE === "desarrollo" ? import.meta.env.VITE_URL_DESARROLLO : import.meta.env.VITE_URL_PRODUCCION;
    
                const xmlContent = await exportDiagramXml(bpmnModelerRef);
            
                const blob = new Blob([xmlContent], { type: "application/xml" });
                const formData = new FormData();
                formData.append("archivo", blob, `proceso.bpmn`);
    
                let data = null
                if(idProcesoPadre){
                    formData.append("idProcesoPadre", idProcesoPadre)
                    formData.append("callActivity", callActivity)
                    data = await fetchHook(`${URL}/api/v1/procesos/save-subprocess-changes`, "POST", formData, null)
                }else{
                    data = await fetchHook(`${URL}/api/v1/procesos/save-process-changes`, "POST", formData, null)
                }
                
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
            }else if(idProcesoPadre && modo === "designer"){
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
            const formData = new FormData();
            formData.append("idProceso", processID);
            formData.append("idSubProceso", idSubproceso);
            formData.append("callActivity", callActivity);

            await guardarCambios()

            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;

            const data = await fetchHook(
                `${URL}/api/v1/procesos/connect-subprocess`,
                "POST",
                formData,
                null
            );

            const newData = await fetchHook(`${URL}/api/v1/procesos/${processID}`, "GET", null, null);
            if (data.code == 200) {
                enqueueSnackbar(data.message, { variant: "success" });
                setEmptyDiagram(newData.xml);
            } else {
                enqueueSnackbar(data.message, { variant: "error" });
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

                const data = await fetchHook(`${URL}/api/v1/procesos/`, "GET", null, null)
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
            <li
                className="px-4 py-2 hover:bg-gray-100 whitespace-nowrap cursor-pointer"
                onClick={goToProcess}
            >
                Ir al Subproceso
            </li>

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
                            if (subproceso.idProceso !== subProcessId) {
                                return (
                                    <li
                                        key={subproceso.idProceso}
                                        className="px-4 py-2 hover:bg-gray-100 whitespace-nowrap cursor-pointer"
                                        id={subproceso.idProceso}
                                        onClick={() =>
                                            insertarSubproceso(
                                                subproceso.idProceso
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
