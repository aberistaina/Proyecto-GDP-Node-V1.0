import {Usuarios, ComentariosVersionProceso, VersionProceso, ArchivosComentariosVersionProceso} from "../models/models.js";
import { getAdminConfig } from "../services/admin.services.js";
import { uploadFileToS3 } from "../services/s3Client.services.js";
import { isValidFilesExtension } from "../utils/validators.js";
import { formatShortTime } from "../utils/formatearFecha.js";
import logger from "../utils/logger.js";
import { sequelize } from "../database/database.js";

//Funcion que crea los comentarios de la versión de un proceso
export const createCommentary = async (req, res, next) => {
    console.log("HOLA");
    const transaction = await sequelize.transaction();
    try {
        const { idProceso, comentario, version, id_usuario } = req.body;
        const { s3_bucket, s3_bucket_adjuntos } = await getAdminConfig();
        const archivos = req.files?.archivos || null;

        const nuevoComentario = await ComentariosVersionProceso.create(
            {
                id_usuario,
                id_bpmn: idProceso,
                comentario,
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

                await ArchivosComentariosVersionProceso.create(
                    {
                        id_comentario: nuevoComentario.id_comentario,
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
export const getComentariesFiles = async (req, res, next) => {
    try {
        const { idComentario } = req.params;

        const archivos = await ArchivosComentariosVersionProceso.findAll({
            where: {
                id_comentario: idComentario,
            },
        });


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
};
