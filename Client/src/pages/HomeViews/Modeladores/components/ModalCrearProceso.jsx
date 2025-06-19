import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom"
import { validarDatosProceso } from "../../../../utils/validators";

export const ModalCrearProceso = ({ isOpen, closeModal }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [aprobadores, setAprobadores] = useState([]);
    const [niveles, setNiveles] = useState([]);
    const [formProceso, setFormProceso] = useState({
        nombre: "",
        descripcion: "",
        aprobadores: "",
        macroproceso: false,
        nivel: ""
    });
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormProceso({
            ...formProceso,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        try {
            validarDatosProceso(formProceso)
            e.preventDefault();
            sessionStorage.setItem("datos", JSON.stringify(formProceso));
            navigate("/bpmnModeler")
        } catch (error) {
            enqueueSnackbar(error.message, { variant: "error" })
            console.log(error);
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
                    `${URL}/api/v1/aprobadores/get-all`, {credentials: "include"}
                );
                const data = await response.json();
                setAprobadores(data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getAprobadores();
    }, []);

    useEffect(() => {
        const getNiveles = async () => {
            try {
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;
                const response = await fetch(
                    `${URL}/api/v1/niveles/get-niveles`, {credentials: "include"}
                );
                const data = await response.json();
                setNiveles(data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getNiveles();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 h-3/7">
                        <h2 className="text-2xl font-bold text-center mb-6">
                            Crear Proceso
                        </h2>
                        <form onSubmit={handleSubmit}>
                            
                            <div className="mb-4 ">
                                <label
                                    htmlFor="nombre"
                                    className="block text-gray-700"
                                >
                                    Nombre Proceso
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        name="nombre"
                                        id="nombre"
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                                        required
                                        onChange={handleChange}
                                        value={formProceso.nombre}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Nivel
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    name="nivel"
                                    value={formProceso.nivel}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Seleccionar Nivel
                                    </option>
                                    {niveles.map((nivel) => (
                                        <option
                                            key={nivel.id_nivel}
                                            value={nivel.id_nivel}
                                        >
                                            {nivel.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Aprobadores
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    name="aprobadores"
                                    value={formProceso.aprobadores}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Seleccionar Aprobadores
                                    </option>
                                    {aprobadores.map((aprobador) => (
                                        <option
                                            key={aprobador.id_cargo}
                                            value={aprobador.id_cargo}
                                        >
                                            {aprobador.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4 ">
                                <label
                                    htmlFor="descripcion"
                                    className="block text-gray-700"
                                >
                                    Descripción
                                </label>
                                <div className="flex items-center space-x-2">
                                    <textarea
                                        type="text"
                                        name="descripcion"
                                        id="descripcion"
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                                        required
                                        onChange={handleChange}
                                        value={formProceso.descripcion}
                                    />
                                </div>
                            </div>

                            <div className="mb-4 flex gap-4">
                                <label
                                    htmlFor="macroproceso"
                                    className="text-gray-700"
                                >
                                    Es Macroproceso
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="macroproceso"
                                        id="macroproceso"
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        required
                                        onChange={(e) =>
                                            setFormProceso({ ...formProceso, macroproceso: e.target.checked })
                                        }
                                        checked={formProceso.macroproceso}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={closeModal}
                                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Cerrar
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
