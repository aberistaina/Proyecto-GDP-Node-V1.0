import * as path from "path";
import mime from "mime-types";
import { NotFoundError, ProcessError, FileError } from "../errors/TypeError.js";
import { fileURLToPath } from "url";
import fs from "fs"; //Debug, luego borrar
import puppeteer from "puppeteer";
import {Procesos, IntermediaProcesos, Usuarios, Aprobadores, VersionProceso, Cargo, ProcesosAprobadores} from "../models/models.js";
import logger from "../utils/logger.js";
import { changeCallElement, extraerDatosBpmn, extraerParticipantesBpmn} from "../utils/bpmnUtils.js";
import { formatearFecha, formatShortTime } from "../utils/formatearFecha.js";
import {createProcessIfNotExist} from "../services/Bpmn.services.js";
import {getDataFileBpmnFromS3, uploadFileToS3, downloadFromS3, getFileFromS3Version, getImageFromS3Version} from "../services/s3Client.services.js";
import { sequelize } from "../database/database.js";
import { getAdminConfig } from "../services/admin.services.js";
import {getMacroProcessData, getProcessData,} from "../services/documentacion.services.js";
import {generarContenidoMacroproceso, generarPortada, generarContenidoProceso, generarTemplateFinal} from "../utils/documentacion.js";


const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);


const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Función para obtener todos los procesos
export const getAllProcess = async (req, res, next) => {
    try {
        const procesos = await Procesos.findAll({
            include: [
                {
                    model: VersionProceso,
                    as: "version_procesos",
                    attributes: ["nombre_version", "id_version_proceso"],
                    where: { estado: "aprobado" },
                },
            ]
        });

        if (procesos.length === 0) {
            return res.status(200).json({
                code: 200,
                message: "No hay Procesos",
                data: [],
            });
        }
        const procesosMap = procesos.map((proceso) => ({
            ...proceso.toJSON(),
            version: proceso.version_procesos?.[0]?.id_version_proceso,
        }));

        res.status(200).json({
            code: 200,
            message: "Procesos Cargados Correctamente",
            data: procesosMap,
        });
        
    } catch (error) {
        logger.error(`[${fileName} -> getAllProcess] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Función que obtiene los procesos de un nivel en específico
export const getProcessByNivel = async (req, res, next) => {
    try {
        const { idNivel } = req.params;

        const procesos = await Procesos.findAll({
            include: [
                {
                    model: Usuarios,
                    as: "id_creador_usuario",
                    attributes: ["nombre"],
                },
                {
                    model: VersionProceso,
                    as: "version_procesos",
                    attributes: ["nombre_version", "id_version_proceso"],
                    where: { estado: "aprobado" },
                    separate: true,
                    limit: 1,
                },
            ],
            where: {
                id_nivel: idNivel,
            },
        });

        if (procesos.length === 0) {
            return res.status(200).json({
                code: 200,
                message: "No hay Procesos para este nivel",
                data: [],
            });
        }

        const procesosMap = procesos.map((proceso) => ({
            ...proceso.toJSON(),
            created_at: formatShortTime(proceso.created_at),
            creador: proceso.id_creador_usuario?.nombre,
            version: proceso.version_procesos?.[0]?.id_version_proceso,
        }));

        res.status(200).json({
            code: 200,
            message: "Oportunidades obtenidas correctamente",
            data: procesosMap
        });
    } catch (error) {
        logger.error(`[${fileName} -> getProcessByNivel] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Función leer el contenido XML de la versión actual del proceso desde S3
export const readActualProcessVersion = async (req, res, next) => {
    try {
        const { idProceso, version } = req.params;

        let procesoVersionActual;

        if (!version || version === "undefined") {
            procesoVersionActual = await VersionProceso.findOne({
                where: {
                    id_bpmn: idProceso,
                    estado: "aprobado",
                }
            })
        }else{
            procesoVersionActual = await VersionProceso.findByPk(version);
        } 
    
        const versionActiva = procesoVersionActual.nombre_version;

        const { s3_bucket, s3_bucket_procesos } = await getAdminConfig();

        const xmlContent = await getFileFromS3Version(
            s3_bucket,
            `${s3_bucket_procesos}/${idProceso}.bpmn`,
            versionActiva
        );

        if (!xmlContent) {
            throw new NotFoundError("No se encontró el archivo XML de esta versión");
        }

        res.setHeader("Content-Type", "application/xml");
        res.status(200).send(xmlContent);
    } catch (error) {
        logger.error(`[${fileName} -> readActualProcessVersion] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Función leer el contenido XML de una versión específica del proceso desde S3
export const readProcessVersion = async (req, res, next) => {
    try {
        const { idProceso, version } = req.params;
        const { s3_bucket, s3_bucket_procesos } = await getAdminConfig();

        const versionProceso = await VersionProceso.findOne({
            where: {
                id_bpmn: idProceso,
                id_version_proceso: version,
            },
        });

        if(!versionProceso){
            throw new NotFoundError("No existe esa versión del proceso")
        }

        const xmlContent = await getFileFromS3Version(
            s3_bucket,
            `${s3_bucket_procesos}/${idProceso}.bpmn`,
            versionProceso.nombre_version
        );

        if (!xmlContent) {
            throw new NotFoundError("No se encontró el archivo XML de esta versión");
        }

        res.setHeader("Content-Type", "application/xml");
        res.status(200).send(xmlContent);
    } catch (error) {
        logger.error(`[${fileName} -> readProcessVersion] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Función que vincula un subproceso a un proceso
export const connectSubprocess = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const {idProceso, calledElement, callActivity, aprobadores, nivel, nombre, descripcion, esMacroproceso, id_creador } = req.body;

        const { archivo } = req.files;
        const archivoTransformado = archivo.data.toString("utf8");

        const procesoPadre = await Procesos.findOne({ where: { id_bpmn: idProceso }, transaction });

        if (!procesoPadre) {
            await Procesos.create(
                {
                    id_creador: id_creador,
                    id_aprobadores_cargo: aprobadores,
                    id_nivel: nivel,
                    nombre: nombre,
                    descripcion: descripcion,
                    estado: "borrador",
                    id_bpmn: idProceso,
                    macroproceso: esMacroproceso,
                },
                { transaction }
            );
        }

        const subproceso = await Procesos.findOne({ where: { id_bpmn: calledElement }, transaction });
        const nombreSubproceso = subproceso.nombre;

        const referenciaExistente = await IntermediaProcesos.findOne({
            where: {
                id_bpmn_padre: idProceso,
                call_activity: callActivity},
                transaction 
        });

        const archivoModificado = await changeCallElement(
            archivoTransformado,
            callActivity,
            calledElement,
            nombreSubproceso
        );

        if (referenciaExistente) {
            await referenciaExistente.update(
                { id_bpmn: calledElement },
                { transaction }
            );
            res.setHeader("Content-Type", "application/xml");
            res.status(200).send(archivoModificado);
        } else {
            await IntermediaProcesos.create(
                {
                    id_bpmn_padre: idProceso,
                    call_activity: callActivity,
                    id_bpmn: calledElement,
                },
                { transaction }
            );

            res.setHeader("Content-Type", "application/xml");
            res.status(200).send(archivoModificado);
        }
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        logger.error(`[${fileName} -> connectSubprocess] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Funcion para guardar un nuevo proceso
export const saveNewProcessChanges = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { archivo, imagen } = req.files;
        const { id_creador, aprobadores, nombre, descripcion, nivel, esMacroproceso } = req.body;

        const { s3_bucket, s3_bucket_procesos, s3_bucket_imagenes } = await getAdminConfig();
        const datoArchivo = await extraerDatosBpmn(archivo);
        const idProceso = datoArchivo.idProceso;

        const aprobadoresArray = typeof aprobadores === "string"
            ? aprobadores.split(",").map((id) => Number(id.trim()))
            : Array.isArray(aprobadores)
            ? aprobadores.map(Number)
            : [Number(aprobadores)];


        if (!req.files || Object.keys(req.files).length === 0) {
            throw new FileError("No se pudo procesar el archivo xml")
        }

        const nuevoProceso = await createProcessIfNotExist(
            id_creador,
            idProceso,
            nivel,
            nombre,
            descripcion,
            null,
            esMacroproceso,
            transaction
        );

        const proceso = await Procesos.findOne({
            where: {
                id_bpmn: idProceso,
            }, transaction
        });

        const nuevaVersion = await VersionProceso.create({
            id_creador,
            id_proceso: proceso.id_proceso,
            id_bpmn: idProceso,
            nombre_version: "1.0",
        }, {transaction});

        for (const aprobador of aprobadoresArray) {
            await ProcesosAprobadores.create({
                id_proceso: proceso.id_proceso,
                id_cargo: aprobador
                
            }, {transaction})
        }

        const datosProceso = {
            id_version_proceso: nuevaVersion.id_version_proceso,
            id_bpmn: nuevoProceso.id_bpmn
        }

        await uploadFileToS3(
            s3_bucket,
            `${s3_bucket_procesos}/${idProceso}.bpmn`,
            archivo.data,
            "application/xml",
            "1.0",
            "borrador"
        );

        await uploadFileToS3(
            s3_bucket,
            `${s3_bucket_imagenes}/${idProceso}.png`,
            imagen.data,
            "image/png",
            "1.0",
            "borrador"
        );

        await transaction.commit();
        
        res.status(201).json({
            code: 201,
            message: "Proceso Guardado Correctamente",
            data: datosProceso
        });
    } catch (error) {
        await transaction.rollback();
        logger.error(`[${fileName} -> connectSubprocess] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Funcion que obtiene los subprocesos de un proceso
export const getSubprocessesOfProcess = async (req, res, next) => {
    try {
        const { idProceso } = req.params;
        const subprocesos = await IntermediaProcesos.findAll({
            where: { id_bpmn_padre: idProceso },
            include: [
                {
                    model: Procesos,
                    as: "id_bpmn_proceso",
                    include: [
                        {
                            model: Usuarios,
                            as: "id_creador_usuario",
                            attributes: ["nombre"],
                        },
                        {
                            model: VersionProceso,
                            as: "version_procesos",
                            attributes: [
                                "nombre_version",
                                "id_version_proceso",
                            ],
                            where: { estado: "aprobado" },
                        },
                    ],
                },
            ],
        });

        if (!subprocesos) {
            return res.status(200).json({
                code: 200,
                message: "No hay subprocesos vinculados a este proceso",
                data:[]
            });
        }

        const subprocesosMap = subprocesos.map((subproceso) => ({
            id_bpmn: subproceso.id_bpmn,
            nombre: subproceso.id_bpmn_proceso?.nombre,
            created_at: formatShortTime(subproceso.id_bpmn_proceso?.created_at),
            creador: subproceso.id_bpmn_proceso?.id_creador_usuario?.nombre,
            version:
                subproceso.id_bpmn_proceso?.version_procesos?.[0]
                    ?.id_version_proceso,

            procesoPadre: subproceso.id_bpmn_padre,
            callActivity: subproceso.call_activity,
        }));

        res.status(200).json({
            code: 200,
            message: "Subprocesos encontrados",
            data: subprocesosMap,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getSubprocessesOfProcess] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Función que obtiene los procesos de un aprobador
export const getPendingProcess = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;

        const aprobacionesPendientes = await Aprobadores.findAll({
            where: {
                id_usuario: idUsuario,
            },
            include: [
                {
                    model: VersionProceso,
                    as: "version_proceso",
                    include: [
                        {
                            model: Procesos,
                            as: "id_proceso_proceso",
                            attributes: ["id_bpmn", "nombre", "descripcion"],
                        },
                    ],
                },
            ],
        });

        if(aprobacionesPendientes.length === 0){
            return res.status(200).json({
                code: 200,
                message: "No hay Aprobaciones Pendientes",
                data: [],
            })
        }

        const resultadosMapeados = aprobacionesPendientes.map((item) => ({
            idAprobador: item.id_aprobador,
            idUsuario: item.id_usuario,
            idVersionProceso: item.id_version_proceso,
            estado: item.estado,
            fechaCreacionAprobacion: formatShortTime(item.created_at),

            idCreadorVersion: item.version_proceso?.id_creador,
            nombreVersion: item.version_proceso?.nombre_version,
            idBpmn: item.version_proceso?.id_bpmn,

            nombreProceso: item.version_proceso?.id_proceso_proceso?.nombre,
            descripcionProceso:
                item.version_proceso?.id_proceso_proceso?.descripcion,
        }));

        res.status(200).json({
            code: 200,
            message:
                "Procesos Pendientes de Aprobación obtenidos correctamtente",
            data: resultadosMapeados,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getPendingProcess] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Función que obtiene los borradores de un diseñador
export const getPendingDraft = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;

        const borradoresActivos = await VersionProceso.findAll({
            where: {
                id_creador: idUsuario,
            },
            include: [
                {
                    model: Procesos,
                    as: "id_proceso_proceso",
                    attributes: [
                        "id_bpmn",
                        "nombre",
                        "descripcion",
                    ],
                },
                
            ],
        });

        if(borradoresActivos.length === 0){
            return res.status(200).json({
                code: 200,
                message: "No hay Aprobaciones Pendientes",
                data: [],
            })
        }

        const resultadosMapeados = borradoresActivos.map((item) => ({
            idVersionProceso: item.id_version_proceso,
            idProceso: item.id_proceso,
            nombre_version: item.nombre_version,
            observacion: item.observacion_version,
            estado: item.estado,
            idBpmn: item.id_bpmn,
            fechaCreacion: formatShortTime(item.created_at),
            nombreProceso: item.id_proceso_proceso?.nombre,
            descripcionProceso: item.id_proceso_proceso?.descripcion,
        }));

        res.status(200).json({
            code: 200,
            message: "Borradores Activos obtenidos correctamtente",
            data: resultadosMapeados,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getPendingDraft] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Función que extrae contenido de un archivo BPMN para visualizar el resumen del proceso
export const getProcessSummary = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { idProceso, version } = req.params;

        let xmlContent;
        let versionProceso;
        const { s3_bucket, s3_bucket_procesos } = await getAdminConfig();

        if (!version || version === "undefined") {
            versionProceso = await VersionProceso.findOne({
                where: {
                    id_bpmn: idProceso,
                    estado: "aprobado",
                },
            });
            xmlContent = await getFileFromS3Version(
                s3_bucket,
                `${s3_bucket_procesos}/${idProceso}.bpmn`,
                versionProceso.nombre_version
            );
        } else {
            versionProceso = await VersionProceso.findOne({
                where: {
                    id_bpmn: idProceso,
                    id_version_proceso: version,
                },
            });
            xmlContent = await getFileFromS3Version(
                s3_bucket,
                `${s3_bucket_procesos}/${idProceso}.bpmn`,
                versionProceso.nombre_version
            );
        }

        const participantes = extraerParticipantesBpmn(xmlContent);

        const cargos = await Cargo.findAll({
            attributes: ["id_cargo", "nombre"],
        });

        const mapaCargos = {};
            cargos.forEach(c => {
            mapaCargos[c.id_cargo.toString()] = c.nombre;
            });

            const participantesConNombres = {};
            for (const [rol, ids] of Object.entries(participantes)) {
            participantesConNombres[rol] = ids.map(id => mapaCargos[id] || `ID ${id} no encontrado`);
            }

        

        const proceso = await Procesos.findOne({
            include: [
                {
                    model: Usuarios,
                    as: "id_creador_usuario",
                    attributes: ["nombre"],
                },
            ],
            where: {
                id_bpmn: idProceso,
            },
        });

        const aprobadores = await Aprobadores.findAll({
            where: {
                id_version_proceso: versionProceso.id_version_proceso,
            },
            raw: true,
            include: [
                {
                    model: Usuarios,
                    as: "id_usuario_usuario",
                    attributes: ["nombre"],
                },
            ],
        });

        console.log(aprobadores);

        const subprocesos = await IntermediaProcesos.findAll({
            where: {
                id_bpmn_padre: idProceso,
            },
            include: [
                {
                    model: Procesos,
                    as: "id_bpmn_proceso",
                    attributes: ["id_bpmn", "nombre"],
                    include: [
                        {
                            model: VersionProceso,
                            as: "version_procesos",
                            order: [["created_at", "DESC"]],
                        },
                    ],
                },
            ],
        });

        const subprocesosMap = subprocesos.map((subproceso) => ({
            id: subproceso.id_bpmn_proceso?.id_bpmn,
            nombre: subproceso.id_bpmn_proceso?.nombre,
            version:
                subproceso.id_bpmn_proceso?.version_procesos?.[0]
                    ?.id_version_proceso,
        }));

        const resumenProceso = {
            subprocesos: subprocesosMap,
            ...participantesConNombres,
            tiempoSLA: ["2 días", "Automatizable 70%"],
        };

        const fechaFormateada = formatearFecha(proceso.created_at);

        const headerProceso = {
            nombre: proceso.nombre,
            descripcion: proceso.descripcion,
            creador: proceso.id_creador_usuario?.nombre,
            aprobadores: aprobadores.map(
                (aprobador) => aprobador["id_usuario_usuario.nombre"]
            ),
            fechaCreacion: fechaFormateada,
            estado: proceso.estado,
            estadoVersion: versionProceso.estado,
            version: versionProceso.nombre_version,
        };
        await transaction.commit();
        res.status(200).json({
            code: 200,
            message: "Resumen de Proceso",
            data: resumenProceso,
            dataHeader: headerProceso,
        });
    } catch (error) {
        await transaction.rollback();
        logger.error(`[${fileName} -> getProcessSummary] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Función Para descargar un proceso
export const downloadFiles = async (req, res, next) => {
    try {
        const { fileName } = req.params;
        const { s3_bucket, s3_bucket_adjuntos } = await getAdminConfig();

        const { Body, ContentType, ContentLength } = await downloadFromS3(
            `${s3_bucket_adjuntos}/${fileName}`,
            `${s3_bucket}`
        );
        const mimeType = mime.lookup(fileName) || "application/octet-stream";

        res.setHeader("Content-Type", ContentType || mimeType);
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
        );
        res.setHeader("Content-Length", ContentLength);

        Body.pipe(res);
    } catch (error) {
        logger.error(`[${fileName} -> downloadFiles] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Función Para descargar un proceso
export const downloadProcess = async (req, res, next) => {
    try {
        const { idProceso } = req.params;
        const fileName = `${idProceso}.bpmn`;
        const { s3_bucket, s3_bucket_procesos } = await getAdminConfig();

        const { Body, ContentType, ContentLength } = await downloadFromS3(
            `${s3_bucket_procesos}/${fileName}`,
            `${s3_bucket}`
        );

        res.setHeader(
            "Content-Type",
            ContentType || "application/octet-stream"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
        );
        res.setHeader("Content-Length", ContentLength);

        Body.pipe(res);
    } catch (error) {
        logger.error(`[${fileName} -> downloadProcess] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Función obtener las versiones de un proceso
export const getProcessVersions = async (req, res, next) => {
    try {
        const { idProceso } = req.params;

        const versiones = await VersionProceso.findAll({
            where: {
                id_bpmn: idProceso,
            },
        });

        const versionesMap = versiones.map((version) => {
            const data = version.toJSON();
            return {
                ...data,
                created_at: formatShortTime(data.created_at),
            };
        });

        res.status(200).json({
            code: 200,
            message: "Oportunidades obtenidas correctamente",
            data: versionesMap,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getProcessVersions] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Función para crear o guardar cambios de  una nueva versión de un proceso
export const createNewProcessVersion = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { idProceso, version, id_creador } = req.body;
        const { archivo, imagen } = req.files;
        const { s3_bucket, s3_bucket_procesos, s3_bucket_imagenes } = await getAdminConfig();

        const proceso = await Procesos.findOne({
            where: { id_bpmn: idProceso },
        }, transaction);

        if(!proceso){
            throw new NotFoundError("El Proceso buscado no existe")
        }

        const versionBase = await VersionProceso.findByPk(version);
        if (!versionBase) {
            return res
                .status(404)
                .json({ code: 404, message: "Versión base no encontrada" });
        }

        const borradorAcutal = await VersionProceso.findOne({
            where: {
                id_version_proceso: version,
                id_bpmn: idProceso,
                estado: "borrador",
            },
        }, transaction);

        if (borradorAcutal) {
            await uploadFileToS3(
                `${s3_bucket}`,
                `${s3_bucket_procesos}/${idProceso}.bpmn`,
                archivo.data,
                "application/xml",
                borradorAcutal.nombre_version,
                "borrador"
            );

            await uploadFileToS3(
                `${s3_bucket}`,
                `${s3_bucket_imagenes}/${idProceso}.png`,
                imagen.data,
                "image/png",
                borradorAcutal.nombre_version,
                "borrador"
            );
            return res.status(201).json({
                code: 201,
                message: "Borrador Guardado con éxito",
            });
        }

        const ultimaVersion = await VersionProceso.findByPk(version);
        const nuevaVersion = (
            parseFloat(ultimaVersion.nombre_version) + 0.1
        ).toFixed(1);

        const versionSuperior = await VersionProceso.findOne({
            where: {
                id_bpmn: idProceso,
                nombre_version: nuevaVersion,
            },
        }, transaction);

        const borrador = await VersionProceso.findOne({
            where: {
                id_bpmn: idProceso,
                estado: "borrador",
            },
        },transaction);

        if (versionSuperior && borrador) {
            return res.status(409).json({
                code: 409,
                message: `Ya existe un borrador para esta versión.`,
            });
        }

        if (versionSuperior) {
            return res.status(409).json({
                code: 409,
                message: `Ya existe una versión posterior (${nuevaVersion}). debes crear una nueva versión a partir de la última versión aprobada.`,
            });
        }

        const nuevaVersionCreada = await VersionProceso.create({
            id_proceso: proceso.id_proceso,
            id_creador,
            id_aprobador: ultimaVersion.id_aprobador,
            nombre_version: nuevaVersion,
            estado: "borrador",
            id_bpmn: idProceso,
        }, { transaction });

        
        await uploadFileToS3(
            `${s3_bucket}`,
            `${s3_bucket_imagenes}/${idProceso}.png`,
            imagen.data,
            "image/png",
            nuevaVersion,
            "borrador"
        );
        await transaction.commit();
        res.status(201).json({
            code: 201,
            message: "Borrador creado con éxito",
            data: nuevaVersionCreada
        });
    } catch (error) {
        await transaction.rollback();
        logger.error(`[${fileName} -> createNewProcessVersion] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Función para generar documentación (aún en desarrollo)
export const generarDocumentacion = async (req, res, next) => {
    try {
        const { idProceso, version } = req.body;
        const { s3_bucket, s3_bucket_procesos } = await getAdminConfig();

        const versionProceso = await VersionProceso.findOne({
            where: {
                id_bpmn: idProceso,
                id_version_proceso: version,
            },
        });

        const xmlContent = await getFileFromS3Version(
            `${s3_bucket}`,
            `${s3_bucket_procesos}/${idProceso}.bpmn`,
            versionProceso.nombre_version
        );

        const imagen = await getImageFromS3Version(
            "test-bpmn",
            "Imagenes-Procesos/Id_6ba9787b-da8d-4cb1-a417-8f793a457e11.png",
            "1.0"
        );

        const base64 = imagen.toString("base64");
        const dataUrl = `data:image/png;base64,${base64}`;

        const macroProceso = await getMacroProcessData(xmlContent);

        const portada = generarPortada(macroProceso.name, dataUrl);
        const contenidoMacro = generarContenidoMacroproceso(macroProceso);
        const procesos = await IntermediaProcesos.findAll({
            attributes: ["id_bpmn"],
            where: {
                id_bpmn_padre: idProceso,
            },
        });

        let contenidoProcesos = "";
        for (const proceso of procesos) {
            const xmlContent = await getDataFileBpmnFromS3(
                `${s3_bucket}`,
                `${s3_bucket_procesos}/${proceso.id_bpmn}.bpmn`
            );
            const procesoDataArray = await getProcessData(xmlContent);
            for (const procesoData of procesoDataArray) {
                contenidoProcesos += generarContenidoProceso(procesoData);
            }
        }

        const template = generarTemplateFinal({
            portada,
            contenidoMacro,
            contenidoProcesos,
        });

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setContent(template, { waitUntil: "load" });

        const rutaRelativa = path.join("upload", `debug-${idProceso}.html`);
        const rutaAbsoluta = path.join(__dirname, "../", rutaRelativa);
        fs.writeFileSync(rutaAbsoluta, template);
        const rutaRelativaPDF = path.join("upload", `debug-${idProceso}.pdf`);
        const rutaAbsolutaPDF = path.join(__dirname, "../", rutaRelativaPDF);

        const buffer = await page.pdf({
            path: rutaAbsolutaPDF,
            format: "A4",
            margin: {
                top: "0.4in",
                bottom: "0.4in",
                left: "0.4in",
                right: "0.4in",
            },
            printBackground: true,
        });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=documentacion_${idProceso}.pdf`
        );
        res.send(buffer);
    } catch (error) {
        logger.error(`[${fileName} -> generarDocumentacion] ${error.message}`);
        console.log(error);
        next(error);
    }
};
