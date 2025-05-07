import { useState } from "react";
import { TipoProcesoTable } from "./TipoProcesoTable";
import { Botones } from "./Botones";
import { TipoProcesoNavegacion } from "./TipoProcesoNavegacion";



export const TipoProcesoContent = ( { openProcessModal }) => {
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
                <TipoProcesoNavegacion vista={vista} setVista={setVista} procesoSeleccionado={procesoSeleccionado} />
                <Botones openProcessModal={openProcessModal} />
            </div>
            <TipoProcesoTable vista={vista} setVista={setVista} handleClickMacroprocesos={handleClickMacroprocesos} handleClickProcesos={handleClickProcesos} procesos={procesos} procesoSeleccionado={procesoSeleccionado} subProcesos={subProcesos}/>
        </div>
    );
};


