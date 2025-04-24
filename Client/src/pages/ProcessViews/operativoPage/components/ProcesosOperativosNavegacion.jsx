import React from "react";

export const ProcesosOperativosNavegacion = ({
    vista,
    setVista,
    procesoSeleccionado,
}) => {
    return (
        <div className="text-sm text-gray-700 flex items-center space-x-2">
            {vista === "inicio" && (
                <span className="font-semibold text-gray-900">
                    Procesos Operativos
                </span>
            )}

            {vista === "macroprocesos" && (
                <>
                    <span
                        className="text-emerald-600 hover:underline cursor-pointer"
                        onClick={() => setVista("inicio")}
                    >
                        Procesos Operativos
                    </span>
                    <span className="text-gray-400">›</span>
                    <span className="font-semibold text-gray-900">
                        Macroprocesos
                    </span>
                </>
            )}

            {vista === "procesos" && (
                <>
                    <span
                        className="text-emerald-600 hover:underline cursor-pointer"
                        onClick={() => setVista("inicio")}
                    >
                        Procesos Operativos
                    </span>
                    <span className="text-gray-400">›</span>
                    <span
                        className="text-emerald-600 hover:underline cursor-pointer"
                        onClick={() => setVista("macroprocesos")}
                    >
                        Macroprocesos
                    </span>
                    <span className="text-gray-400">›</span>
                    <span className="font-semibold text-gray-900">
                        {procesoSeleccionado.nombre}
                    </span>
                </>
            )}

            {vista === "subprocesos" && (
                <>
                    <span
                        className="text-emerald-600 hover:underline cursor-pointer"
                        onClick={() => setVista("inicio")}
                    >
                        Procesos Operativos
                    </span>
                    <span className="text-gray-400">›</span>
                    <span
                        className="text-emerald-600 hover:underline cursor-pointer"
                        onClick={() => setVista("macroprocesos")}
                    >
                        Macroprocesos
                    </span>
                    <span className="text-gray-400">›</span>
                    <span
                        className="text-emerald-600 hover:underline cursor-pointer"
                        onClick={() => setVista("procesos")}
                    >
                        {procesoSeleccionado.nombre}
                    </span>
                    <span className="text-gray-400">›</span>
                    <span className="font-semibold text-gray-900">
                        Subprocesos
                    </span>
                </>
            )}
        </div>
    );
};
