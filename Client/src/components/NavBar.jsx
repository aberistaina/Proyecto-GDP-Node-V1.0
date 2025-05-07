import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const NavBar = () => {

    const [ menus, setMenus ] = useState([])
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
    <nav className="bg-gray-800 text-white px-6 relative py-4 flex justify-between items-center z-50">
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
    </nav>
  );
};


