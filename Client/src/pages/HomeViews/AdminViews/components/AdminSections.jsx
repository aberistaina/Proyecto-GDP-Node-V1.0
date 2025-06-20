import { Usuarios } from "./sections/Usuarios";
import { Roles } from "./sections/Roles";
import { Cargos } from "./sections/Cargos";
import { Niveles } from "./sections/Niveles";
import { useAdminData } from "../../../../context/AdminDataContext";
import Opciones from "./sections/Opciones";



export const AdminSections = ({ setIsOpenCreateUpdateModal}) => {
    const { type } = useAdminData();

  return (
    <section className="p-6">
      {type === "usuarios" && <Usuarios  setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal} />}
      {type === "rol" && <Roles setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal} />}
      {type === "cargo" && <Cargos setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal} />}
      {type === "nivel" && <Niveles setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal} />}
      {type === "aprobadores" && <p>Gestión de Aprobadores</p>}
      {type === "opciones" && <Opciones />}
    </section>
  );
};

