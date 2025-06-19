import { Niveles } from "../models/models.js";
import logger from "../utils/logger.js";

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
