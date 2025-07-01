import { Usuarios } from "./sections/Usuarios";
import { Roles } from "./sections/Roles";
import { Cargos } from "./sections/Cargos";
import { Niveles } from "./sections/Niveles";
import { useAdminData } from "../../../../context/AdminDataContext";
import Opciones from "./sections/Opciones";
import { Procesos } from "./sections/Procesos";
import { useState } from "react";
import { Versiones } from "./sections/Versiones";



export const AdminSections = ({ setIsOpenCreateUpdateModal, setOpenModalProcess, setOpenModalVersion, setModo, modo, getVersions, versiones, setVersiones}) => {
    const { type } = useAdminData();
    

  return (
    <section className="p-6">
        {type === "usuarios" && <Usuarios  setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal} />}
        {type === "rol" && <Roles setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal} />}
        {type === "cargo" && <Cargos setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal} />}
        {type === "nivel" && <Niveles setIsOpenCreateUpdateModal={setIsOpenCreateUpdateModal} />}
        {type === "aprobadores" && <p>Gestión de Aprobadores</p>}
        {type === "procesos" && modo === "proceso" && (<Procesos setOpenModalProcess={setOpenModalProcess} setModo={setModo} />)}
        {type === "procesos" && modo === "version" && (<Versiones getVersions={getVersions} setModo={setModo} setOpenModalVersion={setOpenModalVersion} versiones={versiones} setVersiones={setVersiones} />)}
      {type === "opciones" && <Opciones />}
    </section>
  );
};

