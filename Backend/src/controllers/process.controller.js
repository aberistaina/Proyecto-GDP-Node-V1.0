import * as path from "path";
import mime from "mime-types";
import { fileURLToPath } from "url";
import fs from "fs"; //Debug, luego borrar
import puppeteer from "puppeteer";
import {
    Procesos,
    IntermediaProcesos,
    Usuarios,
    Aprobadores,
    ComentariosVersionProceso,
    VersionProceso,
    OportunidadesMejora,
    Niveles,
    Cargo,
    BitacoraAprobaciones,
    ArchivosOportunidadesMejora,
    ArchivosComentariosVersionProceso,
} from "../models/models.js";
import logger from "../utils/logger.js";
import {
    changeCallElement,
    extraerDatosBpmn,
    formatFileName,
    extraerParticipantesBpmn,
} from "../utils/bpmnUtils.js";
import { formatearFecha, formatShortTime } from "../utils/formatearFecha.js";
import {
    createAssociation,
    createProcessIfNotExist,
    getProximoCiclo,
    obtenerUltimaVersionProceso,
} from "../services/Bpmn.services.js";
import {
    getDataFileBpmnFromS3,
    uploadFileToS3,
    downloadFromS3,
    getFileFromS3Version,
    getImageFromS3Version,
} from "../services/s3Client.services.js";
import { moveFile } from "../utils/uploadFile.js";
import { sequelize } from "../database/database.js";
import { documentacionTemplate } from "../utils/documentacionTemplate.js";
import { getAdminConfig } from "../services/admin.services.js";
import {
    getMacroProcessData,
    getProcessData,
} from "../services/documentacion.services.js";
import {
    generarContenidoMacroproceso,
    generarPortada,
    generarContenidoProceso,
    generarTemplateFinal,
} from "../utils/documentacion.js";
import { isValidFilesExtension } from "../utils/validators.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Función para obtener todos los procesos
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
        next(error);
    }
};

//Función leer el contenido XML de la versión actual del proceso desde S3
export const readActualProcessVersion = async (req, res, next) => {
    try {
        const { idProceso, version } = req.params;

        const procesoVersionActual = await VersionProceso.findByPk(version);

        const versionActiva = procesoVersionActual.nombre_version;

        const { s3_bucket, s3_bucket_procesos } = await getAdminConfig();

        const xmlContent = await getFileFromS3Version(
            s3_bucket,
            `${s3_bucket_procesos}/${idProceso}.bpmn`,
            versionActiva
        );

        res.setHeader("Content-Type", "application/xml");
        res.status(200).send(xmlContent);
    } catch (error) {
        logger.error("Controlador readProcessById", error);
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

        const xmlContent = await getFileFromS3Version(
            s3_bucket,
            `${s3_bucket_procesos}/${idProceso}.bpmn`,
            versionProceso.nombre_version
        );

        res.setHeader("Content-Type", "application/xml");
        res.status(200).send(xmlContent);
    } catch (error) {
        logger.error("Controlador readSubprocesoById", error);
        console.log(error);
        next(error);
    }
};

//Función que vincula un subproceso a un proceso
export const connectSubprocess = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const {
            idProceso,
            calledElement,
            callActivity,
            aprobadores,
            nivel,
            nombre,
            descripcion,
            esMacroproceso,
            id_creador,
        } = req.body;
        console.log(req.body);
        const { archivo } = req.files;
        const archivoTransformado = archivo.data.toString("utf8");

        const procesoPadre = await Procesos.findOne(
            { where: { id_bpmn: idProceso } },
            { transaction }
        );

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

        const subproceso = await Procesos.findOne(
            { where: { id_bpmn: calledElement } },
            { transaction }
        );
        const nombreSubproceso = subproceso.nombre;

        const referenciaExistente = await IntermediaProcesos.findOne(
            {
                where: {
                    id_bpmn_padre: idProceso,
                    call_activity: callActivity,
                },
            },
            { transaction }
        );
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
        logger.error("Controlador updateSubproceso", error);
        console.log(error);
        next(error);
    }
};

//Función para subir procesos a S3 y guardar en la base de datos
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
        const { id_aprobador, id_creador, id_nivel } = req.body;

        //Variables momentáneas
        const estado = "activo";
        //variables momentáneas
        const id_aprobadores_cargo = "3";

        const archivosArray = Array.isArray(archivos) ? archivos : [archivos];
        const datosArchivos = [];

        for (const archivo of archivosArray) {
            const datoArchivo = await extraerDatosBpmn(archivo);
            /* const nombreArchivo = formatFileName(archivo.name.split(".")[0]) */

            const nombreProceso = datoArchivo.name;
            datosArchivos.push(datoArchivo);

            const { idProceso, subProcesos } = datoArchivo;

            const nuevoProceso = await createProcessIfNotExist(
                id_creador,
                idProceso,
                id_aprobadores_cargo,
                id_nivel,
                nombreProceso,
                null,
                estado,
                null,
                transaction
            );

            const versionExistente = await VersionProceso.findOne({
                where: {
                    id_proceso: nuevoProceso.id_proceso,
                    estado: "aprobado",
                },
                transaction,
            });

            if (!versionExistente) {
                await VersionProceso.create(
                    {
                        id_proceso: nuevoProceso.id_proceso,
                        id_creador,
                        id_aprobadores_cargo,
                        nombre_version: "1.0",
                        estado: "aprobado",
                        id_bpmn: idProceso,
                    },
                    { transaction }
                );
            }

            for (const subProceso of subProcesos) {
                const callActivity = subProceso.callActivity;
                const calledElement = subProceso.calledElement;

                if (calledElement) {
                    await createProcessIfNotExist(
                        id_creador,
                        calledElement,
                        id_aprobadores_cargo,
                        id_nivel,
                        "pendiente",
                        null,
                        estado,
                        null,
                        transaction
                    );

                    if (callActivity) {
                        await createAssociation(
                            idProceso,
                            callActivity,
                            calledElement,
                            transaction
                        );
                    }
                }
            }
            const { s3_bucket, s3_bucket_procesos } = await getAdminConfig();
            await uploadFileToS3(
                `${s3_bucket}`,
                `${s3_bucket_procesos}/${idProceso}.bpmn`,
                archivo.data,
                "application/xml",
                "1.0",
                "activo"
            );
        }

        await transaction.commit();

        res.status(201).json({
            code: 201,
            message: "Procesos cargado correctamente",
        });
    } catch (error) {
        await transaction.rollback();
        logger.error("Controlador Cargar Proceso", error);
        console.log(error);
        next(error);
    }
};

//Funcion para guardar un nuevo proceso
export const saveNewProcessChanges = async (req, res, next) => {
    try {
        const { archivo, imagen } = req.files;
        const {
            id_creador,
            aprobadores,
            nombre,
            descripcion,
            nivel,
            esMacroproceso,
        } = req.body;

        const datoArchivo = await extraerDatosBpmn(archivo);
        const idProceso = datoArchivo.idProceso;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                code: 400,
                message: "No se ha subido ningún archivo.",
            });
        }

        await createProcessIfNotExist(
            id_creador,
            idProceso,
            aprobadores,
            nivel,
            nombre,
            descripcion,
            null,
            esMacroproceso,
            null
        );

        const proceso = await Procesos.findOne({
            where: {
                id_bpmn: idProceso,
            },
        });

        await VersionProceso.create({
            id_creador,
            id_proceso: proceso.id_proceso,
            id_bpmn: idProceso,
            nombre_version: "1.0",
        });

        await uploadFileToS3(
            s3_bucket,
            `${s3_bucket_procesos}/${idProceso}.bpmn`,
            archivo.data,
            "application/xml",
            "1.0",
            "borrador"
        );

        res.status(201).json({
            code: 201,
            message: "Proceso Guardado Correctamente",
        });
    } catch (error) {
        logger.error("Controlador Save Changes", error);
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
            res.status(400).json({
                code: 400,
                message: "No hay subprocesos vinculados a este proceso",
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
        logger.error("Controlador Save Changes", error);
        console.log(error);
        next(error);
    }
};

//Función que envía borrador para su aprobación
export const enviarAprobacion = async (req, res, next) => {
    try {
        const { idProceso, version } = req.body;

        const proceso = await Procesos.findOne({
            where: {
                id_bpmn: idProceso,
            },
        });

        const aprobadores = await Usuarios.findAll({
            where: {
                id_cargo: proceso.id_aprobadores_cargo,
            },
        });

        const versionProceso = await VersionProceso.findByPk(version);

        await versionProceso.update({ estado: "enviado" });

        const nuevoCiclo = await getProximoCiclo(version);
        const cicloActual = nuevoCiclo - 1;

        const cicloEnCurso = await Aprobadores.findOne({
            where: {
                id_version_proceso: version,
                ciclo_aprobacion: cicloActual,
            },
        });

        if (cicloEnCurso) {
            return res.status(400).json({
                code: 400,
                message: `Ya existe una solicitud de aprobación activa para este Proceso.`,
            });
        }

        for (const aprobador of aprobadores) {
            await Aprobadores.create({
                id_usuario: aprobador.id_usuario,
                id_version_proceso: version,
                estado: "pendiente",
                ciclo_aprobacion: nuevoCiclo,
            });
        }

        res.status(201).json({
            code: 201,
            message: "Proceso Enviado para su Aprobación",
        });
    } catch (error) {
        logger.error("Controlador Enviar Aprobacion", error);
        console.log(error);
        next(error);
    }
};

//Función que aprueba un borrador
export const aprobarProceso = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { idProceso, id_usuario, version } = req.body;

        const solicitud = await Aprobadores.findOne({
            where: {
                id_usuario,
                id_version_proceso: version,
            },
            transaction,
        });

        const proceso = await Procesos.findOne({
            where: {
                id_bpmn: idProceso,
            },
            transaction,
        });

        if (!proceso) {
            await transaction.rollback();
            return res.status(400).json({
                code: 400,
                message: "No existe el proceso que está intentando aprobar",
            });
        }

        if (!solicitud) {
            await transaction.rollback();
            return res.status(400).json({
                code: 400,
                message: "No existe la solicitud que está intentando aprobar",
            });
        }

        await solicitud.update({ estado: "aprobado" }, { transaction });

        const solicitudes = await Aprobadores.findAll({
            where: {
                id_version_proceso: version,
            },
            transaction,
        });

        const hayPendientes = solicitudes.some((s) => s.estado === "pendiente");
        const hayRechazadas = solicitudes.some((s) => s.estado === "rechazado");
        const solicitudesAprobadas = solicitudes.every(
            (s) => s.estado === "aprobado"
        );

        if (solicitudesAprobadas) {
            const versionBorrador = await VersionProceso.findByPk(version);
            const nombreVersionBorradorAnterior = (
                parseFloat(versionBorrador.nombre_version) - 0.1
            ).toFixed(1);
            const versionAnterior = await VersionProceso.findOne({
                where: {
                    id_bpmn: idProceso,
                    nombre_version: nombreVersionBorradorAnterior,
                },
            });

            await versionAnterior.update(
                {
                    estado: "inactivo",
                },
                { transaction }
            );

            await versionBorrador.update(
                {
                    estado: "aprobado",
                },
                { transaction }
            );
        } else if (hayRechazadas && !hayPendientes) {
            await Aprobadores.destroy({
                where: {
                    id_version_proceso: version,
                },
                transaction,
            });

            const versionProceso = await VersionProceso.findOne({
                where: {
                    id_bpmn: idProceso,
                    id_version_proceso: version,
                },
                transaction,
            });

            await versionProceso.update(
                { estado: "rechazado" },
                { transaction }
            );
        }

        await transaction.commit();
        res.status(200).json({
            code: 200,
            message: "Proceso Aprobado",
        });
    } catch (error) {
        await transaction.rollback();
        logger.error("Controlador Enviar Aprobacion", error);
        console.log(error);
        next(error);
    }
};

//Función que rechaza un borrador
export const rechazarProceso = async (req, res, next) => {
    try {
        const transaction = await sequelize.transaction();
        const { idProceso, id_usuario, version } = req.body;

        const solicitud = await Aprobadores.findOne({
            where: {
                id_usuario,
                id_version_proceso: version,
            },
            transaction,
        });

        const proceso = await Procesos.findOne({
            where: {
                id_bpmn: idProceso,
            },
            transaction,
        });

        if (!proceso) {
            await transaction.rollback();
            return res.status(400).json({
                code: 400,
                message: "No existe el proceso que está intentando aprobar",
            });
        }

        if (!solicitud) {
            await transaction.rollback();
            return res.status(400).json({
                code: 400,
                message: "No existe la solicitud que está intentando aprobar",
            });
        }

        await solicitud.update({ estado: "rechazado" }, { transaction });

        const solicitudes = await Aprobadores.findAll({
            where: {
                id_version_proceso: version,
            },
            transaction,
        });

        const hayPendientes = solicitudes.some((s) => s.estado === "pendiente");

        if (!hayPendientes) {
            await Aprobadores.destroy({
                where: {
                    id_version_proceso: version,
                },
                transaction,
            });

            const versionProceso = await VersionProceso.findOne({
                where: {
                    id_bpmn: idProceso,
                    id_version_proceso: version,
                },
                transaction,
            });

            await versionProceso.update(
                { estado: "rechazado" },
                { transaction }
            );
        }

        await transaction.commit();
        res.status(200).json({
            code: 200,
            message: "Proceso Rechazado ",
        });
    } catch (error) {
        await transaction.rollback();
        logger.error("Controlador Enviar Aprobacion", error);
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
        logger.error("Controlador getPendingProcess", error);
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
                        "id_aprobadores_cargo",
                    ],
                },
            ],
        });

        const resultadosMapeados = borradoresActivos.map((item) => ({
            idVersionProceso: item.id_version_proceso,
            idProceso: item.id_proceso,
            idAprobador: item.id_proceso_proceso?.id_aprobadores_cargo,
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
        logger.error("Controlador getPendingDraft", error);
        console.log(error);
        next(error);
    }
};

//Función que extrae contenido de un archivo BPMN para visualizar el resumen del proceso
export const getProcessSummary = async (req, res, next) => {
    try {
        const { idProceso, version } = req.params;
        let xmlContent;
        let versionProceso;
        const { s3_bucket, s3_bucket_procesos } = await getAdminConfig();

        if (!version || version === "undefined") {
            xmlContent = await getDataFileBpmnFromS3(
                "test-bpmn",
                `${s3_bucket_procesos}/${idProceso}.bpmn`
            );
            versionProceso = await VersionProceso.findOne({
                where: {
                    id_bpmn: idProceso,
                    estado: "aprobado",
                },
            });
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
                id_aprobador: proceso.id_aprobadores_cargo,
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
            ...participantes,
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

        res.status(200).json({
            code: 200,
            message: "Resumen de Proceso",
            data: resumenProceso,
            dataHeader: headerProceso,
        });
    } catch (error) {
        logger.error("Controlador Resumen Proceso", error);
        console.log(error);
        next(error);
    }
};

//Funcion que crea los comentarios de la versión de un proceso
export const createCommentary = async (req, res, next) => {
    try {
        const { idProceso, comentario, version, id_usuario } = req.body;

        await ComentariosVersionProceso.create({
            id_usuario,
            id_bpmn: idProceso,
            comentario,
            id_version_proceso: version,
        });

        res.status(201).json({
            code: 201,
            message: "Comentario creado correctamente",
        });
    } catch (error) {
        logger.error("Controlador Crear Comentario", error);
        console.log(error);
        next(error);
    }
};

//Función que obtiene los comentarios de la versión un proceso
export const getCommentaries = async (req, res, next) => {
    try {
        const { idProceso, version } = req.params;

        const comentarios = await ComentariosVersionProceso.findAll({
            include: [
                {
                    model: Usuarios,
                    as: "id_usuario_usuario",
                    attributes: ["nombre"],
                },
            ],
            where: {
                id_bpmn: idProceso,
                id_version_proceso: version,
            },
            order: [["created_at", "DESC"]],
        });

        const comentariosMap = comentarios.map((comentario) => {
            const data = comentario.toJSON();
            return {
                ...data,
                nombre_creador: comentario.id_usuario_usuario?.nombre,
                created_at: formatShortTime(data.created_at),
            };
        });

        res.status(202).json({
            code: 202,
            message: "Comentarios obtenidos correctamente",
            data: comentariosMap,
        });
    } catch (error) {
        logger.error("Controlador Obtener Comentarios", error);
        console.log(error);
        next(error);
    }
};

//Función que obtiene los Archivos de un comentario
export const getComentariesFiles = async(req, res, next) =>{
    try {
        const { idComentario } = req.params;

        const archivos = await ArchivosComentariosVersionProceso.findAll({
            where:{
                id_comentario: idComentario
            }
        })

        res.status(202).json({
            code: 202,
            message: "Archivos obtenidos correctamente",
            data: archivos,
        });
    } catch (error) {
        logger.error("Controlador getComentariesFiles", error);
        console.log(error);
        next(error);
    }
}

//Funcion que crea las oportunidades de la versión de un proceso
export const createOppotunity = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { s3_bucket, s3_bucket_adjuntos } = await getAdminConfig();
        const { idProceso, descripcion, asunto, version, id_usuario } =
            req.body;
        const archivos = req.files?.archivos || null;


        const nuevaOportunidad = await OportunidadesMejora.create({
            id_usuario,
            id_bpmn: idProceso,
            asunto,
            descripcion,
            id_version_proceso: version,
        }, {transaction});

        const nombreVersion = await VersionProceso.findByPk(version , {transaction})

        if(archivos){
            const archivosArray = Array.isArray(archivos) ? archivos : [archivos];
            for (const archivo of archivosArray) {

                isValidFilesExtension(archivo)
                const mimeType = mime.lookup(archivo.name) || "application/octet-stream";
                
                await ArchivosOportunidadesMejora.create({
                    id_oportunidad: nuevaOportunidad.id_oportunidad,
                    nombre: archivo.name,
                    s3_key: `${s3_bucket_adjuntos}/${archivo.name}`
                } , {transaction})

                await uploadFileToS3(
                    `${s3_bucket}`,
                    `${s3_bucket_adjuntos}/${archivo.name}`,
                    archivo.data,
                    mimeType,
                    `${nombreVersion.nombre_version}`,
                    `${nombreVersion.estado}`
                );
            }
            
        }

        await transaction.commit()
        res.status(201).json({
            code: 201,
            message: "Oportunidad creada correctamente",
        });
    } catch (error) {
        await transaction.rollback();
        logger.error("Controlador Crear Oportunidad", error);
        console.log(error);
        next(error);
    }
};

//Funcion que obtiene las oportunidades de la versión de un proceso
export const getOpportunities = async (req, res, next) => {
    try {
        const { idProceso, version } = req.params;

        let oportunidades = await OportunidadesMejora.findAll({
            include: [
                {
                    model: Usuarios,
                    as: "id_usuario_usuario",
                    attributes: ["nombre"],
                },
            ],
            where: {
                id_bpmn: idProceso,
                id_version_proceso: version,
            },
            order: [["created_at", "DESC"]],
        });

        const oportunidadesMap = oportunidades.map((oportunidad) => {
            const data = oportunidad.toJSON();
            return {
                ...data,
                nombre_creador: oportunidad.id_usuario_usuario?.nombre,
                created_at: formatShortTime(data.created_at),
            };
        });

        res.status(200).json({
            code: 200,
            message: "Oportunidades obtenidas correctamente",
            data: oportunidadesMap,
        });
    } catch (error) {
        logger.error("Controlador Crear Oportunidad", error);
        console.log(error);
        next(error);
    }
};

//Función que obtiene los Archivos de una oportunidad
export const getOpportunitiesFiles = async(req, res, next) =>{
    try {
        const { idComentario } = req.params;

        const archivos = await ArchivosOportunidadesMejora.findAll({
            where:{
                id_oportunidad: idComentario
            }
        })

        res.status(202).json({
            code: 202,
            message: "Archivos obtenidos correctamente",
            data: archivos,
        });
    } catch (error) {
        logger.error("Controlador getComentariesFiles", error);
        console.log(error);
        next(error);
    }
}

//Función Para descargar un proceso
export const downloadFiles = async (req, res, next) => {
    try {
        const { fileName } = req.params;
        const { s3_bucket, s3_bucket_adjuntos } = await getAdminConfig();
        console.log(s3_bucket_adjuntos);
        
        const { Body, ContentType, ContentLength } = await downloadFromS3(
            `${s3_bucket_adjuntos}/${fileName}`,
            `${s3_bucket}`
        );
        const mimeType = mime.lookup(fileName) || "application/octet-stream";

        res.setHeader(
            "Content-Type",
            ContentType || mimeType
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
        );
        res.setHeader("Content-Length", ContentLength);

        Body.pipe(res);
    } catch (error) {
        logger.error("Controlador downloadProcess", error);
        console.log(error);
        next(error);
    }
};

//Función que obtiene los niveles de los procesos
export const getNiveles = async (req, res, next) => {
    try {
        const niveles = await Niveles.findAll();

        res.status(200).json({
            code: 200,
            message: "Oportunidades obtenidas correctamente",
            data: niveles,
        });
    } catch (error) {
        logger.error("Controlador Obtener Niveles", error);
        console.log(error);
        next(error);
    }
};

//Función que obtiene un niveles de proceso por ID
export const getNivelById = async (req, res, next) => {
    try {
        const { idNivel } = req.params;

        const nivel = await Niveles.findOne({
            attributes: ["id_nivel", "nombre"],
            where: {
                id_nivel: idNivel,
            },
        });

        res.status(200).json({
            code: 200,
            message: "Nivel Obtenido correctamente",
            data: nivel,
        });
    } catch (error) {
        logger.error("Controlador getNivelById", error);
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

        const procesosMap = procesos.map((proceso) => ({
            ...proceso.toJSON(),
            created_at: formatShortTime(proceso.created_at),
            creador: proceso.id_creador_usuario?.nombre,
            version: proceso.version_procesos?.[0]?.id_version_proceso,
        }));

        res.status(200).json({
            code: 200,
            message: "Oportunidades obtenidas correctamente",
            data: procesosMap,
        });
    } catch (error) {
        logger.error("Controlador getProcessByNivel", error);
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
        logger.error("Controlador downloadProcess", error);
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
        logger.error("Controlador getProcessVersions", error);
        console.log(error);
        next(error);
    }
};

//Función para crear o guardar cambios de  una nueva versión de un proceso
export const createNewProcessVersion = async (req, res, next) => {
    try {
        const { idProceso, version, id_creador } = req.body;
        const { archivo, imagen } = req.files;
        const { s3_bucket, s3_bucket_procesos, s3_bucket_imagenes } = await getAdminConfig();

        const proceso = await Procesos.findOne({
            where: { id_bpmn: idProceso },
        });

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
        });

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
        });

        const borrador = await VersionProceso.findOne({
            where: {
                id_bpmn: idProceso,
                estado: "borrador",
            },
        });

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

        await VersionProceso.create({
            id_proceso: proceso.id_proceso,
            id_creador,
            id_aprobador: ultimaVersion.id_aprobador,
            nombre_version: nuevaVersion,
            estado: "borrador",
            id_bpmn: idProceso,
        });

        await uploadFileToS3(
            `${s3_bucket}`,
            `${s3_bucket_imagenes}/${idProceso}.png`,
            imagen.data,
            "image/png",
            nuevaVersion,
            "borrador"
        );

        res.status(201).json({
            code: 201,
            message: "Borrador creado con éxito",
        });
    } catch (error) {
        logger.error("Controlador createNewProcessVersion", error);
        console.log(error);
        next(error);
    }
};

//Función para crear un nuevo comentario en la bitácora
export const createNewBitacoraMessage = async (req, res, next) => {
    try {
        const { comentario, version, id_usuario } = req.body;

        await BitacoraAprobaciones.create({
            id_version_proceso: version,
            id_usuario: id_usuario,
            comentario,
        });
        res.status(201).json({
            code: 201,
            message: "Comentario creado con éxito",
        });
    } catch (error) {
        logger.error("Controlador createNewBitacoraMessage", error);
        console.log(error);
        next(error);
    }
};

//Función para crear obtener los comentario de la bitácora
export const getBitacoraMessages = async (req, res, next) => {
    try {
        const { version } = req.params;

        const comentarios = await BitacoraAprobaciones.findAll({
            include: [
                {
                    model: Usuarios,
                    as: "usuario",
                    attributes: ["nombre"],
                },
            ],
            where: {
                id_version_proceso: version,
            },
            order: [["created_at", "DESC"]],
        });

        const comentariosMap = comentarios.map((comentario) => {
            const data = comentario.toJSON();
            return {
                ...data,
                nombre_creador: comentario.id_usuario_usuario?.nombre,
                created_at: formatShortTime(data.created_at),
            };
        });

        res.status(200).json({
            code: 200,
            message: "Comentarios obtenidos correctamente",
            data: comentariosMap,
        });
    } catch (error) {
        logger.error("Controlador getBitacoraMessages", error);
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
        logger.error("Controlador getBitacoraMessages", error);
        console.log(error);
        next(error);
    }
};
