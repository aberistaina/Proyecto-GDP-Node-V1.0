import { useState} from "react";
import { useSnackbar } from "notistack";

export const ModalSubproceso = ({ isOpen, closeModal }) => {

    const { enqueueSnackbar } = useSnackbar();
    const [formSubproceso, setFormSubproceso] = useState({
        nombre: "",
        descripcion: ""
    });

    const handleChange = (e) => {
        setFormSubproceso({ ...formSubproceso, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        enqueueSnackbar("Subproceso creado Exitosamente", { variant: "success" });
        closeModal()

    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 h-3/7">
                        <h2 className="text-2xl font-bold text-center mb-6">
                            Crear Subproceso
                        </h2>
                        <form>
                            <div className="mb-4 ">
                                <label
                                    htmlFor="nombre"
                                    className="block text-gray-700"
                                >
                                    Nombre
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        name="nombre"
                                        id="nombre"
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                                        required
                                        onChange={handleChange}
                                        value={formSubproceso.nombre}
                                    />
                                </div>
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
                                        value={formSubproceso.descripcion}
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
}
