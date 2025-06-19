import BpmnModdle from "bpmn-moddle";
import { ProcessError } from "../errors/TypeError.js";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);


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
        logger.error(`[${fileName} -> getMacroProcessData] ${error.message}`);
        throw new ProcessError("Hubo un error al generar la documentación", error.message);
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
        logger.error(`[${fileName} -> getProcessData] ${error.message}`);
        throw new ProcessError("Hubo un error al generar la documentación", error.message);
    }
}

