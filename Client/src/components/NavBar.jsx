import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoPerson } from "react-icons/go";
import { logoutUsuario } from "../store/authThunks";
import { closeSnackbar, useSnackbar } from "notistack";
import { useDispatch } from "react-redux";

export const NavBar = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [ menus, setMenus ] = useState([])
    const dispatch = useDispatch();

    const cerrarSesion = async() => {
        try {
            const response = await dispatch(logoutUsuario())
            console.log(response);
            if (response.ok) {
                enqueueSnackbar("Sesión cerrada correctamente", { variant: "success" });
            } else {
                enqueueSnackbar("Error al cerrar sesión", { variant: "error" });
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            enqueueSnackbar("Error al cerrar sesión", { variant: "error" });
        }
    }
    useEffect(() => {
        const getMenus = async() => {
            try {
                
                const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(`${URL}/api/v1/procesos/get-niveles`)
                const data = await response.json()
                setMenus(data.data)
            } catch (error) {
                console.log(error)
            }
        }
        getMenus()
    }, [])
    
  return (
    <nav className="bg-gradient-to-r from-[#F4F7FF] to-[#F2F2FF] text-black rounded-full px-20 py-4 flex justify-between items-center z-50 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
      <div className="text-xl font-bold">
        <Link to="/">Logo</Link>
      </div>
      <ul className="flex space-x-6">
        <li className="relative group">
          <Link to="/" className="hover:text-gray-300">Inicio</Link>
        </li>
        {menus.map((menu) => (
            <li className="relative group" key={menu.id_nivel}>
                <Link to={`/tipo-proceso/${menu.id_nivel}`} className="hover:text-gray-300">{menu.nombre}</Link>
          </li>
        ))}
      </ul>
      <div>
        <button className="bg-white text-black font-extralight flex gap-2 items-center px-7 py-2 rounded-full transition duration-200 ease-in-out transform hover:scale-105 hover:bg-gray-100 shadow-md"
        onClick={cerrarSesion}>
            Cerrar Sesión<GoPerson className="text-2xl" fill="#aaaaaa" />
        </button>
      </div>
    </nav>
  );
};


