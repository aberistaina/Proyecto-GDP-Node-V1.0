import { Usuario } from "../models/Usuario.model.js";
import { createToken, hashPassword } from "../services/auth.services.js";
import {
    validateUserData,
    userIfExist,
    userNotExist,
} from "../services/validateUserData.js";
import { normalizeEmail } from "../utils/normalize.js";
import logger from "../utils/logger.js";
import { sendEmail } from "../services/email.services.js";

export const createUser = async (req, res, next) => {
    try {
        const { nombre, email, password, empresa } = req.body;

        //Se valida que el usuario no exista en la base de datos
        await userIfExist(email);
        //se validan que la información personal cumpla ciertas condiciones
        validateUserData(nombre, email, password);

        const hash = hashPassword(password);

        await Usuario.create({
            nombre,
            email: normalizeEmail(email),
            password_hash: hash,
            id_empresa: empresa,
        });

        sendEmail(normalizeEmail(email), "registro", nombre);

        res.status(201).json({
            code: 201,
            message: "Usuario creado con éxito",
        });
    } catch (error) {
        console.log(error);
        logger.error("Ha ocurrido un error en createUser Controller", error);
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        res.status(200).json({
            code: 200,
            message: "Inicio de sesión Exitoso",
            /* usuario: req.user, */
            token: req.token,
        });
    } catch (error) {
        console.log(error);
        logger.error("Ha ocurrido un error en login Controller", error);
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        //Verifica si el usuario no existe en la base de datos
        await userNotExist(email);

        const user = await Usuario.findOne({ raw: true, where: { email } });

        const token = createToken(email, "30m");

        sendEmail(email, "recover-password", user.nombre, token);

        res.status(200).json({
            code: 200,
            message:
                "Email de recuperación de contraseña enviado correctamente",
        });
    } catch (error) {
        console.log(error);
        logger.error(
            "Ha ocurrido un error en forgotPassword Controller",
            error
        );
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const hash = hashPassword(password);
        await Usuario.update(
            {
                password_hash: hash,
            },
            {
                where: { email },
            }
        );

        res.status(200).json({
            code: 200,
            message: "Contraseña modificada con éxito",
        });
    } catch (error) {
        console.log(error);
        logger.error(
            "Ha ocurrido un error en forgotPassword Controller",
            error
        );
        next(error);
    }
};
