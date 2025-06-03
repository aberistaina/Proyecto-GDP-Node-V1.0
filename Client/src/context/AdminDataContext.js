import { createContext, useContext } from "react";

//Contexto Panel De Administración
export const AdminDataContext = createContext();
export const useAdminData = () => useContext(AdminDataContext);


