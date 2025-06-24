import { BitacoraAprobaciones, Usuarios } from "../models/models.js";
import { formatShortTime } from "../utils/formatearFecha.js";
import logger from "../utils/logger.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

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
        logger.error(`[${fileName} -> createNewBitacoraMessage] ${error.message}`);
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

        if (comentarios.length === 0) {
            return res.status(200).json({
                code: 200,
                message: "No hay comentarios aún para este proceso",
                data: [],
            });
        }

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
        logger.error(`[${fileName} -> getBitacoraMessages] ${error.message}`);
        console.log(error);
        next(error);
    }
};