import { useSelector } from "react-redux";
import { AdminDashboard } from "./AdminViews/AdminDashboard";
import { AprobadoresHome } from "./Aprobadores/AprobadoresHome";
import { ModeladoresHome } from "./Modeladores/ModeladoresHome";
import { VisualizadoresHome } from "./Visualizadores/VisualizadoresHome";


export const HomePage = () => {
    const user = useSelector((state) => state.auth.user);
    const id_rol = user?.usuario?.id_rol

    const renderPage = () =>{
        switch (id_rol) {
            case 1:
                return <AdminDashboard />
            case 2: 
                return <AprobadoresHome />
            case 3: 
                return < ModeladoresHome />
            case 4:
                return <VisualizadoresHome />
            case 5:
                return <AdminDashboard />
            default:
                return null;
        }

    }
  return (
    <>
        {user && renderPage()}
    </>
  )
}
