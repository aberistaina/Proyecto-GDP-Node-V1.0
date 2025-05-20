import { useSelector } from "react-redux";
import { AdminDashboard } from "./AdminViews/AdminDashboard";
import { AprobadoresHome } from "./Aprobadores/AprobadoresHome";


export const HomePage = () => {
    const user = useSelector((state) => state.auth.user);
    const id_rol = user?.usuario?.id_rol
    console.log(id_rol);

    const renderPage = () =>{
        switch (id_rol) {
            case 1:
                return <AdminDashboard />
            case 2: 
                return <AprobadoresHome />
            case 3: 
                return 
            case 4:
                return <AprobadoresHome />
            case 5:
                return
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
