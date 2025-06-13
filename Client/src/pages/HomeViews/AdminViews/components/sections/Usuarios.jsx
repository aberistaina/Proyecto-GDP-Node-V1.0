import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useConfirmAlert } from "../../../../../context/ConfirmAlertProvider";
import { useAdminData } from "../../../../../context/AdminDataContext";
import { CreateButton } from "./CreateButton";

import { useSnackbar } from "notistack";


export const Usuarios = ( {setIsOpenCreateUpdateModal} ) => {
    const { confirm } = useConfirmAlert();
    const { enqueueSnackbar } = useSnackbar();
    const { usuarios, getAllUsers, setID, setModo } = useAdminData();

    const handleUpdateClick = (id) =>{
        try {
            setIsOpenCreateUpdateModal(true)
            setID(id)
            setModo("modificar")
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteClick = async(id) => {
        try {
            const confirmacion = await confirm(
                    "¿Está Seguro que desea eliminar a este usuario?",
                    {
                        title: "Alerta",
                        confirmText: "Sí",
                        cancelText: "No",
                    }
                );
            const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
            if(!confirmacion){
                return
            }
            const response = await fetch(`${URL}/api/v1/admin/delete-user/${id}`, {method: "DELETE", credentials: "include" })
            const data = await response.json()
            
            if(data.code == 200){
                enqueueSnackbar(data.message, { variant: "success" });
                getAllUsers()
            }else{
                enqueueSnackbar(data.message, { variant: "error" });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const usuariosFiltrados = usuarios.filter((u) => u.id_rol !== 5)
    console.log(usuariosFiltrados);
    return (

    <>  
        
        <div className="flex flex-col justify-center items-center">
            <div className="flex justify-end w-full">
                <div className=" ">
                    <CreateButton  setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal}  />
                </div>
            </div>
            {usuariosFiltrados && (<table className="w-[50%] divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden mb-6 p-4 ">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                            Rol
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                            Cargo
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                            Fecha Registro
                        </th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                            <div className="flex justify-center">
                                <FaEdit fill="#FBBF24" className="text-xl" />
                            </div>
                        </th>

                        <th className="px-6 py-3 items-center text-sm font-medium text-gray-600 uppercase tracking-wider">
                            <div className="flex justify-center">
                                <MdDelete fill="#cd0805" className="text-xl"/>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {usuariosFiltrados.map((user) => (
                        <tr key={user.id_usuario} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                {user.nombre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                {user.cargo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                {user.rol}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                {user.created_at}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800">
                                <div className="flex justify-center items-center min-h-full">
                                    <button className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-md  transition duration-200 ease-in-out transform hover:scale-105"
                                    onClick={()=> handleUpdateClick(user.id_usuario)}
                                    >
                                        Modificar
                                    </button>
                                </div>
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-800">
                                <div className="flex justify-center items-center min-h-full">
                                    <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-105"
                                    onClick={() => handleDeleteClick(user.id_usuario)}
                                        >
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>)}
        </div>
    </>
  )
}
