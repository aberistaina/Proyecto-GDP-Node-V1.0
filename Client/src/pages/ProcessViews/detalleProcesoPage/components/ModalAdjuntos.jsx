import { useState, useRef } from "react";
import { FaUpload, FaFileUpload } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";

export const ModalAdjuntos = ({ setOpenModalAdjuntos, idProceso, version }) => {
    const { enqueueSnackbar } = useSnackbar();
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [ loading, setLoading ] = useState(false)
    const user = useSelector((state) => state.auth.user);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    const removeFile = (index) => {
        const nuevosArchivos = files.filter((_, i) => i !== index);
        setFiles(nuevosArchivos);
        if (fileInputRef.current) {
            const newFileList = new DataTransfer();
            nuevosArchivos.forEach((file) => newFileList.items.add(file));
            fileInputRef.current.files = newFileList.files;
        }
    };

    const handleClick = async () => {
        try {
            setLoading(true)

            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;

            const loggedUser = user.usuario?.id_usuario;

            const formData = new FormData();
            
            files.forEach((file) => formData.append("archivos", file));
            formData.append("idProceso", idProceso);
            formData.append("id_usuario", loggedUser);
            formData.append("version", version);

            const requestOptions = {
                method: "POST",
                body: formData,
                credentials: "include"
            };

            const response = await fetch(`${URL}/api/v1/adjuntos/cargar-adjuntos`, requestOptions);
            const data = await response.json();

            if (data.code === 201) {
                enqueueSnackbar(data.message, { variant: "success" });
                setOpenModalAdjuntos(false);
                setLoading(false)
            } else {
                enqueueSnackbar(data.message, { variant: "error" });
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6">
                <h2 className="text-2xl font-semibold mb-4">Archivos Adjuntos</h2>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">
                            Carga de archivo
                        </label>
                        <div className="flex items-center space-x-4 mb-6">
                            <FaUpload />
                            <input
                                type="file"
                                name="archivos"
                                multiple
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="flex w-full px-4 py-2 border border-gray-400 rounded-lg shadow-sm"
                            />
                        </div>
                    </div>

                <div className="mb-4">
                    {files.length > 0 && (
                        <ul className="bg-gray-100 border p-2 rounded-lg space-y-2 max-h-40 overflow-auto">
                            {files.map((file, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center px-2 py-1 bg-white rounded shadow"
                                >
                                    <FaFileUpload />
                                    <span className="truncate max-w-xs">
                                        {file.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <IoMdCloseCircle size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setOpenModalAdjuntos(false)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
                        onClick={handleClick}
                        disabled={loading}
                    >
                        {loading ? (
                        <PulseLoader color="#ffffff" size={10} />
                    ) : (
                        "Guardar"
                    )}
                    </button>
                </div>
            </div>
        </div>
    );
}
