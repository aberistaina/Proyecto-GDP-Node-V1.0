import { useAdminData } from "../../../../context/AdminDataContext";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";



export const ModalUpdateVersion = ({ setOpenModalVersion, getVersions, setVersiones }) => {


    const { version, id } = useAdminData();
    const [ versionData, setVersionData ] = useState()
    const { enqueueSnackbar } = useSnackbar()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVersionData({
            ...versionData,
            [name] : value,
        });
    };

    const handleClick = async() =>{
        try {
            const formData = new FormData()
            formData.append("observacion", versionData.observacion)
            formData.append("estado", versionData.estado)
            
            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION
            
            const requestOptions = {
                method: "PUT",
                credentials: "include",
                body: formData
            }

            const response = await fetch(`${URL}/api/v1/admin//update-version/${version}`, requestOptions )
            const data = await response.json()

            if(data.code === 200){
                enqueueSnackbar("Versión Modificada correctamente", { variant: "success" });
                getVersions(id, setVersiones)
                setOpenModalVersion(false)
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

                const response = await fetch(`${URL}/api/v1/admin/get-version-data/${version}`, {credentials: "include"})
                const data = await response.json()
                setVersionData(data.data)
            } catch (error) {
                console.log(error);
            }
        }
        getProcessData()
    }, [])
    

    return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                { versionData && (
                    <div className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">

                    <h2 className="text-center text-xl">Actualizar Versión</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="nombre_version" className="block text-gray-700">
                                Versión
                            </label>
                            <input
                                name="nombre_version"
                                type="text"
                                value={versionData.nombre_version}
                                disabled
                                className="mt-1 block w-full border border-gray-300 bg-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="observacion" className="block text-gray-700">
                                Observación
                            </label>
                            <textarea
                                name="observacion_version"
                                type="text"
                                value={versionData.observacion_version}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C] resize-y"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="rol" className="block text-gray-700">
                                Estado
                            </label>
                            <select
                                name="estado"
                                value={versionData.estado}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                                required
                            >
                                <option value="borrador">Borrador</option>
                                <option value="enviado">Enviado</option>
                                <option value="aprobado">Aprobado</option>
                                <option value="eliminado">Eliminado</option>
                                <option value="inactivo">Inactivo</option>
                                <option value="rechazado">Rechazado</option>
        
                            </select>
                        </div>

                        </form>
                        <div className="flex justify-center space-x-4">
                                <button
                                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                    onClick={() => setOpenModalVersion(false)}
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

