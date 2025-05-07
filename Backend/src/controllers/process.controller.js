import * as path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { Procesos, IntermediaProcesos, Usuarios, Aprobadores, ComentariosVersionProceso, VersionProceso, OportunidadesMejora, Niveles } from "../models/models.js";
import logger from "../utils/logger.js";
import { changeCallElement, extraerDatosBpmn, formatFileName, extraerParticipantesBpmn } from "../utils/bpmnUtils.js";
import { formatearFecha, formatShortTime } from "../utils/formatearFecha.js";
import { createAssociation, createProcessIfNotExist } from "../services/Bpmn.services.js";
import { getDataFileBpmnFromS3, uploadFileToS3 } from "../services/s3Client.services.js";
import { moveFile } from "../utils/uploadFile.js";
import { sequelize } from "../database/database.js";


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

//Función leer el contenido XML de un subproceso desde S3
export const readActualProcessVersion = async (req, res, next) => {
    try {
        const { idProceso } = req.params;
    
        
        const xmlContent = await getDataFileBpmnFromS3("test-bpmn", `${idProceso}.bpmn`)

        res.setHeader("Content-Type", "application/xml");
        res.status(200).send(xmlContent);
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
        const {id_aprobador, id_creador} = req.body

        //Variables momentáneas
        const nivel = 1
        const estado = "activo"
        //variables momentáneas

        const archivosArray = Array.isArray(archivos) ? archivos : [archivos];
        const datosArchivos = []

        for (const archivo of archivosArray) {
            const datoArchivo = await extraerDatosBpmn(archivo);
            const nombreArchivo = formatFileName(archivo.name.split(".")[0])
            datosArchivos.push(datoArchivo);

            console.log("Datos Archivo",datoArchivo);
            const {  idProceso, subProcesos } = datoArchivo;
            let callActivity = subProcesos.callActivity


            let calledElement = subProcesos.calledElement;
            for (const subProceso of subProcesos) {
                callActivity = subProceso.callActivity;
                calledElement = subProceso.calledElement;
            }

            const rutaRelativa = path.join("upload", `${idProceso}.bpmn`);
            const rutaAbsoluta = path.join(__dirname, "../", rutaRelativa);
            
            await createProcessIfNotExist(id_creador, idProceso, id_aprobador, nivel, nombreArchivo, null, estado, null, transaction);
            await moveFile(archivo, rutaAbsoluta)

            /* if(callActivity && calledElement !== ""){
                const rutaRelativaSubproceso = path.join("upload", `${calledElement}.bpmn`);
                await createProcessIfNotExist(calledElement, "Pendiente", rutaRelativaSubproceso, transaction);
                await createAssociation(idProceso, callActivity, calledElement, null, null, null, transaction);
                } */

            await uploadFileToS3("test-bpmn", `${idProceso}.bpmn`, archivo.data, "application/xml")
            }


            await transaction.commit()
            res.status(201).json({
                code: 201,
                message: "Procesos cargado correctamente",
            });

    } catch (error) {
        await transaction.rollback()
        logger.error("Controlador Cargar Proceso", error);
        console.log(error);
        next(error)
    }
}

//Guardar cambios cuando se trabaja en el modelador o crear un nuevo proceso si este no existe
export const saveProcessChanges = async(req, res, next) =>{
    try {
        const { archivo } = req.files
        const { id_creador, aprobadores, estado, esMacroproceso } = req.body
        const id_aprobador = 1
        const nivel = 2


        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                code: 400,
                message: "No se ha subido ningún archivo.",
            });
        }

        

        const estadoFormateado = estado.toLowerCase()

        const { idProceso, name, descripcion } = await extraerDatosBpmn(archivo) 

        await createProcessIfNotExist(id_creador, idProceso, id_aprobador, nivel, name, descripcion, estadoFormateado, esMacroproceso, null )

        const versionProceso = await VersionProceso.findOne({
            where: {
                id_bpmn: idProceso,
            }
        })

        if(!versionProceso){
            await VersionProceso.create({
                id_creador,
                id_bpmn: idProceso,
                estado: "pendiente",
                version: 1
            })
        }

        await uploadFileToS3("test-bpmn", `${idProceso}.bpmn`, archivo.data, "application/xml")

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

//Función que envía borrador para su aprobación
export const enviarAprobacion = async (req, res, next) => {
    try {
        const { idProceso, idAprobador } = req.body
        const versionProceso = await VersionProceso.findOne({
            where: {
                id_bpmn: idProceso,
            }
        })
        if(!versionProceso){
            await VersionProceso.create({
                id_creador: idProceso,
                id_bpmn: idAprobador,
                estado: "pendiente",
                version: 1
            })
        }
    } catch (error) {
        logger.error("Controlador Enviar Aprobacion", error);
        console.log(error);
        next(error)
        
    }
}

//Función que extrae contenido de un archivo BPMN para visualizar el resumen del proceso
export const getProcessSummary = async (req, res, next) => {
    try {
        const { idProceso } = req.params
        const xmlContent = await getDataFileBpmnFromS3("test-bpmn", `${idProceso}.bpmn`)

        const participantes = extraerParticipantesBpmn(xmlContent)

        const proceso = await Procesos.findOne({
            include: [
                {
                    model: Usuarios,
                    as: "id_creador_usuario",
                    attributes:["nombre"]
                }
            ],
            where: {
                id_bpmn: idProceso
            },
        })
        const aprobadores = await Aprobadores.findAll({
            where: {
                id_aprobador: proceso.id_aprobadores_cargo
            },
            raw: true,
            include: [
                {
                    model: Usuarios,
                    as: "id_usuario_usuario",
                    attributes: ["nombre"]
                }
            ]
        })

        const subprocesos = await IntermediaProcesos.findAll({
            where: {
                id_bpmn_padre: idProceso
            },
            include: [
                {
                    model: Procesos,
                    as: "id_bpmn_proceso",
                    attributes: ["id_bpmn", "nombre"]
                }
            ]
        })

        const resumenProceso = {
            Subprocesos: [...subprocesos],
            ...participantes,
            TiempoSLA: ["2 días", "Automatizable 70%"]
        };

        

        const fechaFormateada = formatearFecha(proceso.created_at)

        const headerProceso ={
            nombre: proceso.nombre,
            descripcion: proceso.descripcion,
            creador: proceso.id_creador_usuario?.nombre,
            aprobadores: aprobadores.map((aprobador) => aprobador["id_usuario_usuario.nombre"]),
            fechaCreacion: fechaFormateada,
            estado: proceso.estado,
            version: proceso.version
        }

        res.status(200).json({
            code: 200,
            message: "Resumen de Proceso",
            data: resumenProceso,
            dataHeader: headerProceso
        })

    }
    catch (error) {
        logger.error("Controlador Resumen Proceso", error);
        console.log(error);
        next(error)
    }
}

//Funcion que crea los comentarios de la versión de un proceso
export const createCommentary = async (req, res, next) => {
    try {
        const { idProceso, comentario, versionProceso, id_usuario  } = req.body

        const versionMock = "1" // Cambiar por la version real del proceso

        await ComentariosVersionProceso.create({
            id_usuario,
            id_bpmn: idProceso,
            comentario,
            id_version_proceso: versionMock
        })

        res.status(201).json({
            code: 201,
            message: "Comentario creado correctamente"
        })
    } catch (error) {
        logger.error("Controlador Crear Comentario", error);
        console.log(error);
        next(error)
    }
}

//Función que obtiene los comentarios de la versión un proceso
export const getCommentaries = async (req, res, next) => {
    try {
        const { idProceso, idVersionProceso } = req.params

        const versionMockup = "1" // Cambiar por la version real del proceso

        let comentarios = await ComentariosVersionProceso.findAll({
            include: [
                {
                    model: Usuarios,
                    as: "id_usuario_usuario",
                    attributes: ["nombre"]
                }
            ],
            where: {
                id_bpmn: idProceso,
                id_version_proceso: versionMockup
            },
        })

        const comentariosMap = comentarios.map((comentario) => {
            const data = comentario.toJSON(); 
            return {
              ...data,
              nombre_creador: comentario.id_usuario_usuario?.nombre,
              created_at: formatShortTime(data.created_at)
            };
          });
        


        

        res.status(202).json({
            code: 202,
            message: "Comentarios obtenidos correctamente",
            data: comentariosMap
        })

    } catch (error) {
        logger.error("Controlador Obtener Comentarios", error);
        console.log(error);
        next(error)
    }
}

export const createOppotunity = async(req, res, next) =>{
    try {
        const { idProceso, descripcion, asunto, versionProceso, id_usuario  } = req.body

        const versionMock = "1" // Cambiar por la version real del proceso

        await OportunidadesMejora.create({
            id_usuario,
            id_bpmn: idProceso,
            asunto,
            descripcion,
            id_version_proceso: versionMock
        })
        res.status(201).json({
            code: 201,
            message: "Oportunidad creada correctamente"
        })
    } catch (error) {
        logger.error("Controlador Crear Oportunidad", error);
        console.log(error);
        next(error)
    }
}

export const getOpportunities = async (req, res, next) => {
    try {
        const { idProceso, idVersionProceso } = req.params

        const versionMockup = "1" // Cambiar por la version real del proceso

        let oportunidades = await OportunidadesMejora.findAll({
            include: [
                {
                    model: Usuarios,
                    as: "id_usuario_usuario",
                    attributes: ["nombre"]
                }
            ],
            where: {
                id_bpmn: idProceso,
                id_version_proceso: versionMockup
            },
        })

        const oportunidadesMap = oportunidades.map((oportunidad) => {
            const data = oportunidad.toJSON(); 
            return {
              ...data,
              nombre_creador: oportunidad.id_usuario_usuario?.nombre,
              created_at: formatShortTime(data.created_at)
            };
          });

        res.status(200).json({
            code: 200,
            message: "Oportunidades obtenidas correctamente",
            data: oportunidadesMap
        })

    } catch (error) {
        logger.error("Controlador Crear Oportunidad", error);
        console.log(error);
        next(error)
    }
}

export const getNiveles = async (req, res, next) => {
    try {
        const niveles = await Niveles.findAll()
        
        res.status(200).json({
            code: 200,
            message: "Oportunidades obtenidas correctamente",
            data: niveles
        })
    } catch (error) {
        logger.error("Controlador Obtener Niveles", error);
        console.log(error);
        next(error)
    }
}

export const getProcessByNivel = async (req, res, next) => {
    try {
        const { id_nivel } = req.body
        //Este controlador tiene que traer los macroprocesos de cada nivel, sus procesos separados por nivel y además los subprocesos de los procesos padres, todo organizado por el tema de la navegación (pensar como hacer esto)
        res.status(200).json({
            code: 200,
            message: "Oportunidades obtenidas correctamente",
            data: niveles
        })
    } catch (error) {
        logger.error("Controlador getProcessByNivel", error);
        console.log(error);
        next(error)
    }
    
}