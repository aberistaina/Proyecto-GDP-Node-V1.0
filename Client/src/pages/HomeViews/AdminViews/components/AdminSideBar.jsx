import { useAdminData } from "../../../../context/AdminDataContext";

export const AdminSideBar = ({usuario}) => {
    const { setType, type} = useAdminData();
    const secciones = [
  { id: "usuarios", label: "Usuarios" },
  ...(usuario?.id_rol === 5 ? [{ id: "rol", label: "Roles" }] : []),
  { id: "cargo", label: "Cargos" },
  { id: "nivel", label: "Niveles" },
  { id: "aprobadores", label: "Aprobadores" },
  { id: "opciones", label: "Opciones Admin" }
];



  return (
    <aside className="w-64 p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Configuración</h2>
      <nav className="flex flex-col gap-2">
        {secciones.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setType(sec.id)}
            className={`text-left px-3 py-2 min-w-[135px] max-w-[135px] rounded-lg transition-all font-medium text-sm ${
              type === sec.id
                ? "bg-[#99CC33] text-white"
                : "hover:bg-[#F5FAEA] hover:text-[#99CC33] hover:scale-105 transition duration-300 ease-in-out"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};
