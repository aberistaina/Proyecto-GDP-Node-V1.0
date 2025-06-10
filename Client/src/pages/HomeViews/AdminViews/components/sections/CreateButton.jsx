import { useAdminData } from "../../../../../context/AdminDataContext";
import { handleCreateClick } from "../../../../../utils/adminFetch";

export const CreateButton = ({setIsOpenCreateUpdateModal}) => {

    const { setModo, type } = useAdminData()
    
    return (
        <div className="w-full flex justify-end py-4 ">
                <button className={`bg-[#99CC33] hover:bg-[#90c32c] text-white font-bold w-42 py-2 px-6 flex justify-center items-center gap-1  rounded-md transition duration-200 ease-in-out transform hover:scale-105`}
                onClick={() => handleCreateClick( setModo, setIsOpenCreateUpdateModal)}
                >
                    {type === "usuarios" ? "Crear Usuario" : type === "rol" ? "Crear Rol" : type === "cargo" ? "Crear Cargo" : "Crear Nivel" }
                </button>
        </div>
    )
}
