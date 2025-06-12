import { useEffect } from "react";
import { useBpmnContext } from "../context/useBpmnContext";

//Elementos del Contexto del Menu Contextual para vincular procesos (Identifica el elemento al que se le hizo click para poder vincularlo con su subproceso solo si este es un tipo callactivity)
export const MenuContextListener = ({ processID }) => {
    const { bpmnModelerRef, setOpenMenuContextual, emptyDiagram  } = useBpmnContext();

    useEffect(() => {
        if (!bpmnModelerRef.current) return;
        console.log("Setting up event listeners...")

        const eventBus = bpmnModelerRef.current.get("eventBus");

        const handleContextMenu = (event) => {

            const { element, originalEvent } = event;
            const tipo = element.businessObject?.$type;

            if (tipo === "bpmn:CallActivity") {
                originalEvent.preventDefault();

                const callActivity = element.businessObject.id;
                const calledElement = element.businessObject.calledElement;
                const processID = element.businessObject.$parent.id;

                setOpenMenuContextual({
                    state: true,
                    x: originalEvent.clientX,
                    y: originalEvent.clientY,
                    processID,
                    subProcessId: calledElement,
                    callActivity
                });

                const handleOutsideClick = (e) => {
                    const menu = document.getElementById("menu-contextual");
                    if (menu && !menu.contains(e.target)) {
                        setOpenMenuContextual({ state: false });
                        document.removeEventListener(
                            "click",
                            handleOutsideClick
                        );
                    }
                };

                document.addEventListener("click", handleOutsideClick);
            }
        };

        const handleImportDone = () => {
            eventBus.on("element.contextmenu", handleContextMenu);
        };
        
        eventBus.on("import.done", handleImportDone);

        // Limpieza
        return () => {
            eventBus.off("element.contextmenu", handleContextMenu);
            eventBus.off("import.done", handleImportDone);
        };
    }, [bpmnModelerRef, processID, setOpenMenuContextual, emptyDiagram]);

    return null;
};
