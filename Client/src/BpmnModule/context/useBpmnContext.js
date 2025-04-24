import { useContext } from "react";
import { BpmnContext } from "./BpmnContext";

export const useBpmnContext = () => useContext(BpmnContext);
