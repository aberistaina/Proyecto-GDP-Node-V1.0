import { useState, useRef } from "react";
import { FaUpload, FaFileUpload } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

export default function ModalMejorasComentarios({ menu, setOpenModal, idProceso,version }) {
    const { enqueueSnackbar } = useSnackbar();
    const [comentario, setComentario] = useState("");
    const [asunto, setAsunto ] = useState("")
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
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
            const path =
                menu === "oportunidades"
                    ? "/api/v1/procesos/oportunidades/agregar"
                    : "/api/v1/procesos/comentarios/agregar";
            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;

            const loggedUser = user.usuario?.id_usuario
            

            const formData = new FormData();
            files.forEach((file) => formData.append("archivos", file));
            formData.append(menu === "oportunidades" ? "descripcion" : "comentario", comentario);
            formData.append("idProceso", idProceso)
            formData.append("id_usuario", loggedUser)
            formData.append("asunto", asunto)
            formData.append("version", version)

            const requestOptions = {
                method: "POST",
                body: formData
            };

            const response = await fetch(`${URL}${path}`, requestOptions);
            const data = await response.json();

            if (data.code === 201) {
                enqueueSnackbar(data.message, { variant: "success" });
                setOpenModal(false)

            } else {
                enqueueSnackbar(data.message, { variant: "error" });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6">
                <h2 className="text-2xl font-semibold mb-4">
                    {menu === "oportunidades"
                        ? "Agregar Opornunidad"
                        : "Agregar Comentario"}
                </h2>

                {menu === "oportunidades" && (
                    <div className="border border-lime-400 rounded p-2 mb-4">
                    <input
                        className="w-full outline-none"
                        type="text"
                        placeholder="Escriba el asunto"
                        value={asunto}
                        name="asunto"
                        onChange={(e) => setAsunto(e.target.value)}
                    />
                </div>
                )}

                <div className="border border-lime-400 rounded p-2 mb-4">
                    <textarea
                        className="w-full h-40 resize-y outline-none"
                        placeholder={
                            menu === "oportunidades"
                                ? "Escriba la descipción aquí"
                                : "Escriba su comentario aquí"
                        }
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                    />
                </div>

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
                        onClick={() => setOpenModal(false)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                    <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
                    onClick={handleClick}
                    
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
