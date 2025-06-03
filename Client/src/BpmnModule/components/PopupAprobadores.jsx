import { useState, useEffect } from "react";
import opcionesDB from "../BpmnDesigner/data/cargos.json";


//Popup con las propiedades extendidas "Informados, Consultados, Ejecutantes, Responsables"
export default function PopupAprobadores({
    element,
    modeling,
    moddle,
    onClose,
    propertyName,
}) {
    const [selectedIds, setSelectedIds] = useState(new Set());

    useEffect(() => {
        if (!element || !moddle || !propertyName) return;

        const businessObject = element.businessObject;
        const extensionElements = businessObject.extensionElements;
        const camundaProperties = extensionElements?.values.find(
            (v) => v.$type === "camunda:Properties"
        );

        const property = camundaProperties?.values.find(
            (p) => p.name === propertyName
        );

        const currentValue = property?.value || "";
        const values = new Set(currentValue.split(",").filter(Boolean));

        setSelectedIds(values); 
    }, [element, propertyName]); 

    if (!element || !modeling || !moddle || !propertyName) {
        console.warn("PopupAprobadores: faltan props necesarios");
        return null;
    }

    const toggleValue = (id) => {
        const updated = new Set(selectedIds);
        if (updated.has(id)) {
            updated.delete(id);
        } else {
            updated.add(id);
        }
        setSelectedIds(updated);
    };

    const guardar = () => {
        const newValue = Array.from(selectedIds).join(",");

        const businessObject = element.businessObject;
        let extensionElements = businessObject.extensionElements;
        let camundaProperties;

        if (extensionElements) {
            camundaProperties = extensionElements.values.find(
                (v) => v.$type === "camunda:Properties"
            );
        }

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

        const existingProperty = camundaProperties.values.find(
            (p) => p.name === propertyName
        );

        if (existingProperty) {
            modeling.updateModdleProperties(element, existingProperty, {
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

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-[999]">
            <div className="bg-white rounded shadow-lg p-6 w-96">
                <h2 className="text-lg font-bold mb-4">
                    Seleccionar {propertyName}
                </h2>
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                    {opcionesDB.map((op) => (
                        <label
                            key={op.id}
                            className="flex items-center gap-2 text-sm"
                        >
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-blue-600"
                                checked={selectedIds.has(op.id)} 
                                onChange={() => toggleValue(op.id)}
                            />
                            {op.label}
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
                        onClick={guardar}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
