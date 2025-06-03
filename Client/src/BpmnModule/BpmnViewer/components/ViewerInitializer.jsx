import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "../../css/color.css";
import { useEffect } from "react";
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
import { useBpmnContext } from "../../context/useBpmnContext";
import { createDiagram } from "../../utils/bpmnUtils";
import { useParams } from "react-router-dom";
import CustomColorsProviderViewer from "../../utils/BpmnProviders/CustomColorsProviderViewer";

//Inicializador del visualizador BPMN junto con su congifuración
export const ViewetInitializer = ({ setElementoSeleccionado }) => {
    const { bpmnModelerRef, containerRef, emptyDiagram, setEmptyDiagram} = useBpmnContext();
    const { idProceso, version } = useParams();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        bpmnModelerRef.current = new BpmnViewer({
            container,
            contextPad: {
                autoPlace: false,
            },
            additionalModules: [
                {
                        __init__: ["customColorsProviderViewer"],
                        customColorsProviderViewer: ["type", CustomColorsProviderViewer],
                },
            ],
        });

        const modeler = bpmnModelerRef.current;
        const eventBus = modeler.get("eventBus");
        const canvas = modeler.get("canvas");

        eventBus.on("element.click", ({ element }) => {
            const bo = element.businessObject;
            if (
                bo.$type === "bpmn:Process" ||
                bo.$type === "bpmn:Participant" ||
                bo.$type === "bpmn:Lane" ||
                bo.$type === "bpmn:Collaboration" ||
                bo.$type === "bpmn:SequenceFlow"
            ) {
                return;
            }
            const ext = bo.extensionElements?.values || [];

            const propsContainer = ext.find(
                (e) => e.$type === "camunda:properties"
            );
            const propsArray = propsContainer?.$children || [];
            const propiedades = Object.fromEntries(
                propsArray.map((p) => [p.name, p.value])
            );

            setElementoSeleccionado({
                id: bo.id,
                nombre: bo.name,
                tipo: bo.$type,
                descripcion: bo.documentation?.[0]?.text || "Sin descripción",
                propiedades,
            });
        });


        const initDiagram = async () => {
            try {
                const requestOptions = {
                    method: "GET",
                };
                const URL =
                    import.meta.env.VITE_APP_MODE === "desarrollo"
                        ? import.meta.env.VITE_URL_DESARROLLO
                        : import.meta.env.VITE_URL_PRODUCCION;

                const response = await fetch(
                    `${URL}/api/v1/procesos/get-process/${idProceso}/${version}`,
                    requestOptions
                );

                if (!response.ok) {
                    console.error("No se pudo cargar el subproceso");
                    return;
                }

                const data = await response.text();
                setEmptyDiagram(data);
                await createDiagram(bpmnModelerRef, data);
            } catch (error) {
                console.log(error);
            }
        };

        initDiagram();


        return () => {
            bpmnModelerRef.current?.destroy();
        };
    }, [containerRef, bpmnModelerRef, emptyDiagram]);

    return null;
};
