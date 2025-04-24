import { FaUserLarge } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";

export const ProcesosOperativosHeader = ({ titulo, usuario, fecha }) => {
    return (
        <div className="bg-[#ececec] rounded-lg drop-shadow-lg h-36 pt-4 mb-8">
            <div>
                <h1 className="text-4xl font-bold px-8 mb-6">{titulo}</h1>
            </div>

            <div className="flex items-center ms-4 px-5">
                <FaUserLarge /> 
                <p className="italic ms-4">{usuario.nombre}</p>
            </div>

            <div className="flex items-center ms-4 px-5">
                <FaRegCalendarAlt />
                <p className="italic ms-4">{fecha}</p>
            </div>
        </div>
    );
};
