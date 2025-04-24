import { useState, useEffect } from "react";
import { ProcesosOperativosContent } from "./components/ProcesosOperativosContent";
import { ProcesosOperativosHeader } from "./components/ProcesosOperativosHeader";
import { ModalSubproceso} from "./components/ModalSubproceso";
import ModalFlujo from "./components/ModalFlujo";
import { useSelector } from "react-redux";

export const ProcesosOperativosPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const user = useSelector((state) => state.auth.user);
    const fechaActual = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric'})
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    

    const openSubProcesoModal = () => {
        setModalType("subproceso");
        setIsOpen(true);
    };

    const openFlujoModal = () => {
        setModalType("flujo");
        setIsOpen(true);
    };
    const closeModal = () => setIsOpen(false);

    return (
        <>
            {user ? (
                <ProcesosOperativosHeader titulo="Procesos Operativos" usuario={user.data} fecha={fechaActual} />
            ) : (
                <p>Cargando...</p>
            )}
            <ProcesosOperativosContent openFlujoModal={openFlujoModal} openSubProcesoModal={openSubProcesoModal} setModalType={setModalType} />
            
            {isOpen && modalType === "subproceso" && (
                <ModalSubproceso isOpen={isOpen} closeModal={closeModal} />
            )}
            {isOpen && modalType === "flujo" && (
                <ModalFlujo isOpen={isOpen} closeModal={closeModal} />
            )}
        </>
    );
};