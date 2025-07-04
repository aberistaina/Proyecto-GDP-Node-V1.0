import { IoMdSearch } from "react-icons/io";

export const FiltroTexto = ({setBusqueda}) => {
    return (
        <div className="relative min-w-sm flex items-center">
            <input
                type="text"
                placeholder="Busqueda"
                className="pl-10  py-2 border  border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="absolute left-3  text-gray-400 "><IoMdSearch className="text-xl" /></span>
        </div>
    );
};