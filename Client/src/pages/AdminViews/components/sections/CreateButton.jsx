import { useAdminData } from "../../../../context/AdminDataContext";
import { handleCreateClick } from "../../../../utils/adminFetch";

export const CreateButton = ({setIsOpenCreateUpdateModal}) => {

    const { setModo, type } = useAdminData()
    
    return (
        <div className="w-full flex justify-end py-4 ">
                <button className={`px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition duration-200 ease-in-out transform hover:scale-105`}
                onClick={() => handleCreateClick( setModo, setIsOpenCreateUpdateModal)}
                >
                    {type === "usuarios" ? "Crear Usuario" : type === "rol" ? "Crear Rol" : type === "cargo" ? "Crear Cargo" : "Crear Nivel" }
                </button>
        </div>
    )
}
