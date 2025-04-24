import { useEffect } from "react";
import { useBpmnContext } from "../context/useBpmnContext";

export const MenuContextListener = ({ processID }) => {
    const { bpmnModelerRef, setOpenMenuContextual, emptyDiagram  } = useBpmnContext();

    useEffect(() => {
        if (!bpmnModelerRef.current) return;

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
