import { useState } from "react";
import { useSnackbar } from "notistack";
import { getFileExtension } from "../../../../utils/validators";
import { Bpmn } from "../../../../components/Bpnm";

export default function ModalFlujo({ isOpen, closeModal }) {
    const { enqueueSnackbar } = useSnackbar();
    const [seleccion, setSeleccion] = useState("");
    const [formFlujo, setFormFlujo] = useState({
        nombre: "",
        descripcion: "",
        archivo: null,
    });

    const [error, setError] = useState({
        archivo: false,
    });

    const handleRadioChange = (e) => {
        setSeleccion(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormFlujo({
                ...formFlujo,
                [name]: files[0],
            });
        } else {
            setFormFlujo({
                ...formFlujo,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const extension = getFileExtension(formFlujo.archivo);
        if (extension !== "bpmn") {
            setError({ archivo: true });
            return;
        }
        const formData = new FormData();
        formData.append("nombre", formFlujo.nombre);
        formData.append("descripcion", formFlujo.descripcion);
        if (formFlujo.archivo) {
            formData.append("archivo", formFlujo.archivo);
        }

        enqueueSnackbar("Flujo agregado Exitosamente", {
            variant: "success",
        });
        closeModal();
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen ">
            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className={`bg-white p-6 rounded-lg shadow-lg w-1/4 h-3/7 ${seleccion === "crear" ? "w-1/2" : "w-1/4"}`}>
                        <h2 className="text-2xl font-bold text-center mb-6">
                            Crear Flujo
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
                                        value={formFlujo.nombre}
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
                                        value={formFlujo.descripcion}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">
                                    Selecciona una opción:
                                </label>
                                <div className="flex items-center space-x-4 ">
                                    <label>
                                        <input
                                            type="radio"
                                            name="opcion"
                                            value="importar"
                                            onChange={handleRadioChange}
                                            checked={seleccion === "importar"}
                                        />
                                        Importar Flujo
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="opcion"
                                            value="crear"
                                            onChange={handleRadioChange}
                                            checked={seleccion === "crear"}
                                        />
                                        Crear Nuevo Flujo
                                    </label>
                                </div>
                            </div>

                            {/* Mostrar campo de archivo solo si "crear" es seleccionado */}
                            {seleccion === "importar" && (
                                <div className="mb-4">
                                    <label
                                        htmlFor="archivo"
                                        className="block text-gray-700"
                                    >
                                        Selecciona un archivo (bpmn)
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="file"
                                            name="archivo"
                                            id="archivo"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#10644C]"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {error.archivo && (
                                        <span className="text-red-600 font-semibold text-sm">
                                            Solo puedes cargar archivos con
                                            extensión bpmn
                                        </span>
                                    )}
                                </div>
                            )}

                            {
                            seleccion === "crear" && 
                            <div className="overflow-y-auto max-h-[400px] w-full">
                                <Bpmn />
                            </div>
                            }

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
                                    Agregar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
