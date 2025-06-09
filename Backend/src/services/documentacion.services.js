import BpmnModdle from "bpmn-moddle";

export const getMacroProcessData = async (xmlContent) => {
    try {
        const moddle = new BpmnModdle();
        const { rootElement } = await moddle.fromXML(xmlContent)
        const procesos = rootElement.rootElements.filter(
            (e) => e.$type === "bpmn:Process"
        );
        return procesos
    } catch (error) {
        console.log(error);
    }
}

export const getProcessData = async (xmlContent) => {
    try {
        const moddle = new BpmnModdle();
        const { rootElement } = await moddle.fromXML(xmlContent)
        const procesos = rootElement.rootElements.filter(
            (e) => e.$type === "bpmn:Process"
        );
        return procesos
    } catch (error) {
        console.log(error);
    }
}

