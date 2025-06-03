
//Popup que se levanta en el visualizador al hacer click en algún elemento, muestra la descripción de este
export const PopupDescripcion = ({ elementoSeleccionado, onClose }) => {
    if (!elementoSeleccionado) return null;
    const limpiarHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
        };

    const { descripcion, propiedades, tipo } = elementoSeleccionado;

    const esTarea = tipo?.includes("bpmn:Task");


    const hayResponsabilidades =
        propiedades?.ejecutantes ||
        propiedades?.responsable ||
        propiedades?.consultado ||
        propiedades?.informado;

    return (
        <div className="fixed bottom-8 right-8 max-w-md w-full bg-white border border-cyan-300 rounded-xl shadow-lg p-6 text-sm text-gray-800 z-50">
            {/* Botón cerrar */}
            <div className="flex justify-end -mt-4 -mr-4">
                <button
                    onClick={onClose}
                    className="text-cyan-500 hover:text-cyan-700 text-xl font-bold focus:outline-none"
                    aria-label="Cerrar panel"
                >
                    &times;
                </button>
            </div>

            {/* Descripción */}
            <div>
                <h2 className="text-lg font-bold text-cyan-700 mb-2">
                    📝 Descripción
                </h2>
                <p className="text-gray-700">
                    {limpiarHtml(descripcion) || "Sin descripción disponible"}
                </p>
            </div>

            {/* Responsabilidades solo si es tarea */}
            {esTarea && (
                <>
                    <hr className="my-4 border-cyan-200" />
                    <div>
                        <h2 className="text-lg font-bold text-cyan-700 mb-2">
                            👥 Responsabilidades
                        </h2>
                        {hayResponsabilidades ? (
                            <ul className="space-y-1">
                                {propiedades.ejecutantes && (
                                    <li>
                                        <span className="font-medium text-cyan-800">
                                            Ejecutantes:
                                        </span>{" "}
                                        {propiedades.ejecutantes}
                                    </li>
                                )}
                                {propiedades.responsable && (
                                    <li>
                                        <span className="font-medium text-cyan-800">
                                            Responsable:
                                        </span>{" "}
                                        {propiedades.responsable}
                                    </li>
                                )}
                                {propiedades.consultado && (
                                    <li>
                                        <span className="font-medium text-cyan-800">
                                            Consultado:
                                        </span>{" "}
                                        {propiedades.consultado}
                                    </li>
                                )}
                                {propiedades.informado && (
                                    <li>
                                        <span className="font-medium text-cyan-800">
                                            Informado:
                                        </span>{" "}
                                        {propiedades.informado}
                                    </li>
                                )}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">
                                No se han definido responsabilidades.
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
