import { useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom"; 
import { useSnackbar } from "notistack";

export const Sidebar = () => {
    const [activeMenu, setActiveMenu] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const openMenu = (index) => {
        setActiveMenu(activeMenu === index ? null : index);
    };

    const logoutUser = () => {

        localStorage.removeItem("token");
        navigate("/login");
        enqueueSnackbar("Sesión cerrada correctamente", { variant: "info" });
    
    };
    

    return (
        <div className="flex w-1/6 h-screen p-6 bg-[#10644c] rounded-e-3xl">
            {/* Sidebar */}
            <div className=" text-white">
                <div className="p-6">
                    <h2 className="text-5xl text-center mb-2">GDP</h2>
                </div>
                <ul>

                    {/* Menú 1 */}
                    <div className={`bg-[#041a24] mx-3 rounded-3xl w-64  ${activeMenu === 1 ? "rounded-b-none mb-0" : " mb-4"}`}>
                    <li className="flex items-center px-6 py-4" onClick={() => openMenu(1)}>
                            <FaRegCircleUser className="text-3xl mx-4" />
                            Mi Cuenta
                            <IoMdArrowDropdown className="ml-auto transition-transform cursor-pointer" style={{ transform: activeMenu === 1 ? "rotate(180deg)" : "rotate(0deg)" }} />
                        </li>
                    </div>

                    {/* Submenú 1*/}
                    {activeMenu === 1 && (
                        <ul className="bg-[#041a24] mx-3 rounded-b-3xl overflow-hidden transition-all mb-4">
                            <li className="italic px-10 py-2 hover:bg-[#0c2d3b] cursor-pointer">Perfil</li>
                            <li className="italic px-10 py-2 hover:bg-[#0c2d3b] cursor-pointer">Configuración</li>
                            <li className="italic px-10 py-2 pb-4 hover:bg-[#0c2d3b] cursor-pointer" onClick={() => logoutUser()}>Cerrar sesión</li>
                        </ul>
                    )}

                    {/* Menú 2 */}
                    <div className={`bg-[#041a24] mx-3 rounded-3xl ${activeMenu === 2 ? "rounded-b-none mb-0" : "mb-4"}`}>
                        <li className="flex items-center px-6 py-4" onClick={() => openMenu(2)}>
                            Procesos Estratégicos
                            <IoMdArrowDropdown className="ml-auto transition-transform cursor-pointer" style={{ transform: activeMenu === 2 ? "rotate(180deg)" : "rotate(0deg)" }} />
                        </li>
                    </div>

                    {/* Submenú 2 Reemplazar con datos dinámicos */}
                    {activeMenu === 2 && (
                        <ul className="bg-[#041a24] mx-3 rounded-b-3xl overflow-hidden transition-all mb-4">
                            <li className="italic px-10 py-2 hover:bg-[#0c2d3b] cursor-pointer">Submenu 1</li>
                            <li className="italic px-10 py-2 hover:bg-[#0c2d3b] cursor-pointer">Submenu 2</li>
                            <li className="italic px-10 py-2 pb-4 hover:bg-[#0c2d3b] cursor-pointer">Submenu 3</li>
                        </ul>
                    )}

                    {/* Menú 3 */}
                    <div className={`bg-[#041a24] mx-3 rounded-3xl ${activeMenu === 3 ? "rounded-b-none mb-0" : "mb-4"}`}>
                        <li className="flex items-center px-6 py-4" onClick={() => openMenu(3)}>
                            Procesos Operativos
                            <IoMdArrowDropdown className="ml-auto transition-transform" style={{ transform: activeMenu === 3 ? "rotate(180deg)" : "rotate(0deg)" }} />
                        </li>
                    </div>

                    {/* Submenú 3 Reemplazar con datos dinámicos */}
                    {activeMenu === 3 && (
                        <ul className="bg-[#041a24] mx-3 rounded-b-3xl overflow-hidden transition-all mb-4">
                            <li className="italic px-6 py-2 hover:bg-[#0c2d3b] cursor-pointer">Submenu 1</li>
                            <li className="italic px-6 py-2 hover:bg-[#0c2d3b] cursor-pointer">Submenu 2</li>
                            <li className="italic px-6 py-2 pb-4 hover:bg-[#0c2d3b] cursor-pointer">Submenu 3</li>
                        </ul>
                    )}

                    {/* Menú 4 */}
                    <div className={`bg-[#041a24] mx-3 rounded-3xl ${activeMenu === 4 ? "rounded-b-none mb-0" : "mb-4"}`}>
                        <li className="flex items-center px-6 py-4" onClick={() => openMenu(4)}>
                            Procesos de Soporte
                            <IoMdArrowDropdown className="ml-auto transition-transform" style={{ transform: activeMenu === 4 ? "rotate(180deg)" : "rotate(0deg)" }} />
                        </li>
                    </div>

                    {/* Submenú 4 Reemplazar con datos dinámicos*/}
                    
                    {activeMenu === 4 && (
                        <ul className="bg-[#041a24] mx-3 rounded-b-3xl overflow-hidden transition-all mb-4">
                            <li className="italic px-6 py-2 hover:bg-[#0c2d3b] cursor-pointer">Submenu 1</li>
                            <li className="italic px-6 py-2 hover:bg-[#0c2d3b] cursor-pointer">Submenu 2</li>
                            <li className="italic px-6 py-2 pb-4 hover:bg-[#0c2d3b] cursor-pointer">Submenu 3</li>
                        </ul>
                    )}
                </ul>
            </div>
        </div>
    );
};
