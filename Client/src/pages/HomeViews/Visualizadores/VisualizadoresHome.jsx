import { useEffect, useState } from "react";
import { DashboardResumen } from "./components/DashboardResumen";
import { UserProfile } from "./components/UserProfile";
import { useSelector } from "react-redux";
import PanelVisualizador from "./components/PanelVisualizador";

export const VisualizadoresHome = () => {
    const user = useSelector((state) => state.auth.user);
    const usuario = user?.usuario;
    const [procesos, setProcesos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!usuario) return;

        const getAllProcess = async () => {
            try {
                setIsLoading(false);
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(
                    `${URL}/api/v1/procesos/get-all`, {credentials: "include"}
                );
                const data = await response.json();
                setProcesos(data.data);
                setIsLoading(true);
            } catch (error) {
                console.log(error);
            }
        };
        getAllProcess();
    }, [usuario]);

    return (
        <div className="p-6 space-y-8 min-h-screen">
            {usuario && <UserProfile usuario={usuario} />}
            <DashboardResumen procesos={procesos} />
            <PanelVisualizador procesos={procesos} />
        </div>
    );
};
