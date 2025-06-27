import { useState, useEffect } from "react";
import { FaFileDownload } from "react-icons/fa";
import { useSnackbar } from "notistack";
import { downloadFile } from "../../../../BpmnModule/utils/downloadFile";

export const  ModalArchivos = ({
    setOpenModalArchivos,
    version,
    idComentario, 
    menu,
    setMenu
}) => {
    const [archivos, setArchivos] = useState([]);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleClick = async(fileName) =>{

            try {
                setLoading(true);
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(`${URL}/api/v1/procesos/download-files/${fileName}`, {credentials: "include"})
    
                if (!response.ok){
                    enqueueSnackbar("Hubo un problema al intentar descargar el archivo, intente nuevamente más tarde", { variant: "error" });
                }else{
                    enqueueSnackbar("La descarga ha comenzado", { variant: "success" });
                    setLoading(false);
                }
    
                const nombreArchivo = `${fileName}`
    
                await downloadFile(response, nombreArchivo)
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }

    const closeModal = () =>{
        setMenu("")
        setOpenModalArchivos(false)
    }
    useEffect(() => {
        const getArchivos = async () => {
            try {
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
                let response;
                if(menu === "comentarios"){
                    response = await fetch(`${URL}/api/v1/comentarios/get-files/${idComentario}`, {credentials: "include"});
                }else if(menu === "oportunidades"){
                    response = await fetch(`${URL}/api/v1/oportunidades/get-files/${idComentario}`,{credentials: "include"});
                }else{
                    response = await fetch(`${URL}/api/v1/adjuntos/get-files/${version}`,{credentials: "include"})
                    
                }
                
                const data = await response.json();
                setArchivos(data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getArchivos();
    }, []);



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">Archivos</h2>

                <div>
                    <table className="min-w-full table-auto text-sm text-left text-gray-700 mb-4">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Nombre</th>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">Descargar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {archivos &&
                                archivos.map((archivo) => (
                                    <tr
                                        key={archivo.id_archivo}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-2 text-gray-600">
                                            {archivo.nombre}
                                        </td>
                                        <td className="px-4 py-2 text-gray-600">
                                            {archivo.created_at}
                                        </td>
                                        <td className="px-4 flex justify-center py-2 text-green-700 cursor-pointer ">
                                            <button disabled={loading} className="hover:text-green-800">
                                                <FaFileDownload  className="text-xl" onClick={() => handleClick(archivo.nombre)}/>
                                            </button>
                                        </td>
                                        
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={closeModal}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
