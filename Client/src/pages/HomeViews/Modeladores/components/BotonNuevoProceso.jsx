import { FiPlusCircle } from "react-icons/fi";


export const BotonNuevoProceso = ({ setIsOpen }) => {
    return (
        <div className="space-x-4 flex justify-end">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#3C3C3C] hover:bg-[#2f2f2f] text-white w-42 py-2 px-4 flex justify-center items-center gap-1  rounded-md transition duration-200 ease-in-out transform hover:scale-105"
            >
                Crear Poceso <FiPlusCircle className="ms-2 mt-1" />
            </button>
        </div>
    );
};
