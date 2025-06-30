import { useBpmnContext } from "../../context/useBpmnContext";
import { FaRegSave } from "react-icons/fa";


//Botones para Guardar y Crear Nuevo Diagrama
export const BpmnDesignerButtons = ({setShowModalSaveChanges}) => {
    const { setEmptyDiagram, template } = useBpmnContext();
    
    return (
        <div className="flex gap-2 justify-end">
            <button
                className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 w-42  px-3 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                onClick={() => setShowModalSaveChanges(true)}
            >
                <FaRegSave className="me-2" />
                Guardar Cambios
            </button>
        </div>
    );
};
