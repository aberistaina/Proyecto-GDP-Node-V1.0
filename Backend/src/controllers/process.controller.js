import * as path from "path";
import { fileURLToPath } from "url";
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
    obtenerUltimaVersionProceso
} from "../services/Bpmn.services.js";
import {
    getDataFileBpmnFromS3,
    uploadFileToS3,
    downloadFromS3,
    getFileFromS3Version,
} from "../services/s3Client.services.js";
import { moveFile } from "../utils/uploadFile.js";
import { sequelize } from "../database/database.js";
import { createLogger } from "winston";

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
        next(error);
    }
};

//Función leer el contenido XML de un subproceso desde S3
export const readActualProcessVersion = async (req, res, next) => {
    try {
        const { idProceso, version } = req.params;

        const procesoVersionActual = await VersionProceso.findByPk(version);

        const versionActiva = procesoVersionActual.nombre_version;

        const xmlContent = await getFileFromS3Version(
            "test-bpmn",
            `${idProceso}.bpmn`,
            versionActiva,
            "activo"
        );

        res.setHeader("Content-Type", "application/xml");
        res.status(200).send(xmlContent);
    } catch (error) {
        logger.error("Controlador readProcessById", error);
        console.log(error);
        next(error);
    }
};

export const readProcessVersion = async (req, res, next) => {
    try {
        const { idProceso, version } = req.params;

        const versionProceso = await VersionProceso.findOne({
            where: {
                id_bpmn: idProceso,
                id_version_proceso: version,
            },
        });

        const xmlContent = await getFileFromS3Version(
            "test-bpmn",
            `${idProceso}.bpmn`,
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

export const connectSubprocess = async (req, res, next) => {
    try {
        const { idProceso, idSubProceso, callActivity } = req.body;

        const rutaRelativaProcesoPadre = path.join(
            "upload",
            `${idProceso}.bpmn`
        );
        const rutaAbsolutaProcesoPadre = path.join(
            __dirname,
            "../",
            rutaRelativaProcesoPadre
        );

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
            changeCallElement(
                rutaAbsolutaProcesoPadre,
                callActivity,
                idSubProceso,
                subProcesoName
            );
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
            changeCallElement(
                rutaAbsolutaProcesoPadre,
                callActivity,
                idSubProceso,
                subProcesoName
            );
            return res.status(200).json({
                code: 200,
                message: "Subproceso vinculado correctamente",
            });
        }
    } catch (error) {
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
        const id_aprobadores_cargo = "3"

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

            await uploadFileToS3(
                "test-bpmn",
                `${idProceso}.bpmn`,
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

//Guardar cambios cuando se trabaja en el modelador o crear un nuevo proceso si este no existe
export const saveProcessChanges = async (req, res, next) => {
    try {
        const { archivo } = req.files;
        const {
            id_creador,
            aprobadores,
            nombre,
            descripcion,
            nivel,
            esMacroproceso,
        } = req.body;

        
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

        const versionProceso = await VersionProceso.findOne({
            where: {
                id_bpmn: idProceso,
            },
        });

        if (!versionProceso) {
            await VersionProceso.create({
                id_creador,
                id_proceso: proceso.id_proceso,
                id_bpmn: idProceso,
                nombre_version: "1.0",
            });
        }else{

        }

        await uploadFileToS3(
            "test-bpmn",
            `${idProceso}.bpmn`,
            archivo.data,
            "application/xml"
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

export const saveSubProcessChanges = async (req, res, next) => {
    try {
        const { archivo } = req.files;
        const { idProcesoPadre, callActivity } = req.body;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                code: 400,
                message: "No se ha subido ningún archivo.",
            });
        }

        const { idProceso, name } = await extraerDatosBpmn(archivo);

        const rutaRelativa = path.join("upload", `${idProceso}.bpmn`);
        const rutaAbsoluta = path.join(__dirname, "../", rutaRelativa);
        const rutaRelativaProcesoPadre = path.join(
            "upload",
            `${idProcesoPadre}.bpmn`
        );
        const rutaAbsolutaProcesoPadre = path.join(
            __dirname,
            "../",
            rutaRelativaProcesoPadre
        );

        await createProcessIfNotExist(idProceso, name, rutaRelativa);
        await createAssociation(
            idProcesoPadre,
            callActivity,
            idProceso,
            rutaRelativa,
            name,
            rutaAbsolutaProcesoPadre
        );

        await moveFile(archivo, rutaAbsoluta);

        res.status(201).json({
            code: 201,
            message: "SubProceso Guardado Correctamente",
        });
    } catch (error) {
        logger.error("Controlador Save Changes", error);
        console.log(error);
        next(error);
    }
};

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

        const versionProceso = await VersionProceso.findByPk(version)

        await versionProceso.update(
            {estado: "enviado",})

        const nuevoCiclo = await getProximoCiclo(version);
        const cicloActual = nuevoCiclo - 1

        const cicloEnCurso = await Aprobadores.findOne({
            where: {
                id_version_proceso: version,
                ciclo_aprobacion: cicloActual
                }
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
                ciclo_aprobacion: nuevoCiclo
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

export const aprobarProceso =async (req, res, next) =>{
    const transaction = await sequelize.transaction();
    try {
        
        const { idProceso, id_usuario, version } = req.body
        
        const solicitud = await Aprobadores.findOne({
            where:{
                id_usuario,
                id_version_proceso: version
            },
            transaction
        })

        const proceso = await Procesos.findOne({
            where:{
                id_bpmn: idProceso
            },
            transaction
        })

        if(!proceso){
            await transaction.rollback()
            return res.status(400).json({
            code: 400,
            message: "No existe el proceso que está intentando aprobar",
        });
        }

        if(!solicitud){
            await transaction.rollback()
            return res.status(400).json({
            code: 400,
            message: "No existe la solicitud que está intentando aprobar",
        });
        }

        await solicitud.update({ estado: "aprobado" }, { transaction });

        const solicitudes = await Aprobadores.findAll({
            where: {
                id_version_proceso: version
            },
            transaction
        });

        const hayPendientes = solicitudes.some((s) => s.estado === "pendiente");
        const hayRechazadas = solicitudes.some((s) => s.estado === "rechazado");
        const solicitudesAprobadas = solicitudes.every(s => s.estado === "aprobado");

        if (solicitudesAprobadas) {
            const versionBorrador = await VersionProceso.findByPk(version)
            const nombreVersionBorradorAnterior = (parseFloat(versionBorrador.nombre_version) - 0.1).toFixed(1)
            const versionAnterior = await VersionProceso.findOne({
                where:{
                    id_bpmn : idProceso,
                    nombre_version: nombreVersionBorradorAnterior
                }
            })

            await versionAnterior.update({
                estado: "inactivo"
            }, { transaction })

            await versionBorrador.update({
                estado: "aprobado"
            }, { transaction })

        } else if(hayRechazadas && !hayPendientes) {
            await Aprobadores.destroy({
            where: {
                id_version_proceso: version
                },
            transaction
            });

            const versionProceso = await VersionProceso.findOne({
                where: {
                    id_bpmn: idProceso,
                    id_version_proceso: version
                },transaction
            })

            await versionProceso.update({estado: "rechazado"}, {transaction})

        }

        await transaction.commit()
        res.status(200).json({
            code: 200,
            message: "Proceso Aprobado",
        });
    } catch (error) {
        await transaction.rollback()
        logger.error("Controlador Enviar Aprobacion", error);
        console.log(error);
        next(error);
    }
}

export const rechazarProceso =async (req, res, next) =>{
    try {
        const transaction = await sequelize.transaction();
        const { idProceso, id_usuario, version } = req.body

        const solicitud = await Aprobadores.findOne({
            where:{
                id_usuario,
                id_version_proceso: version
            },
            transaction
        })

        const proceso = await Procesos.findOne({
            where:{
                id_bpmn: idProceso
            },
            transaction
        })

        if(!proceso){
            await transaction.rollback()
            return res.status(400).json({
            code: 400,
            message: "No existe el proceso que está intentando aprobar",
        });
        }

        if(!solicitud){
            await transaction.rollback()
            return res.status(400).json({
            code: 400,
            message: "No existe la solicitud que está intentando aprobar",
        });
        }

        await solicitud.update({ estado: "rechazado" }, { transaction });

        const solicitudes = await Aprobadores.findAll({
            where: {
                id_version_proceso: version
            },
            transaction
        });

        const hayPendientes = solicitudes.some((s) => s.estado === "pendiente");

        if(!hayPendientes) {
            await Aprobadores.destroy({
            where: {
                id_version_proceso: version
                },
            transaction
            });

            const versionProceso = await VersionProceso.findOne({
                where: {
                    id_bpmn: idProceso,
                    id_version_proceso: version
                },transaction
            })

            await versionProceso.update({estado: "rechazado"}, {transaction})
        }

        await transaction.commit()
        res.status(200).json({
            code: 200,
            message: "Proceso Rechazado ",
        });
    } catch (error) {
        await transaction.rollback()
        logger.error("Controlador Enviar Aprobacion", error);
        console.log(error);
        next(error);
    }
}

export const getPendingProcess = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;

        const aprobacionesPendientes = await Aprobadores.findAll({
            where: {
                id_usuario: idUsuario,
                estado: "pendiente"
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

        const resultadosMapeados = aprobacionesPendientes.map(item => ({
            idAprobador: item.id_aprobador,
            idUsuario: item.id_usuario,
            idVersionProceso: item.id_version_proceso,
            estadoAprobacion: item.estado,
            fechaCreacionAprobacion: item.created_at,

            idCreadorVersion: item.version_proceso?.id_creador,
            nombreVersion: item.version_proceso?.nombre_version,
            idBpmn: item.version_proceso?.id_bpmn,

            nombreProceso: item.version_proceso?.id_proceso_proceso?.nombre,
            descripcionProceso: item.version_proceso?.id_proceso_proceso?.descripcion
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

//Función que extrae contenido de un archivo BPMN para visualizar el resumen del proceso
export const getProcessSummary = async (req, res, next) => {
    try {
        const { idProceso, version } = req.params;
        let xmlContent;
        let versionProceso;

        if (!version || version === "undefined") {
            xmlContent = await getDataFileBpmnFromS3(
                "test-bpmn",
                `${idProceso}.bpmn`
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
                "test-bpmn",
                `${idProceso}.bpmn`,
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
                },
            ],
        });

        const subprocesosMap = subprocesos.map((subproceso) => ({
            id: subproceso.id_bpmn_proceso?.id_bpmn,
            nombre: subproceso.id_bpmn_proceso?.nombre,
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
        const { idProceso, comentario, versionProceso, id_usuario } = req.body;

        const versionMock = "1"; // Cambiar por la version real del proceso

        await ComentariosVersionProceso.create({
            id_usuario,
            id_bpmn: idProceso,
            comentario,
            id_version_proceso: versionMock,
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
        const { idProceso, idVersionProceso } = req.params;

        const versionMockup = "1"; // Cambiar por la version real del proceso

        let comentarios = await ComentariosVersionProceso.findAll({
            include: [
                {
                    model: Usuarios,
                    as: "id_usuario_usuario",
                    attributes: ["nombre"],
                },
            ],
            where: {
                id_bpmn: idProceso,
                id_version_proceso: versionMockup,
            },
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

//Funcion que crea las oportunidades de la versión de un proceso
export const createOppotunity = async (req, res, next) => {
    try {
        const { idProceso, descripcion, asunto, version, id_usuario } =
            req.body;
        const archivos = req.files?.archivos || null;

        console.log(req.body);

        /*  await OportunidadesMejora.create({
            id_usuario,
            id_bpmn: idProceso,
            asunto,
            descripcion,
            id_version_proceso: version
        }) */
        res.status(201).json({
            code: 201,
            message: "Oportunidad creada correctamente",
        });
    } catch (error) {
        logger.error("Controlador Crear Oportunidad", error);
        console.log(error);
        next(error);
    }
};

//Funcion que obtiene las oportunidades de la versión de un proceso
export const getOpportunities = async (req, res, next) => {
    try {
        const { idProceso, idVersionProceso } = req.params;

        const versionMockup = "1"; // Cambiar por la version real del proceso

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
                id_version_proceso: versionMockup,
            },
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

export const downloadProcess = async (req, res, next) => {
    try {
        const { idProceso } = req.params;
        const fileName = `${idProceso}.bpmn`;
        const { Body, ContentType, ContentLength } = await downloadFromS3(
            fileName,
            "test-bpmn"
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

export const createNewProcessVersion = async (req, res, next) => {
    try {
        const { idProceso, version, id_creador } = req.body;
        const { archivo } = req.files;

        const proceso = await Procesos.findOne({
            where: { id_bpmn: idProceso },
        });

        const borradorAcutal = await VersionProceso.findOne({
            where: {
                id_version_proceso: version,
                id_bpmn: idProceso,
                estado: "borrador"
            },
        });

        if (borradorAcutal) {
            await uploadFileToS3(
                "test-bpmn",
                `${idProceso}.bpmn`,
                archivo.data,
                "application/xml",
                borradorAcutal.nombre_version,
                "borrador"
            );
            return res.status(201).json({
                code: 201,
                message: "Borrador Guardado con éxito",
            });
        }

        
        const ultimaVersion = await VersionProceso.findByPk(version)
        const nuevaVersion = (parseFloat(ultimaVersion.nombre_version) + 0.1).toFixed(1)

        await VersionProceso.create({
            id_proceso: proceso.id_proceso,
            id_creador,
            id_aprobador: ultimaVersion.id_aprobador,
            nombre_version: nuevaVersion,
            estado: "borrador",
            id_bpmn: idProceso,
        });

        await uploadFileToS3(
            "test-bpmn",
            `${idProceso}.bpmn`,
            archivo.data,
            "application/xml",
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
