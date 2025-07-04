import { Procesos, IntermediaProcesos, Aprobadores, VersionProceso } from "../models/models.js";
import { ProcessError } from "../errors/TypeError.js";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

export const createProcessIfNotExist = async (
    idCreador,
    idProceso,
    idNivel,
    nombre = "pendiente",
    descripcion = "",
    estado,
    macroproceso = false,
    transaction = null
) => {
    try {
        const proceso = await Procesos.findOne({
            where: { id_bpmn: idProceso },
        });
        if (!proceso) {
            const nuevoProceso = await Procesos.create(
                {
                    id_creador: idCreador,
                    id_nivel: idNivel,
                    nombre: nombre,
                    descripcion: descripcion,
                    estado: "borrador",
                    id_bpmn: idProceso,
                    macroproceso: macroproceso === "true",
                },
                { transaction }
            );
            return nuevoProceso;
        } else {
            await Procesos.update(
                {
                    nombre:
                        proceso.nombre === "pendiente"
                            ? nombre
                            : proceso.nombre,
                    descripcion: proceso.descripcion,
                    estado: estado ? estado : "borrador",
                    macroproceso: macroproceso === true,
                },
                {
                    where: { id_bpmn: idProceso },
                    transaction,
                }
            );
            return await Procesos.findOne({ where: { id_bpmn: idProceso } });
        }
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> createProcessIfNotExist] ${error.message}`);
        throw new ProcessError(
            "Hubo un error al guardar el proceso en la base de datos"
        );
    }
};

export const createAssociation = async (
    idProceso,
    callActivity,
    calledElement,
    transaction = null
) => {
    try {
        const asociacion = await IntermediaProcesos.findOne({
            where: { call_activity: callActivity },
        });

        if (!asociacion && callActivity && calledElement) {
            await IntermediaProcesos.create(
                {
                    id_bpmn_padre: idProceso,
                    id_bpmn: calledElement,
                    call_activity: callActivity,
                },
                { transaction }
            );
        } else {
            await IntermediaProcesos.update(
                {
                    id_bpmn: calledElement,
                },
                {
                    where: {
                        id_bpmn_padre: idProceso,
                        id_bpmn: calledElement,
                    },
                },
                { transaction }
            );
        }
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> createAssociation] ${error.message}`);
        throw new ProcessError(
            "Hubo un error al almacenar la asociación del proceso en la base de datos"
        );
    }
};

export const getProximoCiclo = async (id_version_proceso) => {
    try {
        const ultimo = await Aprobadores.findOne({
        where: { id_version_proceso },
        order: [["ciclo_aprobacion", "DESC"]],
        paranoid: false,
    });

    return ultimo ? ultimo.ciclo_aprobacion + 1 : 1;
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> getProximoCiclo] ${error.message}`);
        throw new ProcessError(
            "Hubo un error al obtener el próximo ciclo de validación"
        );
    }
};

export const obtenerUltimaVersionProceso = async (idProceso, version) =>{
    try {
        const versionActual = await VersionProceso.findByPk(version);
        const versionActualNumber = parseFloat(versionActual.nombre_version);

        const versionesAnteriores = await VersionProceso.findAll({
        where: {
            id_bpmn: idProceso,
        },
        order: [["created_at", "DESC"]],
        });
        const versionesMenores = versionesAnteriores.filter(v =>
            parseFloat(v.nombre_version) < versionActualNumber);
        

        const versionAnterior = versionesMenores.length > 0 ? versionesMenores[0] : null
        return versionAnterior
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> obtenerUltimaVersionProceso] ${error.message}`);
        throw new ProcessError(
            "Hubo un error al obtener la última versión del proceso"
        );
    }
}