import { Aprobadores, Cargo, Usuarios } from "../models/models.js";

export const getAprobadores = async (req, res) => {
    try {
        const aprobadores = await Cargo.findAll();

        return res.status(200).json({
            code: 200,
            message: "Aprobadores obtenidos correctamente",
            data: aprobadores,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            code: 500,
            message: "Error al obtener los aprobadores",
        });
    }
}