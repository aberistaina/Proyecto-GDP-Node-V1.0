import { v4 as uuidv4 } from "uuid";

export const generateTemplate = () => {
  const id = uuidv4();
  const processID = `Id_${id}`;
  const laneSetID = `LaneSet_${uuidv4()}`;
  const laneID = `Lane_${uuidv4()}`;
  const diagramID = `BPMNDiagram_${uuidv4()}`;
  const planeID = `BPMNPlane_${uuidv4()}`;
  const laneShapeID = `LaneShape_${uuidv4()}`;

  const template = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  id="Definitions_${uuidv4()}"
  targetNamespace="http://bpmn.io/schema/bpmn">

  <bpmn:process id="${processID}" name="Proceso Principal" isExecutable="false">
    <bpmn:laneSet id="${laneSetID}">
      <bpmn:lane id="${laneID}" name="Nuevo Lane">
        <!-- Aquí puedes luego insertar flowNodes como startEvents o tasks -->
      </bpmn:lane>
    </bpmn:laneSet>
  </bpmn:process>

  <bpmndi:BPMNDiagram id="${diagramID}">
    <bpmndi:BPMNPlane id="${planeID}" bpmnElement="${processID}">
      
      <bpmndi:BPMNShape id="${laneShapeID}" bpmnElement="${laneID}" isHorizontal="true">
        <dc:Bounds x="100" y="100" width="1000" height="250" />
      </bpmndi:BPMNShape>

    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>

</bpmn:definitions>`;

  return { template, processID };
};
