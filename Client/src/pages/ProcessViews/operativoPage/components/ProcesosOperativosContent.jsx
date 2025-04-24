import { useState } from "react";
import { ProcesosOperativosTable } from "./ProcesosOperativosTable";
import { Botones } from "./Botones";
import { ProcesosOperativosNavegacion } from "./ProcesosOperativosNavegacion";



export const ProcesosOperativosContent = ( { openSubProcesoModal, openFlujoModal }) => {
    const [ vista, setVista ] = useState("inicio");
    const [ procesos, setProcesos ] = useState([]);
    const [ procesoSeleccionado, setProcesoSeleccionado ] = useState({
        nombre: "",
        idProceso: ""
    })
    const [ subProcesos, setSubProcesos ] = useState([])

    const handleClickMacroprocesos = async() => {
        setVista("macroprocesos");
            try {
                const response = await fetch("http://localhost:3000/api/v1/procesos");
                const data = await response.json();
                setProcesos(data.data);
            } catch (error) {
                console.log(error);
            }
    };

    const handleClickProcesos = async(nombre, idProceso) => {
        setProcesoSeleccionado({ nombre, idProceso });

        setVista("procesos");
        try {
            const response = await fetch(`http://localhost:3000/api/v1/procesos/get-subprocess-process/${idProceso}`);
            const data = await response.json();
            setSubProcesos(data.data);
        } catch (error) {
            console.log(error);
        }
    };


    

    return (
        <div className="bg-[#ececec] rounded-lg drop-shadow-lg h-36 pt-4">
            <div className="flex justify-between px-8 py-2 mb-4">
                <ProcesosOperativosNavegacion vista={vista} setVista={setVista} procesoSeleccionado={procesoSeleccionado} />
                <Botones />
            </div>
            <ProcesosOperativosTable vista={vista} setVista={setVista} handleClickMacroprocesos={handleClickMacroprocesos} handleClickProcesos={handleClickProcesos} procesos={procesos} procesoSeleccionado={procesoSeleccionado} subProcesos={subProcesos}/>
        </div>
    );
};


