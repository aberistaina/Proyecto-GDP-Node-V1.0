import { html } from "htm/preact";
import { useService } from "bpmn-js-properties-panel";

export default function CustomPropertyList({
    element,
    popupVisible,
    setPopupVisible,
    setElementSeleccionado,
    setPropertyName,
    label,
    propertyName,
    cargos
}) {
    const modeling = useService("modeling");
    const moddle = useService("moddle");
    const bpmnFactory = useService("bpmnFactory");
    const businessObject = element.businessObject;

    // Obtener los valores actuales
    const getCurrentValues = () => {
        let extensionElements = businessObject.extensionElements;
        let camundaProperties;
        
        if (extensionElements) {
            camundaProperties = extensionElements.values.find(
                (v) => v.$type === "camunda:Properties"
            );
        }

        const property = camundaProperties?.values.find(
            (p) => p.name === propertyName
        );

        return {
            extensionElements,
            camundaProperties,
            property,
            value: property?.value || ""
        };
    };

    // Actualizar los valores en el modelo
    const updateValues = (newValue) => {
        const { extensionElements, camundaProperties } = getCurrentValues();
        let newExtensionElements = extensionElements;
        let newCamundaProperties = camundaProperties;

        // Crear extensionElements si no existen
        if (!newExtensionElements) {
            newExtensionElements = moddle.create("bpmn:ExtensionElements", {
                values: []
            });
            modeling.updateProperties(element, { 
                extensionElements: newExtensionElements 
            });
        }

        // Crear camunda:Properties si no existen
        if (!newCamundaProperties) {
            newCamundaProperties = moddle.create("camunda:Properties", {
                values: []
            });
            newExtensionElements.get("values").push(newCamundaProperties);
        }

        // Buscar la propiedad existente
        const existingProp = newCamundaProperties.values.find(
            (p) => p.name === propertyName
        );

        if (existingProp) {
            // Actualizar propiedad existente
            modeling.updateModdleProperties(element, existingProp, {
                value: newValue
            });
        } else {
            // Crear nueva propiedad
            const newProp = moddle.create("camunda:Property", {
                name: propertyName,
                value: newValue
            });
            modeling.updateModdleProperties(element, newCamundaProperties, {
                values: [...newCamundaProperties.values, newProp]
            });
        }
    };

    // Obtener los IDs seleccionados actuales
    const { value } = getCurrentValues();
    const selectedIds = value.split(",").filter(Boolean);

    return html`
        <div class="bio-properties-panel-entry relative">
            <button
                type="button"
                onClick=${() => {
                    setElementSeleccionado(element);
                    setPopupVisible(true);
                    setPropertyName(propertyName);
                }}
                class="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition mb-2"
            >
                + Seleccionar ${label}
            </button>

            ${selectedIds.length > 0 &&
            html`
                <div class="mt-2 text-sm text-gray-800">
                    <p class="font-semibold mb-1">Seleccionados:</p>
                    <ul class="list-disc list-inside space-y-1">
                        ${selectedIds
                            .map(id => {
                                const cargo = cargos.find(op => op.id.toString() === id.toString());
                                return cargo ? html`<li key=${id}>${cargo.label}</li>` : null;
                            })
                            .filter(Boolean)}
                    </ul>
                </div>
            `}
        </div>
    `;
}