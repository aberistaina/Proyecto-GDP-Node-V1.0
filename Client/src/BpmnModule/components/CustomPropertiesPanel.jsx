import { useState, useEffect } from "react";


//Panel de propiedades extendidas "Informados, Consultados, Ejecutantes, Responsables"
export const CustomPropertiesPanel = ({ element, modeler }) => {
  const [name, setName] = useState("");
  const [assignee, setAssignee] = useState("");
  const [notify, setNotify] = useState(false);

  useEffect(() => {
    if (element) {
      const bo = element.businessObject;
      setName(bo.name || "");
      const camundaProps = bo.extensionElements?.values?.find(e => e.$type === "camunda:Properties")?.values || [];
      const getProp = (name) => camundaProps.find(p => p.name === name)?.value;

      setAssignee(getProp("assignee") || "");
      setNotify(getProp("notify") === "true");
    }
  }, [element]);

  const update = () => {
    const modeling = modeler.get("modeling");
    const moddle = modeler.get("moddle");

    modeling.updateProperties(element, { name });

    let extensionElements = element.businessObject.extensionElements;
    if (!extensionElements) {
      extensionElements = moddle.create("bpmn:ExtensionElements", { values: [] });
      modeling.updateProperties(element, { extensionElements });
    }

    let props = extensionElements.values.find(v => v.$type === "camunda:Properties");
    if (!props) {
      props = moddle.create("camunda:Properties", { values: [] });
      extensionElements.values.push(props);
    }

    const setOrUpdate = (name, value) => {
      let prop = props.values.find(p => p.name === name);
      if (!prop) {
        prop = moddle.create("camunda:Property", { name, value });
        props.values.push(prop);
      } else {
        prop.value = value;
      }
    };

    setOrUpdate("assignee", assignee);
    setOrUpdate("notify", notify ? "true" : "false");
  };

  return (
    <div className="p-4 border-l w-80 bg-gray-50 text-sm">
      <div className="mb-2">
        <label className="block text-xs font-bold">Nombre</label>
        <input value={name} onChange={e => setName(e.target.value)} className="border px-2 py-1 w-full" />
      </div>
      <div className="mb-2">
        <label className="block text-xs font-bold">Responsable (camunda:assignee)</label>
        <input value={assignee} onChange={e => setAssignee(e.target.value)} className="border px-2 py-1 w-full" />
      </div>
      <div className="mb-2">
        <label className="block text-xs font-bold">
          <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} /> Notificar (camunda:notify)
        </label>
      </div>
      <button onClick={update} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">Guardar</button>
    </div>
  );
};
