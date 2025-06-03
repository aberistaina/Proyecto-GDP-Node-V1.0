import { useRef, useState } from "react";
import { BpmnContext } from "./BpmnContext";
import { generateTemplate } from "../utils/templateXML";

//Elementos del Contexto del modelador y visualizador BPMN
export const BpmnProvider = ({ children }) => {
    const bpmnModelerRef = useRef(null);
    const containerRef = useRef(null);

    const { template } = generateTemplate();
    const [emptyDiagram, setEmptyDiagram] = useState(template);
    const [refreshProcess, setRefreshProcess] = useState(false);
    const [ selectedProcess, setSelectedProcess ] = useState("");


    const [openMenuContextual, setOpenMenuContextual] = useState({
        state: false,
        x: 0,
        y: 0,
        processID: "",
        subProcessId: "",
        isCallActivity: false,
      });
      

    return (
        <BpmnContext.Provider
            value={{
                bpmnModelerRef,
                containerRef,
                emptyDiagram,
                setEmptyDiagram,
                template,
                openMenuContextual,
                setOpenMenuContextual,
                refreshProcess,
                setRefreshProcess,
                selectedProcess,
                setSelectedProcess,
            }}
        >
            {children}
        </BpmnContext.Provider>
    );
};
