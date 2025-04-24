import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "../../css/color.css";
import "../../css/Properties.css";
import { useEffect } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { useBpmnContext } from "../../context/useBpmnContext";
import { createDiagram } from "../../utils/bpmnUtils";
import { useParams } from "react-router-dom";
import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json'
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, CamundaPlatformPropertiesProviderModule} from "bpmn-js-properties-panel";
import { customBpmnProviders } from "../../utils/BpmnProviders/AllProviders"

export const ModelerInitializer = () => {
    const { bpmnModelerRef, containerRef, emptyDiagram, setEmptyDiagram } = useBpmnContext();
    const { idProcesoPadre, callActivity } = useParams();

    useEffect(() => {

        const container = containerRef.current;
        if (!container) return;

        bpmnModelerRef.current = new BpmnModeler({
            container,
            propertiesPanel: {
                parent: "#properties-panel",
            },
            additionalModules: [
                BpmnPropertiesPanelModule,
                BpmnPropertiesProviderModule,
                CamundaPlatformPropertiesProviderModule,
                ...customBpmnProviders
                
            ],
            moddleExtensions: {
                camunda: CamundaBpmnModdle
            },
            contextPad: {
                autoPlace: false,
            },
        });


        const initDiagram = async () => {
            if (idProcesoPadre && callActivity) {
                try {
                    const requestOptions = {
                        method: "GET",
                    };
                    const URL =
                        import.meta.env.VITE_APP_MODE === "desarrollo"
                            ? import.meta.env.VITE_URL_DESARROLLO
                            : import.meta.env.VITE_URL_PRODUCCION;

                    const response = await fetch(
                        `${URL}/api/v1/procesos/get-subproceso/${callActivity}/${idProcesoPadre}`,
                        requestOptions
                    );
                    console.log(response);

                    if (!response.ok) {
                        await createDiagram(bpmnModelerRef, emptyDiagram);
                        console.error("No se pudo cargar el subproceso");
                        return;
                    }

                    const data = await response.text();
                    setEmptyDiagram(data);
                    await createDiagram(bpmnModelerRef, data);
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
    }, [containerRef, bpmnModelerRef, emptyDiagram, callActivity]);

    return null;
};
