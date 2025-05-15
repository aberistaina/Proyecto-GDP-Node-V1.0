import { useAdminData } from "../../../context/AdminDataContext";

export const AdminSideBar = () => {
    const { setType, type } = useAdminData();
    const secciones = [
        { id: "usuarios", label: "Usuarios" },
        { id: "rol", label: "Roles" },
        { id: "cargo", label: "Cargos" },
        { id: "nivel", label: "Niveles" },
        { id: "aprobadores", label: "Aprobadores" },
        { id: "opciones", label: "Opciones Admin" }
    ];

  return (
    <aside className="w-64 bg-white shadow-lg p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Configuración</h2>
      <nav className="flex flex-col gap-2">
        {secciones.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setType(sec.id)}
            className={`text-left px-3 py-2 rounded-lg transition-all font-medium text-sm ${
              type === sec.id
                ? "bg-[#6f42c1] text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};
