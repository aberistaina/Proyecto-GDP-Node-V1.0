import { Usuarios, VersionProceso, OportunidadesMejora, ArchivosOportunidadesMejora } from "../models/models.js";
import logger from "../utils/logger.js";
import { sequelize } from "../database/database.js";
import { isValidFilesExtension } from "../utils/validators.js";
import { getAdminConfig } from "../services/admin.services.js";
import { formatShortTime } from "../utils/formatearFecha.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

//Funcion que crea las oportunidades de la versión de un proceso
export const createOppotunity = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { s3_bucket, s3_bucket_adjuntos } = await getAdminConfig();
        const { idProceso, descripcion, asunto, version, id_usuario } =
            req.body;
        const archivos = req.files?.archivos || null;

        const nuevaOportunidad = await OportunidadesMejora.create(
            {
                id_usuario,
                id_bpmn: idProceso,
                asunto,
                descripcion,
                id_version_proceso: version,
            },
            { transaction }
        );

        const nombreVersion = await VersionProceso.findByPk(version, {
            transaction,
        });

        if (archivos) {
            const archivosArray = Array.isArray(archivos)
                ? archivos
                : [archivos];
            for (const archivo of archivosArray) {
                isValidFilesExtension(archivo);
                const mimeType =
                    mime.lookup(archivo.name) || "application/octet-stream";

                await ArchivosOportunidadesMejora.create(
                    {
                        id_oportunidad: nuevaOportunidad.id_oportunidad,
                        nombre: archivo.name,
                        s3_key: `${s3_bucket_adjuntos}/${archivo.name}`,
                    },
                    { transaction }
                );

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

        await transaction.commit();
        res.status(201).json({
            code: 201,
            message: "Oportunidad creada correctamente",
        });
    } catch (error) {
        await transaction.rollback();
        logger.error(`[${fileName} -> createOppotunity] ${error.message}`);
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

        if (oportunidades.length === 0) {
            return res.status(200).json({
                code: 200,
                message: "No hay oportunidades aún para este proceso",
                data: [],
            });
        }

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
        logger.error(`[${fileName} -> getOpportunities] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Función que obtiene los Archivos de una oportunidad
export const getOpportunitiesFiles = async (req, res, next) => {
    try {
        const { idComentario } = req.params;

        const archivos = await ArchivosOportunidadesMejora.findAll({
            where: {
                id_oportunidad: idComentario,
            },
        });

        if(archivos.length === 0 ){
            return res.status(200).json({
                code: 200,
                message: "No hay archivos vinculados a esta oportunidad",
                data: [],
            });
        }

        res.status(202).json({
            code: 202,
            message: "Archivos obtenidos correctamente",
            data: archivos,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getOpportunitiesFiles] ${error.message}`);
        console.log(error);
        next(error);
    }
};