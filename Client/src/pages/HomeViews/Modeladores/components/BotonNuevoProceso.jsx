import { FaPlus } from "react-icons/fa";


export const BotonNuevoProceso = ({ setIsOpen }) => {
    return (
        <div className="space-x-4 flex justify-end">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#00ba8f] hover:bg-[#1f9078] text-white w-42 py-2 px-4 flex justify-center items-center gap-1  rounded-md transition duration-200 ease-in-out transform hover:scale-105"
            >
                <FaPlus /> Crear Nuevo Poceso
            </button>
        </div>
    );
};
