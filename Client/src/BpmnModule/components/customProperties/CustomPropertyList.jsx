import { html } from "htm/preact";
import { useService } from "bpmn-js-properties-panel";
import opcionesDB from "../../BpmnDesigner/data/cargos.json";

export default function CustomPropertyList({
    element,
    popupVisible,
    setPopupVisible,
    setElementSeleccionado,
    setPropertyName,
    label,
    propertyName
}) {
    const modeling = useService("modeling");
    const moddle = useService("moddle");
    const businessObject = element.businessObject;

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

    const currentValue = property?.value || "";
    const selectedIds = currentValue.split(",").filter(Boolean);

    const toggleValue = (id) => {
        const updated = selectedIds.includes(id)
            ? selectedIds.filter((v) => v !== id)
            : [...selectedIds, id];

        const newValue = updated.join(",");

        if (!extensionElements) {
            extensionElements = moddle.create("bpmn:ExtensionElements", {
                values: [],
            });
            modeling.updateProperties(element, { extensionElements });
        }

        if (!camundaProperties) {
            camundaProperties = moddle.create("camunda:Properties", {
                values: [],
            });
            extensionElements.values.push(camundaProperties);
        }

        const existing = camundaProperties.values.find(
            (p) => p.name === propertyName
        );

        if (existing) {
            modeling.updateModdleProperties(element, existing, {
                value: newValue,
            });
        } else {
            const newProp = moddle.create("camunda:Property", {
                name: propertyName,
                value: newValue,
            });
            modeling.updateModdleProperties(element, camundaProperties, {
                values: [...camundaProperties.values, newProp],
            });
        }
    };

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
                            .map((id) => opcionesDB.find((op) => op.id === id))
                            .filter(Boolean)
                            .map((item) => html`<li>${item.label}</li>`)}
                    </ul>
                </div>
            `}
        </div>
    `;
}
