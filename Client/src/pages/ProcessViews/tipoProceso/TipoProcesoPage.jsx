import { useState, useEffect } from "react";
import { TipoProcesoContent } from "./components/TipoProcesoContent";
import { TipoProcesoHeader } from "./components/TipoProcesoHeader";
import { ModalSubproceso} from "./components/ModalSubproceso";
import { useSelector } from "react-redux";

export const TipoProcesoPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    
    const openProcessModal = () => {
        setIsOpen(true);
        console.log("Abriendo Modal")
    };
    const closeModal = () => setIsOpen(false);

    return (
        <>
            {user ? (
                <TipoProcesoHeader titulo="Procesos Operativos" />
            ) : (
                <p>Cargando...</p>
            )}
            <TipoProcesoContent openProcessModal={openProcessModal} />
            
            {isOpen && (
                <ModalSubproceso isOpen={isOpen} closeModal={closeModal} />
            )}
            
        </>
    );
};