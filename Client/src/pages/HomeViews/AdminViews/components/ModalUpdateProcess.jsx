import { useAdminData } from "../../../../context/AdminDataContext";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";



export const ModalUpdateProcess = ({ setOpenModalProcess }) => {

    const { id, niveles, getAllProcess } = useAdminData();
    const [ proceso, setProceso ] = useState()
    const { enqueueSnackbar } = useSnackbar()

    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProceso({
        ...proceso,
        [name]: type === "checkbox" ? checked : name === "id_nivel" ? Number(value) : value,
    });
};

    const handleClick = async() =>{
        try {
            const formData = new FormData()
            formData.append("nombre", proceso.nombre)
            formData.append("descripcion", proceso.descripcion)
            formData.append("estado", proceso.estado)
            formData.append("nivel", proceso.id_nivel)
            formData.append("macroproceso", proceso.macroproceso)
            

            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION
            
            const requestOptions = {
                method: "PUT",
                credentials: "include",
                body: formData
            }

            const response = await fetch(`${URL}/api/v1/admin/update-proceso/${id}`, requestOptions )
            const data = await response.json()

            if(data.code === 200){
                enqueueSnackbar("Proceso Modificado correctamente", { variant: "success" });
                getAllProcess()
                setOpenModalProcess(false)
            }else{
                enqueueSnackbar("Hubo un error, intente nuevamente", { variant: "error" });
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const getProcessData = async() =>{
            try {
                const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION

                const response = await fetch(`${URL}/api/v1/admin/get-data-process/${id}`, {credentials: "include"})
                const data = await response.json()
                setProceso(data.data)
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
        getProcessData()
    }, [])
    

    return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                { proceso && (
                    <div className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">

                    <h2 className="text-center text-xl">Actualizar Proceso</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="nombre" className="block text-gray-700">
                                Nombre
                            </label>
                            <textarea
                                name="nombre"
                                type="text"
                                value={proceso.nombre}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">
                                Descripción
                            </label>
                            <textarea
                                name="email"
                                type="email"
                                value={proceso.descripcion}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C] resize-y"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="rol" className="block text-gray-700">
                                Nivel
                            </label>
                            {<select
                                name="id_nivel"
                                value={proceso.id_nivel}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                                required
                            >
                                {
                                    niveles?.map((nivel) =>(
                                        <option key={nivel.id_nivel} value={nivel.id_nivel}>{nivel.nombre}</option>
                                    ))
                                }
                                
                            </select>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="estado" className="block text-gray-700">
                                Estado
                            </label>
                            {<select
                                name="estado"
                                value={proceso.estado}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                                required>

                                <option value="borrador">Borrador</option>
                                <option value="activo">Activo</option>
                                <option value="archivado">Archivado</option>
                                    
                                
                            </select>}
                        </div>

                        <div className="mb-4 flex items-center">
                            <input
                                type="checkbox"
                                name="macroproceso"
                                checked={proceso.macroproceso}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <label htmlFor="macroproceso" className="text-gray-700">
                                ¿Es un Macroproceso?
                            </label>
                        </div>


                        </form>
                        <div className="flex justify-center space-x-4">
                                <button
                                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                    onClick={() => setOpenModalProcess(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={handleClick}
                                >
                                    Actualizar Proceso
                                </button>
                        </div>
                </div>
                )}
            </div>
)}

