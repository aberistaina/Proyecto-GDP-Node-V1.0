import { FaPaperPlane } from "react-icons/fa";

export const EnviarProcesoAprobacion = () => {
    
    return (
        <button
            className="bg-[#6f42c1] hover:bg-[#8556d4] text-white font-bold py-2 w-42  px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition duration-300 ease-in-out transform hover:scale-105"
        >
            <FaPaperPlane className="me-2" /> Solicitar Aprobación
        </button>
        )
}
