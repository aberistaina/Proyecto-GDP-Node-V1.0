import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useAdminData } from "../../../../../context/AdminDataContext";
import { useConfirmAlert } from "../../../../../context/ConfirmAlertProvider";
import { useSnackbar } from "notistack";
import { CreateButton } from "./CreateButton";
import {  handleUpdateClick, handleDeleteClick, getAllRoles } from "../../../../../utils/adminFetch";

export const Roles = ({setIsOpenCreateUpdateModal}) => {

    const { roles, setModo, setID, type, getAllRoles } = useAdminData();
    const { confirm } = useConfirmAlert();
    const { enqueueSnackbar } = useSnackbar();



  return (
    <>
            
            <div className="flex flex-col justify-center items-center">
                <div className="w-[50%]">
                    <CreateButton setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal}  />
                </div>
                <table className="w-[50%] divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden mb-6 p-4">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                Nombre
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
                        {roles.map((rol) => (
                            <tr key={rol.id_rol} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {rol.nombre}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    <div className="flex justify-center items-center min-h-full">
                                        <button className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-md  transition duration-200 ease-in-out transform hover:scale-105"
                                        onClick={() => handleUpdateClick(setModo, setIsOpenCreateUpdateModal, rol.id_rol, setID)}
                                        >
                                            Modificar
                                        </button>
                                    </div>
                                </td>
    
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    <div className="flex justify-center items-center min-h-full">
                                        <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-105" 
                                        onClick={()=> handleDeleteClick(rol.id_rol, enqueueSnackbar, type, getAllRoles, confirm)}
                                            >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
  )
}
