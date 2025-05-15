import { UserForm } from "./sections/UserForm"
import { EntidadesForm } from "./sections/EntidadesForm"
import { useAdminData } from "../../../context/AdminDataContext";


export const CreateUpdateModal = ({setIsOpenCreateUpdateModal, }) => {
    const { modo, type } = useAdminData();
   

    return (
            <div className="fixed inset-0 z-50  flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white flex justify-center items-center flex-col p-6 rounded-lg w-full max-w-md shadow-lg">
                    {type === "usuarios" && <h2 className="text-xl font-semibold mb-4">{modo === "crear" ? "Crear Nuevo Usuario" : "Actualizar Usuario"}</h2>}

                    {type !== "usuarios" && <h2 className="text-xl font-semibold mb-4">{modo === "crear" ? `Crear Nuevo ${type}` : `Actualizar ${type}`}</h2>}
                    <div>
                        {type === "usuarios" ? (<UserForm setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal}/>) 
                        : 
                        (<EntidadesForm setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal}  />)}
                    </div>  
                </div>
            </div>
)}

