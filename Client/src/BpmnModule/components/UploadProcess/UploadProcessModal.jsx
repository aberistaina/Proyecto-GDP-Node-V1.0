import { useState, useRef, useEffect } from "react";
import { useSnackbar } from "notistack";
import { FaUpload, FaFileUpload, FaProjectDiagram } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { TiGroup } from "react-icons/ti";
import { useBpmnContext } from "../../context/useBpmnContext";
import { useSelector } from "react-redux";

export const UploadProcessModal = ({ setShowModal }) => {
    const { enqueueSnackbar } = useSnackbar();
    const fileInputRef = useRef(null);
    const { setRefreshProcess } = useBpmnContext();
    const user = useSelector((state) => state.auth.user);

    const [files, setFiles] = useState([]);
    const [aprobadores, setAprobadores] = useState([]);
    const [niveles, setNiveles] = useState([]);
    const [nivelSeleccionado, setnivelSeleccionado] = useState([]);
    const [aprobadorSeleccionado, setAprobadorSeleccionado] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const loggedUser = user.usuario?.id_usuario
            const form = new FormData();
            files.forEach((file) => form.append("archivos", file));
            form.append("id_creador", loggedUser);
            form.append("id_aprobador", aprobadorSeleccionado);
            form.append("id_nivel", nivelSeleccionado);

            const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;

            const response = await fetch(
                `${URL}/api/v1/admin/upload-process`,
                {
                    method: "POST",
                    body: form,
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (data.code === 201) {
                enqueueSnackbar(data.message, { variant: "success" });
                setFiles([]);
                setRefreshProcess(true);
                setShowModal(false);
            } else {
                enqueueSnackbar(data.message, { variant: "error" });
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Error al cargar los procesos", {
                variant: "error",
            });
        }
    };

    useEffect(() => {
        const getAprobadores = async () => {
            try {
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;

                const response = await fetch(
                    `${URL}/api/v1/aprobadores/get-all`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const data = await response.json();

                if (data.code === 200) {
                    setAprobadores(data.data);
                } else {
                    enqueueSnackbar(data.message, { variant: "error" });
                }
            } catch (error) {
                console.error(error);
                enqueueSnackbar("Error al cargar los aprobadores", {
                    variant: "error",
                });
            }
        };
        getAprobadores();
    }, []);

    useEffect(() => {
        const getNiveles = async() => {
            try {
                
                const URL =
                import.meta.env.VITE_APP_MODE === "desarrollo"
                    ? import.meta.env.VITE_URL_DESARROLLO
                    : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(`${URL}/api/v1/procesos/get-niveles`, {credentials: "include"})
                const data = await response.json()
                setNiveles(data.data)
            } catch (error) {
                console.log(error)
            }
        }
        getNiveles()
    }, [])

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">
                        Cargar Procesos BPMN
                    </h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-red-600 hover:text-red-800 text-xl"
                    >
                        <IoMdCloseCircle />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
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

                    {/* Dropdown de Aprobador */}
                    <div className="flex items-center space-x-4">
                        <TiGroup />
                        <select
                            name="aprobador"
                            value={aprobadorSeleccionado.id_aprobador}
                            onChange={(e) =>
                                setAprobadorSeleccionado(e.target.value)
                            }
                            className="flex w-full px-4 py-2 border border-gray-400 rounded-lg shadow-sm bg-white"
                        >
                            <option value="">
                                -- Selecciona los aprobadores --
                            </option>
                            {aprobadores.map((aprobador) => (
                                <option key={aprobador.id_aprobador} value={aprobador.id_aprobador}>
                                    {aprobador.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dropdown de Niveles */}
                    <div className="flex items-center space-x-4">
                        <FaProjectDiagram />
                        <select
                            name="nivel"
                            value={nivelSeleccionado.id_nivel}
                            onChange={(e) =>
                                setnivelSeleccionado(e.target.value)
                            }
                            className="flex w-full px-4 py-2 border border-gray-400 rounded-lg shadow-sm bg-white"
                        >
                            <option value="">
                                -- Selecciona un Tipo De Proceso --
                            </option>
                            {niveles.map((nivel) => (
                                <option key={nivel.id_nivel} value={nivel.id_nivel}>
                                    {nivel.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-800"
                        >
                            Cargar Procesos
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
