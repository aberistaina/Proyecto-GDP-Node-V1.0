import { createContext, useContext } from "react";

export const ModelerContext = createContext(null);
export const useModeler = () => useContext(ModelerContext);