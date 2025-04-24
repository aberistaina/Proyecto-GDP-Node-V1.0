import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "../../css/color.css";
import { useEffect } from "react";
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
import { useBpmnContext } from "../../context/useBpmnContext";
import { createDiagram } from "../../utils/bpmnUtils";
import { useParams } from "react-router-dom";

export const ViewetInitializer = () => {
    const { bpmnModelerRef, containerRef, emptyDiagram, setEmptyDiagram, selectedProcess } =
        useBpmnContext();
    const { idSubproceso } = useParams();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        bpmnModelerRef.current = new BpmnViewer({
            container,
            contextPad: {
                autoPlace: false,
            },
        });

        const modeler = bpmnModelerRef.current;
        const eventBus = modeler.get("eventBus");
        const canvas = modeler.get("canvas");

        const markerMap = {
            "bpmn:StartEvent": "marker-start-event",
            "bpmn:EndEvent": "marker-end-event",
            "bpmn:IntermediateCatchEvent": "marker-intermediate-event",
            "bpmn:IntermediateThrowEvent": "marker-intermediate-event",
            "bpmn:BoundaryEvent": "marker-intermediate-event",

            "bpmn:ExclusiveGateway": "marker-exclusive-gateway",
            "bpmn:ParallelGateway": "marker-parallel-gateway",
            "bpmn:InclusiveGateway": "marker-inclusive-gateway",
            "bpmn:ComplexGateway": "marker-complex-gateway",
            "bpmn:EventBasedGateway": "marker-event-gateway",

            "bpmn:Task": "marker-task",
            "bpmn:UserTask": "marker-task",
            "bpmn:ManualTask": "marker-task",
            "bpmn:ServiceTask": "marker-service-task",
            "bpmn:ScriptTask": "marker-task",
            "bpmn:BusinessRuleTask": "marker-task",
            "bpmn:SendTask": "marker-task",
            "bpmn:ReceiveTask": "marker-task",

            "bpmn:CallActivity": "marker-call-activity",
            "bpmn:SubProcess": "marker-call-activity",
            "bpmn:AdHocSubProcess": "marker-call-activity",
            "bpmn:Transaction": "marker-call-activity"
        };


        eventBus.on("shape.added", function ({ element }) {
            const type = element.type;
            const marker = markerMap[type];

            if (marker) {
                canvas.addMarker(element.id, marker);
            }
        });

        const initDiagram = async () => {
            if (idSubproceso || selectedProcess) {
                try {
                    const requestOptions = {
                        method: "GET",
                    };
                    const URL =
                        import.meta.env.VITE_APP_MODE === "desarrollo"
                            ? import.meta.env.VITE_URL_DESARROLLO
                            : import.meta.env.VITE_URL_PRODUCCION;

                    const processId = idSubproceso ? idSubproceso : selectedProcess

                    const response = await fetch(
                        `${URL}/api/v1/procesos/get-process/${processId}`,
                        requestOptions
                    );

                    if (!response.ok) {
                        console.error("No se pudo cargar el subproceso");
                        return;
                    }

                    const data = await response.text();
                    setEmptyDiagram(data);
                    await createDiagram(bpmnModelerRef, data)
                } catch (error) {
                    console.log(error);
                }
            } else {
                await createDiagram(bpmnModelerRef, emptyDiagram);
            }
        };

        initDiagram();

        return () => {
            bpmnModelerRef.current?.destroy();
        };
    }, [containerRef, bpmnModelerRef, emptyDiagram, idSubproceso]);

    return null;
};
