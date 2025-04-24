import { v4 as uuidv4 } from "uuid";

export const generateTemplate = () => {
    const id= uuidv4();
    const processID = `Id_${id}`;

    const template = `
    <?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
            <bpmn:process id="${processID}" name="Proceso Principal" isExecutable="false"/>
                <bpmndi:BPMNDiagram id="BPMNDiagram_1">
                <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="proces055" />
            </bpmndi:BPMNDiagram>
        </bpmn:definitions>`;

    return { template, processID };
};
