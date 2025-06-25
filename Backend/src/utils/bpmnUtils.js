import * as cheerio from "cheerio"
import { bpmnIcons } from "./bpmnIcons.js";
import { BpmnError } from "../errors/TypeError.js";
import { fileURLToPath } from "url";
import logger from "./logger.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

export const getBpmnIcon = (type) => {
    try {
        return bpmnIcons[type] || ""; 
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> getBpmnIcon] ${error.message}`);
        throw new BpmnError(null, error.message);

        
    }
};


const extaerIdProceso = (xmlString) => {
    try {
        if (xmlString.includes("bizagi")) {
        const regex = /<process id="([^"]+)" name="([^"]+)">/g;
        let match;
        let counter = 0;

        while ((match = regex.exec(xmlString)) !== null) {
            counter++;
            if (counter === 2) {
                return { id: match[1], name: match[2] };
            }
        }
    } else {
        const regex =
            /<bpmn:process[^>]*\s+id="([^"]+)"[^>]*\s+name="([^"]+)"/g;
        let match = regex.exec(xmlString);

        if (match) {
            return { id: match[1], name: match[2] };
        }
    }

    return null;
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> extaerIdProceso] ${error.message}`);
        throw new BpmnError(null, error.message);
    }
};

const extraerIdSubproceso = (xmlString) => {
    try {
        const regex =
        /<(?:bpmn:)?callActivity\b[^>]*\bid="([^"]*)"[^>]*\bcalledElement="([^"]*)"[^>]*>(?:<\/\w+:callActivity>)?/g;
    let match;
    const resultados = [];

    while ((match = regex.exec(xmlString)) !== null) {
        resultados.push({
            callActivity: match[1],
            calledElement: match[2],
        });
    }
    return resultados;
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> extraerIdSubproceso] ${error.message}`);
        throw new BpmnError(null, error.message);
    }
};

export const extractSubProcessId = async (archivo) => {
    try {
        const data = archivo.data.toString("utf8");
        const result = extaerIdProceso(data);
        return result;
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> extractSubProcessId] ${error.message}`);
        throw new BpmnError(null, error.message);
    }
};

const extraerDescripcionProceso = (xmlString) => {
    try {
        const regex = /<bpmn:documentation>([\s\S]*?)<\/bpmn:documentation>/;
        const match = xmlString.match(regex);

        return match ? match[1].trim() : null;
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> extraerDescripcionProceso] ${error.message}`);
        throw new BpmnError(null, error.message);
    }
};

export const changeCallElement = async (xmlContent, callActivity, calledElement, name, descripcion) => {
  try {
    const $ = cheerio.load(xmlContent, {
      xmlMode: true,
    });

    // Buscar callActivity sin prefijo (porque en tu XML es <callActivity>)
    const call = $(`[id="${callActivity}"]`).filter((i, el) => el.tagName.endsWith("callActivity"));


    if (call.length === 0) {
        const msg = `No se encontró el callActivity con ID: ${callActivity}`;
        logger.error(`[${fileName} -> changeCallElement - IF] ${msg}`);
        throw new BpmnError(null, msg);
    }
    

    call.attr("name", name);
    call.attr("calledElement", calledElement);

    const documentacion = call.children("bpmn\\:documentation");

    if (documentacion.length > 0) {
      documentacion.text(descripcion);
    } else {
      call.prepend(`<bpmn:documentation>${descripcion}</bpmn:documentation>`);
    }

    return $.xml();
  } catch (error) {
    console.error(`❌ Error al modificar el archivo: ${error.message}`);
    logger.error(`[${fileName} -> changeCallElement] ${error.message}`)
    throw new BpmnError(null, error.message);
  }
};


export const extraerDatosBpmn = async (archivo) => {
    try {
        const data = archivo.data.toString("utf8");
        const result = extaerIdProceso(data);
        const subproceso = extraerIdSubproceso(data);
        const descripcion = extraerDescripcionProceso(data);

        const processData = {
            idProceso: result.id,
            name: result.name,
            subProcesos: subproceso,
            descripcion: descripcion,
        };
        return processData;
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> extraerDatosBpmn] ${error.message}`)
        throw new BpmnError(null, error.message);
    }
};

export const formatFileName = (nombre) => {
    return Buffer.from(nombre, "latin1").toString("utf8");
};

export const extraerParticipantesBpmn = (xml) => {
  try {
    const claves = ["responsable", "consultado", "informado", "ejecutantes"];
    const propiedades = Object.fromEntries(claves.map((clave) => [clave, []]));

    // Buscar el <bpmn:process ... name="Proceso Principal">
    const processMatch = xml.match(
      /<bpmn:process[^>]*name="Proceso Principal"[^>]*>[\s\S]*?<\/bpmn:process>/
    );

    if (!processMatch) return propiedades;

    const processBlock = processMatch[0];

    const regex = /<camunda:property\s+name="([^"]+)"\s+value="([^"]+)"\s*\/>/g;
    let match;

    while ((match = regex.exec(processBlock)) !== null) {
      const [, name, value] = match;
      if (propiedades[name]) {
        propiedades[name].push(...value.split(",").map((v) => v.trim()));
      }
    }

    // Eliminar duplicados
    for (const clave of claves) {
      propiedades[clave] = [...new Set(propiedades[clave])];
    }

    return propiedades;
  } catch (error) {
    console.error("Error extrayendo participantes del BPMN:", error);
    
    return {
      responsable: [],
      consultado: [],
      informado: [],
      ejecutantes: [],
    };
    
  }
};


