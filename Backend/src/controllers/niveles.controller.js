import { Niveles } from "../models/models.js";
import { NotFoundError } from "../errors/TypeError.js";
import logger from "../utils/logger.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

//Función que obtiene los niveles de los procesos
export const getNiveles = async (req, res, next) => {
    try {
        const niveles = await Niveles.findAll();

        if (niveles.length === 0) {
            return res.status(200).json({
                code: 200,
                message: "No hay niveles aún",
                data: [],
            });
        }

        res.status(200).json({
            code: 200,
            message: "Oportunidades obtenidas correctamente",
            data: niveles,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getNiveles] ${error.message}`);
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

        if(!nivel){
            throw new NotFoundError("No existe ningún nivel con esa ID")
        }

        res.status(200).json({
            code: 200,
            message: "Nivel Obtenido correctamente",
            data: nivel,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getNivelById] ${error.message}`);
        console.log(error);
        next(error);
    }
};
