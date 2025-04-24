import { html } from 'htm/preact';
import { useService } from 'bpmn-js-properties-panel';

export default function NivelDeAprobacionInput({ element }) {
  const modeling = useService('modeling');
  const moddle = useService('moddle');

  const bo = element.businessObject;

  // Asegurar que existan los extensionElements
  if (!bo.extensionElements) {
    bo.extensionElements = moddle.create('bpmn:ExtensionElements', {
      values: []
    });

    modeling.updateProperties(element, {
      extensionElements: bo.extensionElements
    });
  }

  // Asegurar que existan camunda:Properties
  let camundaProperties = bo.extensionElements.values.find(
    (v) => v.$type === 'camunda:Properties'
  );

  if (!camundaProperties) {
    camundaProperties = moddle.create('camunda:Properties', { values: [] });
    bo.extensionElements.values.push(camundaProperties);

    modeling.updateProperties(element, {
      extensionElements: bo.extensionElements
    });
  }

  // Obtener propiedad actual
  const existing = camundaProperties.values.find(p => p.name === 'nivelDeAprobacion');
  const currentValue = existing?.value || '';

  const update = (event) => {
    const newValue = event.target.value;

    if (existing) {
      existing.value = newValue;
    } else {
      const newProp = moddle.create('camunda:Property', {
        name: 'nivelDeAprobacion',
        value: newValue
      });

      camundaProperties.values.push(newProp);
    }

    modeling.updateProperties(element, {
      extensionElements: bo.extensionElements
    });
  };

  return html`
    <div class="bio-properties-panel-entry">
      <label for="nivelDeAprobacion">Nivel de Aprobación</label>
      <input
        id="nivelDeAprobacion"
        class="bio-properties-panel-input"
        type="text"
        value=${currentValue}
        onInput=${update}
      />
    </div>
  `;
}
