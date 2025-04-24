import logger from "./logger.js";
import fs from 'fs/promises';
import { parseStringPromise, Builder } from 'xml2js';

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

        const regex = /<bpmn:process id="([^"]+)" name="([^"]+)" isExecutable="false">/g;
        let match = regex.exec(xmlString);

        if (match) {
            return { id: match[1], name: match[2] }
        }
    }

    return null;
};


const extraerIdSubproceso = (xmlString) => {
    const regex = /<(?:bpmn:)?callActivity\b[^>]*\bid="([^"]*)"[^>]*\bcalledElement="([^"]*)"[^>]*>(?:<\/\w+:callActivity>)?/g;
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
  
  


export const extractSubProcessId =async (archivo) =>{
    const data = archivo.data.toString("utf8");
    const result =  extaerIdProceso(data)
    return result
}

export const changeCallElement = async(archivoBpmn, callActivity, calledElement, name = "") => {
    try {
        // 1. Leer el archivo
        const xmlContent = await fs.readFile(archivoBpmn, 'utf-8');

        console.log(xmlContent);
        console.log("CALL ACTIVITY", callActivity)
        console.log("CALLED ELEMENT", calledElement)
        console.log("NOMBRE", name);
        
        // 2. Buscar y reemplazar SOLO el callActivity específico (con o sin bpmn:)
        const updatedXml = xmlContent.replace(
            new RegExp(
                `(<(?:bpmn:)?callActivity\\s+[^>]*?id="${callActivity}")([^>]*?)(name=")[^"]*(")([^>]*?)(calledElement=")[^"]*(")([^>]*?>)`,
                'g'
            ),
            `$1$2$3${name}$4$5$6${calledElement}$7$8`
        );
        
        // 3. Guardar los cambios en el mismo archivo
        await fs.writeFile(archivoBpmn, updatedXml, 'utf-8');
        
        console.log(`✅ CallActivity "${callActivity}" actualizado con calledElement="${calledElement}"`);
    } catch (error) {
        console.error(`❌ Error al modificar el archivo: ${error.message}`);
        throw error;
    }
}




export const extraerDatosBpmn = async(archivo) =>{
    try {
        const data = archivo.data.toString("utf8");
        const result =  extaerIdProceso(data) 
        const subproceso = extraerIdSubproceso(data)
        
        const processData = {
            idProceso: result.id,
            name: result.name,
            subProcesos: subproceso
        } 
        return processData

        
    } catch (error) {
        logger.error("Utils extraerDatosBpmn", error)
        console.log(error);
    }
}

export const formatFileName = (nombre) => {
    return Buffer.from(nombre, 'latin1').toString('utf8');
};

export const cleanBpmnFile = () =>{
    
}