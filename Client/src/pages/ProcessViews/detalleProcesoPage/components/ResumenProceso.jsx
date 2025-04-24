import { IoDocumentTextSharp } from "react-icons/io5";

//Subprocesos, responsables, tiempo sla poner links a subprocesos
const resumen = [
    {
        titulo: "Subproceso",
        items: [
            "Hunting",
            "Selección Técnico Profesional",
            "Selección de operarios",
        ],
        color: "border-l-[6px] border-yellow-500",
    },
    {
        titulo: "Depto. Gestión de talento",
        items: [
            "Jefe GT",
            "Supervisor de Selección",
            "Analista de Selección",
            "Consultor Interno",
        ],
        color: "border-l-[6px] border-green-600",
    },
    {
        titulo: "Objetivos",
        items: [
            "Buscar y seleccionar personas para las vacantes de cargos disponibles dentro de la organización.",
        ],
        color: "border-l-[6px] border-teal-500",
    },
    {
        titulo: "Actividad",
        items: [
            "Contactar cliente",
            "Registrar cliente",
            "Validar datos de cliente",
            "Notificar al cliente",
        ],
        color: "border-l-[6px] border-blue-800",
    },
    {
        titulo: "Tiempo de ejecución",
        items: [
            "Inicio del proceso: 0 días",
            "Duración promedio: 1 día hábil",
            "Finalización estimada: 0 días posteriores a aprobación",
        ],
        color: "border-l-[6px] border-pink-600",
    },
    {
        titulo: "TIE (Tiempo Inversión Esfuerzo)",
        items: [
            "Baja inversión de tiempo",
            "Moderado esfuerzo operativo",
            "Automatizable en un 70%",
        ],
        color: "border-l-[6px] border-sky-500",
    },
];
export const ResumenProceso = () => {
    return (
        <div className="bg-[#ececec] rounded-lg drop-shadow-lg py-5 px-5 mb-8 shadow-[6px_6px_4px_#c0c0c0]">
            <div className="flex space-x-3 mb-4 ms-4 items-center ">
                <IoDocumentTextSharp fill="#666666" className="text-2xl" />
                <h1 className="text-xl">Resumen</h1>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 mb-2">
                {resumen.map((seccion, index) => (
                    <div
                        key={index}
                        className={`min-w-64 bg-gray-200 rounded-lg p-4 ${seccion.color}`}
                    >
                        <h3 className="text-lg font-semibold border-b border-gray-400 mb-2">
                            {seccion.titulo}
                        </h3>
                        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                            {seccion.items.map((item, i) => (
                                <li key={i} className={i === 0 ? "italic" : ""}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};
