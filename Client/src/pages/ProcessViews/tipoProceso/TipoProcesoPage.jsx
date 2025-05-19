import { useState, useEffect } from "react";
import { TipoProcesoContent } from "./components/TipoProcesoContent";
import { TipoProcesoHeader } from "./components/TipoProcesoHeader";
import { ModalSubproceso} from "./components/ModalSubproceso";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const TipoProcesoPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const [ procesos, setProcesos ] = useState([]);
    const [ nivel, setNivel ] = useState("");
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [ vista, setVista ] = useState("inicio")

    const { idNivel } = useParams()
    
    const openProcessModal = () => {
        setIsOpen(true);
    };
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        const getProcessByNivel = async() =>{
            try {
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(`${URL}/api/v1/procesos/get-process-nivel/${idNivel}`);
                const data = await response.json();
                setProcesos(data.data)
            } catch (error) {
                console.log(error);
            }
        }
        getProcessByNivel()
    }, [idNivel])

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

    
    

    return (
        <>
            {user ? (
                <TipoProcesoHeader titulo={nivel.nombre} />
            ) : (
                <p>Cargando...</p>
            )}
            <TipoProcesoContent openProcessModal={openProcessModal} procesos={procesos} vista={vista} setVista={setVista} />
            
            {isOpen && (
                <ModalSubproceso isOpen={isOpen} closeModal={closeModal} idNivel={idNivel} />
            )}
            
        </>
    );
};