import { useEffect, useState } from "react";
import { DashboardResumen } from "./components/DashboardResumen";
import { BorradoresActivos } from "./components/BorradoresActivos";
import { UserProfile } from "./components/UserProfile";
import { useSelector } from "react-redux";
import { ModalCrearProceso } from "./components/ModalCrearProceso";
import { BotonNuevoProceso } from "./components/BotonNuevoProceso";

export const ModeladoresHome = () => {
    const user = useSelector((state) => state.auth.user);
    const usuario = user?.usuario;
    const [borradoresActivos, setBorradoresActivos] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openProcessModal = () => {
        setIsOpen(true);
    };
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        if (!usuario) return;

        const getPendingProcess = async () => {
            try {
                setIsLoading(false);
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(
                    `${URL}/api/v1/procesos/get-pending-draft/${usuario.id_usuario}`
                );
                const data = await response.json();
                setBorradoresActivos(data.data);
                setIsLoading(true);
            } catch (error) {
                console.log(error);
            }
        };
        getPendingProcess();
    }, [usuario]);

    return (
        <div className="relative p-6 space-y-8 min-h-screen bg-[#f9fafb]">
            {usuario && <UserProfile usuario={usuario} />}
            <DashboardResumen borradoresActivos={borradoresActivos} />
            <BotonNuevoProceso setIsOpen={setIsOpen}/>
            <BorradoresActivos
                borradoresActivos={borradoresActivos}
                isLoading={isLoading}
            />
            {isOpen && (
                <ModalCrearProceso isOpen={isOpen} closeModal={closeModal}/>
            )}
        </div>
    );
};
