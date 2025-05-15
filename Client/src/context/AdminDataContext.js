import { createContext, useContext } from "react";

export const AdminDataContext = createContext();
export const useAdminData = () => useContext(AdminDataContext);


