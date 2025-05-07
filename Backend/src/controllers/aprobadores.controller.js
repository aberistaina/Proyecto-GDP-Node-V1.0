import { Aprobadores, Usuarios } from "../models/models.js";

export const getAprobadores = async (req, res) => {
    try {
        const aprobadores = await Aprobadores.findAll({
            include: [
                {
                    model: Usuarios,
                    as: "id_usuario_usuario",
                    attributes: ["id_usuario", "nombre"],
                },
            ],
        });

        const aprobadoresMap = aprobadores.map((aprobador) => {
            return {
                id_aprobador: aprobador.id_aprobador,
                id_usuario: aprobador.id_usuario_usuario.id_usuario,
                nombre: aprobador.id_usuario_usuario.nombre,
            };
        });

        return res.status(200).json({
            code: 200,
            message: "Aprobadores obtenidos correctamente",
            data: aprobadoresMap,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            code: 500,
            message: "Error al obtener los aprobadores",
        });
    }
}