import {  useState, useEffect, useContext } from "react";
import { AdminDataContext } from "./AdminDataContext";
import { getAllUsers, getAllRoles, getAllCargos, getAllNiveles, getAllProcess } from "../utils/adminFetch"

export const AdminDataProvider = ({ children }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [niveles, setNiveles] = useState([]);
    const [procesos, setProcesos] = useState([]);
    const [modo, setModo ] = useState("")
    const [type, setType ] = useState("usuarios")
    const [ id, setID ] = useState("")

  const URL =
    import.meta.env.VITE_APP_MODE === "desarrollo"
        ? import.meta.env.VITE_URL_DESARROLLO
        : import.meta.env.VITE_URL_PRODUCCION;

  useEffect(() => {
    getAllUsers(URL, setUsuarios);
    getAllRoles(URL, setRoles);
    getAllCargos(URL, setCargos);
    getAllNiveles(URL, setNiveles);
    getAllProcess(URL, setProcesos)
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        usuarios,
        roles,
        cargos,
        niveles,
        modo,
        procesos,
        setModo,
        type,
        setType,
        id,
        setID,
        getAllUsers: () => getAllUsers(URL, setUsuarios),
        getAllRoles: () => getAllRoles(URL, setRoles),
        getAllCargos: () => getAllCargos(URL, setCargos),
        getAllNiveles: () => getAllNiveles(URL, setNiveles),
        getAllProcess: () => getAllProcess(URL, setProcesos),
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};
