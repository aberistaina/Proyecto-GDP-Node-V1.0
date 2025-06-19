import { useState, useEffect } from "react";
import { TipoProcesoHeader } from "./components/TipoProcesoHeader";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ProcesosContainer } from "./components/ProcesosContainer";

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
                        
                const response = await fetch(`${URL}/api/v1/niveles/get-nivel/${idNivel}`, {credentials: "include"});
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
                        
                const response = await fetch(`${URL}/api/v1/procesos/get-process-nivel/${idNivel}`, {credentials: "include"});
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
                    <TipoProcesoHeader titulo={nivel.nombre} allProcess={allProcess} />
                    
                </div>
            ) : (
                <p>Cargando...</p>
            )}
            <ProcesosContainer />
        </>
    );
};