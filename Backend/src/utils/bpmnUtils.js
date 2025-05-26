import logger from "./logger.js";
import fs from "fs/promises";
import * as cheerio from "cheerio"


const extaerIdProceso = (xmlString) => {
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
};

const extraerIdSubproceso = (xmlString) => {
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
};

export const extractSubProcessId = async (archivo) => {
    const data = archivo.data.toString("utf8");
    const result = extaerIdProceso(data);
    return result;
};

const extraerDescripcionProceso = (xmlString) => {
    const regex = /<bpmn:documentation>([\s\S]*?)<\/bpmn:documentation>/;
    const match = xmlString.match(regex);

    return match ? match[1].trim() : null;
};

/* export const changeCallElement = async (
    xmlContent,
    callActivity,
    calledElement,
    name
) => {
    try {

        console.log(name);
        //Buscar y reemplazar SOLO el callActivity específico (con o sin bpmn:)
        const updatedXml = xmlContent.replace(
            new RegExp(
                `(<(?:bpmn:)?callActivity\\s+[^>]*?id="${callActivity}")([^>]*?)(name=")[^"]*(")([^>]*?)(calledElement=")[^"]*(")([^>]*?>)`,
                "g"
            ),
            `$1$2$3${name}$4$5$6${calledElement}$7$8`
        );

        return updatedXml;
    } catch (error) {
        console.error(`❌ Error al modificar el archivo: ${error.message}`);
        throw error;
    }
}; */

export const changeCallElement = async (xmlContent, callActivity, calledElement, name) => {
  try {
    const $ = cheerio.load(xmlContent, {
      xmlMode: true,
    });

    // Buscar callActivity sin prefijo (porque en tu XML es <callActivity>)
    const call = $(`[id="${callActivity}"]`).filter((i, el) => el.tagName.endsWith("callActivity"));


    if (call.length === 0) {
      throw new Error(`No se encontró el callActivity con ID: ${callActivity}`);
    }

    call.attr("name", name);
    call.attr("calledElement", calledElement);

    return $.xml();
  } catch (error) {
    console.error(`❌ Error al modificar el archivo: ${error.message}`);
    throw error;
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
        logger.error("Utils extraerDatosBpmn", error);
        console.log(error);
    }
};

export const formatFileName = (nombre) => {
    return Buffer.from(nombre, "latin1").toString("utf8");
};

export const extraerParticipantesBpmn = (xml) => {
    try {
        const claves = [
            "responsable",
            "consultado",
            "informado",
            "ejecutantes",
        ];

        // Inicializar todas las claves con arrays vacíos
        const propiedades = Object.fromEntries(
            claves.map((clave) => [clave, []])
        );

        const processMatch = xml.match(
            /<bpmn:process[^>]*>[\s\S]*?<\/bpmn:process>/
        );

        if (!processMatch) return propiedades; 

        const processBlock = processMatch[0];

        const regex =
            /<camunda:property\s+name="([^"]+)"\s+value="([^"]+)"\s*\/>/g;

        let match;
        while ((match = regex.exec(processBlock)) !== null) {
            const [, name, value] = match;

            if (propiedades[name]) {
                propiedades[name].push(
                    ...value.split(",").map((v) => v.trim())
                );
            }
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
