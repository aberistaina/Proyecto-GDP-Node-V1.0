import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "../../css/color.css";
import "../../css/Properties.css";
import { useEffect, useState, useRef } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { useBpmnContext } from "../../context/useBpmnContext";
import { createDiagram } from "../../utils/bpmnUtils";
import { useParams } from "react-router-dom";
import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json'
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, CamundaPlatformPropertiesProviderModule} from "bpmn-js-properties-panel";
import { customBpmnProviders } from "../../utils/BpmnProviders/AllProviders"
import CustomPropertiesProvider from "../../utils/BpmnProviders/CustomPropertiesProvider";
import PopupAprobadores from "../../components/PopupAprobadores";
import CustomColorsProviderViewer from "../../utils/BpmnProviders/CustomColorsProviderViewer";

//Iniciador del modelador junto con toda su configuración
export const ModelerInitializer = () => {
    const [popupVisible, setPopupVisible] = useState(false);
    const [propertyName, setPropertyName] = useState("");
    const [elementSeleccionado, setElementSeleccionado] = useState(null);
    const { bpmnModelerRef, containerRef, emptyDiagram, setEmptyDiagram } = useBpmnContext();
    const { idProceso, callActivity, version } = useParams();
    const [cargos, setCargos] = useState([]);

    // Crea un ref para popupData
    const popupDataRef = useRef({
        popupVisible,
        setPopupVisible,
        setElementSeleccionado,
        setPropertyName,
        cargos
    });

    

useEffect(() => {
  const getCargos = async () => {
    try {
      const URL =
        import.meta.env.VITE_APP_MODE === "desarrollo"
          ? import.meta.env.VITE_URL_DESARROLLO
          : import.meta.env.VITE_URL_PRODUCCION;

      const response = await fetch(`${URL}/api/v1/cargos/get-all-cargos`, {credentials: "include"});
      const data = await response.json();

      const formateados = data.data.map((c) => ({
        id: c.id_cargo,
        label: c.nombre
      }));

      setCargos(formateados);
    } catch (error) {
      console.error("Error cargando cargos:", error);
    }
  };

  getCargos();
}, []);

    useEffect(() => {

        const container = containerRef.current;
        if (!container) return;


        bpmnModelerRef.current = new BpmnModeler({
            container,
            propertiesPanel: {
                parent: "#properties-panel",
            },
            additionalModules: [
                {
                    __init__: ["customPropertiesProvider"],
                    customPropertiesProvider: ["type", CustomPropertiesProvider],
                    popupData: ["value", popupDataRef.current],
                },
                {
                    __init__: ["customColorsProviderViewer"],
                    customColorsProviderViewer: ["type", CustomColorsProviderViewer],
                },
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
            if (idProceso && version) {
                try {
                    const requestOptions = {
                        method: "GET",
                        credentials: "include"
                    };
                    const URL =
                        import.meta.env.VITE_APP_MODE === "desarrollo"
                            ? import.meta.env.VITE_URL_DESARROLLO
                            : import.meta.env.VITE_URL_PRODUCCION;

                    const response = await fetch(
                        `${URL}/api/v1/procesos/get-process-xml/${idProceso}/${version}`,
                        requestOptions
                    );

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

    useEffect(() => {
        popupDataRef.current = {
            popupVisible,
            setPopupVisible,
            setElementSeleccionado,
            setPropertyName,
            cargos
        };
    }, [popupVisible, setPopupVisible, setElementSeleccionado, setPropertyName, cargos]);

    return (
        <>
            {popupVisible && elementSeleccionado && (
                <PopupAprobadores
                    element={elementSeleccionado}
                    propertyName={propertyName}
                    modeling={bpmnModelerRef.current?.get("modeling")}
                    moddle={bpmnModelerRef.current?.get("moddle")}
                    onClose={() => setPopupVisible(false)}
                    cargos={cargos}
                />
            )}
        </>)
};
