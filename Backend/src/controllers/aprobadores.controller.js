import { Aprobadores, Cargo, Usuarios, VersionProceso, Procesos, ProcesosAprobadores } from "../models/models.js";
import { sequelize } from "../database/database.js";
import { getProximoCiclo } from "../services/Bpmn.services.js";
import { NotFoundError, ProcessError } from "../errors/TypeError.js";
import logger from "../utils/logger.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

//Función que obtiene todos los aprobadores
export const getAprobadores = async (req, res, next) => {
    try {
        const aprobadores = await Cargo.findAll();

        if(aprobadores.length === 0){
            throw new NotFoundError("No existen aprobadores en la base de datos.") 
        }

        return res.status(200).json({
            code: 200,
            message: "Aprobadores obtenidos correctamente.",
            data: aprobadores,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getAprobadores] ${error.message}`);
        console.log(error);
        next(error);
    }
}

//Función que envía borrador para su aprobación
export const enviarAprobacion = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { idProceso, version, observacion } = req.body;

        const proceso = await Procesos.findOne({
            where: {id_bpmn: idProceso}, 
            transaction
        });

        if(!proceso){
            throw new NotFoundError("No existe el proceso en la base de datos.")
        }

        const cargosAprobadores = await ProcesosAprobadores.findAll({
            raw:true,
            where: {id_proceso: proceso.id_proceso},
            transaction 
        });

        const aprobadores = []
        for (const cargo of cargosAprobadores) {
            const aprobador = await Usuarios.findOne({
            raw:true,
            where:{
                id_cargo: cargo.id_cargo,
                id_rol: 2
            }
            })
            if (aprobador) {
                aprobadores.push(aprobador);
            }
        }

        if(aprobadores.length === 0 ){
            throw new NotFoundError("No existen aprobadores en la base de datos con ese cargo.")
        }

        const versionProceso = await VersionProceso.findByPk(version, { transaction });

        
        if(!versionProceso){
            throw new NotFoundError("No existe esta versión del proceso.")
        }

        
        await versionProceso.update({ estado: "enviado", observacion_version: observacion }, {transaction});

        const nuevoCiclo = await getProximoCiclo(version);
        const cicloActual = nuevoCiclo - 1;

        const cicloEnCurso = await Aprobadores.findOne({
            where: {
                id_version_proceso: version,
                ciclo_aprobacion: cicloActual,
            }, transaction
        });

        if (cicloEnCurso) {
            throw new ProcessError("Ya existe una solicitud de aprobación activa para este proceso.")
        }
        console.log(aprobadores);
        for (const aprobador of aprobadores) {
            await Aprobadores.create({
                id_usuario: aprobador.id_usuario,
                id_version_proceso: version,
                estado: "pendiente",
                ciclo_aprobacion: nuevoCiclo,
            }, {transaction});
        }
        await transaction.commit()
        res.status(201).json({
            code: 201,
            message: "Proceso Enviado para su Aprobación.",
        });
    } catch (error) {
        await transaction.rollback()
        logger.error(`[${fileName} -> enviarAprobacion] ${error.message}`);
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
            },transaction
        });

        const proceso = await Procesos.findOne({
            where: {id_bpmn: idProceso},
            transaction
        });

        if (!proceso) {
            await transaction.rollback();
            throw new NotFoundError("No existe este proceso en la base de datos.") 
        }

        if (!solicitud) {
            await transaction.rollback();
            throw new NotFoundError("No existe esta solicitud de aprobación.") 
        }

        await solicitud.update({ estado: "aprobado" }, { transaction });

        const solicitudes = await Aprobadores.findAll({
            where: {id_version_proceso: version},
            transaction
        });

        if (!solicitudes) {
            await transaction.rollback();
            throw new NotFoundError("No hay solicitudes en la base de datos.") 
        }

        const hayPendientes = solicitudes.some((s) => s.estado === "pendiente");
        const hayRechazadas = solicitudes.some((s) => s.estado === "rechazado");
        const solicitudesAprobadas = solicitudes.every(
            (s) => s.estado === "aprobado"
        );

        if (solicitudesAprobadas) {
            const versionBorrador = await VersionProceso.findByPk(version, {transaction});
            const nombreVersionBorradorAnterior = (
                parseFloat(versionBorrador.nombre_version) - 0.1
            ).toFixed(1);
            const versionAnterior = await VersionProceso.findOne({
                where: {
                    id_bpmn: idProceso,
                    nombre_version: nombreVersionBorradorAnterior
                },transaction
            });

            if (versionAnterior) {
                await versionAnterior.update(
                    {estado: "inactivo"},
                    { transaction }
                )
            }

            await versionBorrador.update(
                {estado: "aprobado"},
                { transaction }
            );
        } else if (hayRechazadas && !hayPendientes) {
            await Aprobadores.destroy({
                where: {id_version_proceso: version},
                transaction
            });

            const versionProceso = await VersionProceso.findOne({
                where: {
                    id_bpmn: idProceso,
                    id_version_proceso: version,
                },transaction,
            });

            if (!versionProceso) {
                await transaction.rollback();
                throw new NotFoundError("No existe esta versión del proceso.") 
            }

            await versionProceso.update(
                { estado: "rechazado" },
                { transaction }
            );
        }

        await transaction.commit();
        res.status(200).json({
            code: 200,
            message: "Proceso Aprobado.",
        });
    } catch (error) {
        await transaction.rollback();
        logger.error(`[${fileName} -> aprobarProceso] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Función que rechaza un borrador
export const rechazarProceso = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { idProceso, id_usuario, version } = req.body;

        const solicitud = await Aprobadores.findOne({
            where: {
                id_usuario,
                id_version_proceso: version
            },transaction
        });

        const proceso = await Procesos.findOne({
            where: {id_bpmn: idProceso},
            transaction
        });

        if (!proceso) {
            await transaction.rollback();
            throw new NotFoundError("No existe el proceso que se intenta aprobar o rechazar.") 
        }

        if (!solicitud) {
            await transaction.rollback();
            throw new NotFoundError("No existe la solicitud que se intenta aprobar o rechazar.") 
        }

        await solicitud.update({ estado: "rechazado" }, { transaction });

        const solicitudes = await Aprobadores.findAll({
            where: {id_version_proceso: version},
            transaction
        });

        if (!solicitudes) {
            await transaction.rollback();
            throw new NotFoundError("No hay solicitudes para esta versión en la base de datos.") 
        }

        const hayPendientes = solicitudes.some((s) => s.estado === "pendiente");

        if (!hayPendientes) {
            await Aprobadores.destroy({
                where: {id_version_proceso: version},
                transaction
                
            });

            const versionProceso = await VersionProceso.findOne({
                where: {
                    id_bpmn: idProceso,
                    id_version_proceso: version
                },transaction
            });

            await versionProceso.update(
                { estado: "rechazado" },
                { transaction }
            );
        }

        await transaction.commit();
        res.status(200).json({
            code: 200,
            message: "Proceso Rechazado exitosamente.",
        });
    } catch (error) {
        await transaction.rollback();
        logger.error(`[${fileName} -> rechazarProceso] ${error.message}`);
        console.log(error);
        next(error);
    }
};