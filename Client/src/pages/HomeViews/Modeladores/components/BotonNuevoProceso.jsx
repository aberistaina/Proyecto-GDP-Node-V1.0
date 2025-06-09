import { FiPlusCircle } from "react-icons/fi";


export const BotonNuevoProceso = ({ setIsOpen }) => {
    return (
        <div className="space-x-4 flex justify-end">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#99CC33] hover:bg-[#90c32c] text-white font-bold w-42 py-2 px-6 flex justify-center items-center gap-1  rounded-md transition duration-200 ease-in-out transform hover:scale-105"
            >
                <FiPlusCircle className="ms-2 mt-1" /> Crear Nuevo Poceso 
            </button>
        </div>
    );
};
