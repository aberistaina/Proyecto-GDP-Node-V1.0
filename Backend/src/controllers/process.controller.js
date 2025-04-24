import * as path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { Procesos } from "../models/Procesos.model.js";
import {CallActivity} from "../models/CallActivity.model.js";
import logger from "../utils/logger.js";
import { changeCallElement, extraerDatosBpmn, formatFileName } from "../utils/bpmnUtils.js";
import { createAssociation, createProcessIfNotExist } from "../services/Bpmn.services.js";
import { moveFile } from "../utils/uploadFile.js";
import { sequelize } from "../database/database.js";
import { ListBucketsCommand, S3Client, GetObjectCommand  } from "@aws-sdk/client-s3"
import { where } from "sequelize";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getAllProcess = async (req, res, next) => {
    try {
        const procesos = await Procesos.findAll();

        res.status(200).json({
            code: 200,
            message: "Procesos Cargados Correctamente",
            data: procesos,
        });
    } catch (error) {
        logger.error("Controlador getAllProcess", error);
        console.log(error);
        next(error)
    }
};


export const readProcessById = async (req, res, next) => {
    try {
        const { idProceso } = req.params;
        const proceso = await Procesos.findOne({
            where: {
                idProceso
            },
        });

        const rutaAbsoluta = path.join(__dirname, "../", proceso.ruta);
        let data = await fs.readFile(rutaAbsoluta, "utf8");
        res.setHeader("Access-Control-Expose-Headers", "Proceso-Nombre");
        res.setHeader("Proceso-Nombre", proceso.nombre);
        res.setHeader("Content-Type", "application/xml");
        res.status(200).send(data);
    } catch (error) {
        logger.error("Controlador readProcessById", error);
        console.log(error);
        next(error)
    }
};

export const readSubprocesoById = async (req, res, next) => {
    try {
        const { idProcesoPadre, callActivity } = req.params;

        const relacionSubproceso = await CallActivity.findOne({
            raw:true,
            where: {
                idProceso: idProcesoPadre,
                callActivity
            },
        }); 

        const idSubproceso = relacionSubproceso.idSubProceso



        const rutaRelativa = path.join("upload", `${idSubproceso}.bpmn`);
        const rutaAbsoluta = path.join(__dirname, "../", rutaRelativa);
        let data = await fs.readFile(rutaAbsoluta, "utf8");

        res.setHeader("Access-Control-Expose-Headers", "Proceso-Nombre");
        res.setHeader("Content-Type", "application/xml");
        res.status(200).send(data);
    } catch (error) {
        logger.error("Controlador readSubprocesoById", error);
        console.log(error);
        next(error)
    }
};

export const connectSubprocess = async (req, res, next) => {
    try {
         const { idProceso, idSubProceso, callActivity } = req.body;

        const rutaRelativaProcesoPadre = path.join("upload",`${idProceso}.bpmn`);
        const rutaAbsolutaProcesoPadre = path.join(__dirname, "../", rutaRelativaProcesoPadre);

        const subProceso = await Procesos.findByPk(idSubProceso, { raw: true });
        const subProcesoName = subProceso.nombre;

        const referenciaExistente = await CallActivity.findOne({
            raw: true,
            where: {
                idProceso,
                callActivity,
            },
        });
        if (referenciaExistente) {
            await CallActivity.update(
                {
                    idSubProceso,
                },
                {
                    where: {
                        callActivity,
                    },
                }
            );
            changeCallElement( rutaAbsolutaProcesoPadre, callActivity, idSubProceso, subProcesoName);
            return res.status(200).json({
                code: 200,
                message: "Subproceso vinculado correctamente",
            });
        } else {
            await CallActivity.create({
                idProceso,
                idSubProceso,
                callActivity,
            });
            changeCallElement( rutaAbsolutaProcesoPadre, callActivity, idSubProceso, subProcesoName
            );
            return res.status(200).json({
                code: 200,
                message: "Subproceso vinculado correctamente",
            });
        }
    } catch (error) {
        logger.error("Controlador updateSubproceso", error);
        console.log(error);
        next(error)
    }
};

export const uploadProcess = async (req, res, next) => {  
    const transaction = await sequelize.transaction();
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                code: 400,
                message: "No se ha subido ningún archivo.",
            });
        }
        const { archivos } = req.files;
        const archivosArray = Array.isArray(archivos) ? archivos : [archivos];
        const datosArchivos = []

        for (const archivo of archivosArray) {
            const datoArchivo = await extraerDatosBpmn(archivo);
            const nombreArchivo = formatFileName(archivo.name.split(".")[0])
            datosArchivos.push(datoArchivo);

            const {  idProceso, subProcesos } = datoArchivo;
            let callActivity = subProcesos.callActivity


            let calledElement = subProcesos.calledElement;
            for (const subProceso of subProcesos) {
                callActivity = subProceso.callActivity;
                calledElement = subProceso.calledElement;
            }

            const rutaRelativa = path.join("upload", `${idProceso}.bpmn`);
            const rutaAbsoluta = path.join(__dirname, "../", rutaRelativa);
            
            await createProcessIfNotExist(idProceso, nombreArchivo, rutaRelativa);
            await moveFile(archivo, rutaAbsoluta)

            if(callActivity && calledElement !== ""){
                const rutaRelativaSubproceso = path.join("upload", `${calledElement}.bpmn`);
                await createProcessIfNotExist(calledElement, "Pendiente", rutaRelativaSubproceso, true);
                await createAssociation(idProceso, callActivity, calledElement);
                }
            }
            res.status(201).json({
                code: 201,
                message: "Procesos cargado correctamente",
            });

    } catch (error) {
        logger.error("Controlador Cargar Proceso", error);
        console.log(error);
        next(error)
    }
}

export const saveProcessChanges = async(req, res, next) =>{
    try {
        const { archivo } = req.files

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                code: 400,
                message: "No se ha subido ningún archivo.",
            });
        }
        
        const { idProceso, name } = await extraerDatosBpmn(archivo)

        const rutaRelativa = path.join("upload", `${idProceso}.bpmn`);
        const rutaAbsoluta = path.join(__dirname, "../", rutaRelativa);
 
        await createProcessIfNotExist(idProceso, name, rutaRelativa )
        await moveFile(archivo, rutaAbsoluta)

        res.status(201).json({
            code: 201,
            message: "Proceso Guardado Correctamente"
        })

    } catch (error) {
        logger.error("Controlador Save Changes", error);
        console.log(error);
        next(error)
         
    }
}

export const saveSubProcessChanges = async(req, res, next) =>{
    try {
        const { archivo } = req.files
        const { idProcesoPadre, callActivity } = req.body

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                code: 400,
                message: "No se ha subido ningún archivo.",
            });
        }
        
        const { idProceso, name } = await extraerDatosBpmn(archivo)

        const rutaRelativa = path.join("upload", `${idProceso}.bpmn`);
        const rutaAbsoluta = path.join(__dirname, "../", rutaRelativa);
        const rutaRelativaProcesoPadre = path.join("upload", `${idProcesoPadre}.bpmn`)
        const rutaAbsolutaProcesoPadre = path.join(__dirname, "../", rutaRelativaProcesoPadre);

        await createProcessIfNotExist(idProceso, name, rutaRelativa)
        await createAssociation(idProcesoPadre, callActivity, idProceso, rutaRelativa, name, rutaAbsolutaProcesoPadre)
        
        await moveFile(archivo, rutaAbsoluta)

        res.status(201).json({
            code: 201,
            message: "SubProceso Guardado Correctamente"
        })

    } catch (error) {
        logger.error("Controlador Save Changes", error);
        console.log(error);
        next(error)
    }
}

export const getSubprocessesOfProcess = async(req, res, next) =>{
    try {
        const { idProceso } = req.params
        const subprocesos = await CallActivity.findAll({
            where: { idProceso },
            include: [
                {
                    model: Procesos,
                    as: 'subproceso',
                    attributes: ['idProceso', 'nombre', 'ruta']
                }
            ]
        });

        if(!subprocesos){
            res.status(400).json({
                code: 400,
                message: "No hay subprocesos vinculados a este proceso",
            })
        }

        const subprocesosMap = subprocesos.map(subproceso => ({
            id: subproceso.idSubProceso,
            nombre: subproceso.subproceso.nombre,
            procesoPadre: subproceso.idProceso,
            callActivity: subproceso.callActivity
        }));

        res.status(200).json({
            code: 200,
            message: "Subprocesos encontrados",
            data: subprocesosMap
        })
    } catch (error) {
        logger.error("Controlador Save Changes", error);
        console.log(error);
        next(error)
    }
}

export const getS3Bucket = async(req, res) =>{
    try {
        console.log("S3");
        const s3Client = new S3Client({
            region: 'us-east-1',
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
            },
            
        });

        const { Body } = await s3Client.send(new GetObjectCommand({
            Bucket: "test-bpmn",
            Key: "Solicitud de Vacaciones.bpmn"
        }));

        const streamToString = (stream) => new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });

        // Obtiene el contenido XML como string
        const xmlContent = await streamToString(Body);
        
        res.setHeader("Content-Type", "application/xml");
        res.status(200).send(xmlContent);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            message: "Hubo un error interno en el servidor"
        })
    }

}