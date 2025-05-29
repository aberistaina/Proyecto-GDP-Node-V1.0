import { useState } from "react";
import { TipoProcesoTable } from "./TipoProcesoTable";
import { Botones } from "../../../HomeViews/Modeladores/components/Botones";
import { TipoProcesoNavegacion } from "./TipoProcesoNavegacion";
import { CadenaValor } from "./CadenaValor";



export const TipoProcesoContent = ( { openProcessModal, procesos, vista, setVista }) => {
    
    const [ procesoSeleccionado, setProcesoSeleccionado ] = useState({
        nombre: "",
        idProceso: "",
        id_bpmn:"",
        created_at:"",
        crador: "",
        version:""
        
    })

    const [macroProcesoSeleccionado, setMacroProcesoSeleccionado] = useState({
        nombre: "",
        idProceso: "",
        id_bpmn:"",
        created_at:"",
        crador: "",
        version:""
    })

    const [ subProcesos, setSubProcesos ] = useState([])

    const getSubprocess = async(id_bpmn) =>{
        const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;

        const response = await fetch(`${URL}/api/v1/procesos/get-subprocess-process/${id_bpmn}`);
            const data = await response.json();
            setSubProcesos(data.data);
            console.log("DATA", data);
    }

    const handleClickMacroprocesos = async(nombre, idProceso ,id_bpmn, created_at, creador, version) => {
        setVista("macroprocesos");
        setMacroProcesoSeleccionado({ nombre, idProceso, id_bpmn, created_at, creador, version})
        await getSubprocess(id_bpmn)
        
    };

    const handleClickProcesos = async(nombre, idProceso, id_bpmn, created_at, creador, version) => {
        setProcesoSeleccionado({ nombre, idProceso, id_bpmn, created_at, creador, version });
        setVista("procesos");
        try {
            await getSubprocess(id_bpmn)
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-[#ECECE] rounded-lg drop-shadow-lg h-36 pt-4">
            <CadenaValor />
            <div className="flex justify-between px-8 py-2 mb-4">
                <TipoProcesoNavegacion vista={vista} setVista={setVista} procesoSeleccionado={procesoSeleccionado} getSubprocess={getSubprocess} macroProcesoSeleccionado={macroProcesoSeleccionado} />
                <Botones openProcessModal={openProcessModal} />
            </div>
            <TipoProcesoTable vista={vista} setVista={setVista} handleClickMacroprocesos={handleClickMacroprocesos} handleClickProcesos={handleClickProcesos} procesos={procesos} procesoSeleccionado={procesoSeleccionado} subProcesos={subProcesos} macroProcesoSeleccionado={macroProcesoSeleccionado}/>
        </div>
    );
};


