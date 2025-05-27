import { useState, useEffect } from "react";
import { TipoProcesoHeader } from "./components/TipoProcesoHeader";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ProcesosContainer } from "./test-navegacion/ProcesosContainer";
import { CadenaValor } from "./components/CadenaValor";

export const TipoProcesoPage = () => {
    
    const user = useSelector((state) => state.auth.user);
    const [ nivel, setNivel ] = useState("");
    const [ allProcess, setAllProcess ] = useState([]);
    const { idNivel } = useParams()
    
    useEffect(() => {
        const getNivel = async() =>{
            try {
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
                        
                const response = await fetch(`${URL}/api/v1/procesos/get-nivel/${idNivel}`);
                const data = await response.json();
                setNivel(data.data)
            } catch (error) {
                console.log(error);
            }
        }
        getNivel()
    }, [idNivel])

    useEffect(() => {
        const getProcess = async() =>{
            try {
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
                        
                const response = await fetch(`${URL}/api/v1/procesos/get-process-nivel/${idNivel}`);
                const data = await response.json();
                setAllProcess(data.data)
            } catch (error) {
                console.log(error);
            }
        }
        getProcess()
    }, [idNivel])

    

    
    

    return (
        <>
            {user ? (
                <div>
                    <TipoProcesoHeader titulo={nivel.nombre} />
                    <CadenaValor allProcess={allProcess} />
                </div>
            ) : (
                <p>Cargando...</p>
            )}
            {/* <TipoProcesoContent openProcessModal={openProcessModal} procesos={procesos} vista={vista} setVista={setVista} /> */}
            <ProcesosContainer />
            
            
            
        </>
    );
};