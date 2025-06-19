import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { logoutUsuario } from "../store/authThunks";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { HiOutlineArchiveBox } from "react-icons/hi2";
import { FiSettings, FiBriefcase } from "react-icons/fi";

export const NavBar = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [menus, setMenus] = useState([]);
    const dispatch = useDispatch();

    const cerrarSesion = async () => {
        try {
            const response = await dispatch(logoutUsuario());
            if (response.ok) {
                enqueueSnackbar("Sesión cerrada correctamente", {
                    variant: "success",
                });
            } else {
                enqueueSnackbar("Error al cerrar sesión", { variant: "error" });
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            enqueueSnackbar("Error al cerrar sesión", { variant: "error" });
        }
    };
    useEffect(() => {
        const getMenus = async () => {
            try {
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(
                    `${URL}/api/v1/niveles/get-niveles`, {credentials: "include"}
                );
                const data = await response.json();
                setMenus(data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getMenus();
    }, []);

    return (
        <nav className="bg-[#FFFFFF] text-black shadow-[0_5px_40px_rgba(0,0,0,.22)] border-b-2 border-gray-300 px-20 py-4 flex justify-evenly items-center z-auto">
            <div className="text-xl font-bold ">
                <NavLink to="/" className="group flex items-center gap-1">
                    <span className="text-black text-3xl transition duration-1000 group-hover:[transform:rotateX(360deg)]">
                        Gob
                    </span>
                    <span className="text-[#99CC33] text-3xl transition duration-1000 group-hover:[transform:rotateX(360deg)]">
                        Process.
                    </span>
                </NavLink>
            </div>
            <ul className="flex space-x-6">
                {menus.map((menu) => (
                    <li key={menu.id_nivel}>
                        <NavLink
                            to={`/tipo-proceso/${menu.id_nivel}`}
                            className={({ isActive }) =>
                                isActive
                                    ? "bg-[#99CC33] px-6 py-2 rounded-lg text-white text-sm flex justify-center items-center gap-2 hover:scale-105 transition duration-300 ease-in-out "
                                    : "bg-white px-6 py-2 rounded-lg text-[#313132] text-sm flex justify-center items-center gap-2 hover:bg-[#F5FAEA] hover:text-[#99CC33] hover:scale-105 transition duration-300 ease-in-out"
                            }
                        >
                            {menu.id_nivel === 1 ? (
                                <FiBriefcase className="text-lg" />
                            ) : menu.id_nivel === 2 ? (
                                <HiOutlineArchiveBox className="text-lg" />
                            ) : (
                                <FiSettings className="text-lg" />
                            )}
                            {menu.nombre}
                        </NavLink>
                    </li>
                ))}
            </ul>
            <div>
                <button
                    className=" group bg-[#EFF1F3] text-black border border-black font-extralight flex gap-2 items-center px-7 py-2 rounded-md transition-colors duration-700 ease-in-out hover:bg-[#252627] hover:text-white shadow-md"
                    onClick={cerrarSesion}
                >
                    Cerrar Sesión
                    <FaRegUserCircle className="text-2xl text-black group-hover:text-white transition-colors duration-700 ease-in-out" />
                </button>
            </div>
        </nav>
    );
};
