import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle  } from "react-icons/fa";

const niveles = [
    { id: 1, nombre: "Estratégico" },
    { id: 2, nombre: "Operativo" },
    { id: 3, nombre: "Soporte" },
];

export default function PanelVisualizador({ procesos }) {
    const [nivelSeleccionado, setNivelSeleccionado] = useState(1);
    console.log(procesos);

    const procesosFiltrados = procesos.filter(
        (proceso) => proceso.id_nivel === nivelSeleccionado
    );

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Procesos Aprobados</h2>

            <div className="flex gap-4 mb-4">
                {niveles.map((nivel) => (
                    <button
                        key={nivel.id}
                        className={`px-4 py-2 rounded-md border ${
                            nivelSeleccionado === nivel.id
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setNivelSeleccionado(nivel.id)}
                    >
                        {nivel.nombre}
                    </button>
                ))}
            </div>

            {procesosFiltrados.length === 0 ? (
                <p className="text-gray-500">
                    No hay procesos aprobados en este nivel.
                </p>
            ) : (
                <div className="bg-white shadow rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                    Nombre del Proceso
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                    Versión
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                    Creador
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                    Macroproceso
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                    Acción
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {procesosFiltrados.map((proceso) => (
                                <tr key={proceso.id}>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {proceso.nombre}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <p className="ms-3">{proceso.nombre_version}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {proceso.creador}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600  ">
                                        {proceso.macroproceso ? 
                                        <FaCheckCircle className="ext-center text-xl ms-8 text-green-400" />
                                        :
                                        <FaTimesCircle className="text-center text-xl ms-8 text-red-400" />
                                    }
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link to={`/process-details/${proceso.id_bpmn}/${proceso.version}`} className="text-green-600 hover:underline text-sm">
                                            Ver Detalles
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
