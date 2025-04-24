export function getBusinessObject(element) {
  return element.businessObject;
}

export function ensureCamundaProperties(element) {
  const bo = getBusinessObject(element);

  if (!bo.extensionElements) {
    bo.extensionElements = bo.$model.create('bpmn:ExtensionElements', { values: [] });
  }

  let camundaProps = bo.extensionElements.values.find(
    (e) => e.$type === 'camunda:Properties'
  );

  if (!camundaProps) {
    camundaProps = bo.$model.create('camunda:Properties', { values: [] });
    bo.extensionElements.values.push(camundaProps);
  }

  return camundaProps;
}

export function getCustomProperty(element, name) {
  const camundaProps = ensureCamundaProperties(element);
  const prop = camundaProps.get("values").find(p => p.name === name);
  return { [name]: prop ? prop.value : "" };
}

export function setCustomProperty(element, name, value) {
  const bo = getBusinessObject(element);
  const camundaProps = ensureCamundaProperties(element);
  const properties = camundaProps.get("values");

  let existing = properties.find(p => p.name === name);
  if (existing) {
    existing.value = value;
  } else {
    const newProp = bo.$model.create("camunda:Property", { name, value });
    properties.push(newProp);
  }

  return [];
}
