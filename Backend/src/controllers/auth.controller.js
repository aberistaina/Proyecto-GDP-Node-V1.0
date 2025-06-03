import { Usuarios, Token } from "../models/models.js";
import { createToken, hashPassword, verifyToken } from "../services/auth.services.js";
import {
    validateUserData,
    userIfExist,
    userNotExist,
} from "../services/validateUserData.js";
import { AuthenticationError } from "../errors/TypeError.js";
import { normalizeEmail } from "../utils/normalize.js";
import logger from "../utils/logger.js";
import { sendEmail } from "../services/email.services.js";
import { getAdminConfig } from "../services/admin.services.js";

const { token_expiracion_password } = await getAdminConfig()

export const createUser = async (req, res, next) => {
    try {
        const { nombre, email, password, empresa } = req.body;

        //Se valida que el usuario no exista en la base de datos
        await userIfExist(email);
        //se validan que la información personal cumpla ciertas condiciones
        validateUserData(nombre, email, password);

        const hash = hashPassword(password);

        await Usuarios.create({
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
        const token = req.token

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
            });

        res.status(200).json({
            code: 200,
            message: "Inicio de sesión Exitoso"
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

        //Verifica si el usuario no existe en la base de datos, si existe lo almacena en la variable user
        const user = await userNotExist(email);

        const token = createToken(email, token_expiracion_password);

        await Token.create({
            id_usuario: user.id_usuario,
            token,
            activo: true,
        });

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
        const { password } = req.body;
        const email = req.user.data


        if (!email) {
            throw new AuthenticationError("No se pudo validar tu solicitud. Por favor solicita un nuevo enlace de recuperación.");
        }

        //se verifica si el token existe en la base de datos de token de recuperación de contraseña
        const token = await Token.findOne({
            where: { token: req.token },
        });


        if (!token) {
            throw new AuthenticationError("No se pudo validar tu solicitud. Por favor solicita un nuevo enlace de recuperación.");
        }
        
        if (token.activo === false) {
            throw new AuthenticationError("El enlace de recuperación ya no es válido.");
        }

        const hash = hashPassword(password);
        const user = await Usuarios.findOne({ where: { email } });
        
        await Usuarios.update(
            {
                password_hash: hash,
            },
            {
                where: { email },
            }
        );

        sendEmail(email, "passwordChanged", user.Nombre, null);

        //Se anula el token luego de utilizado
        await Token.update(
            {
                activo: false,
            },
            {
                where: { token: req.token },
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

export const getAuthenticatedUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
            });
            return res.status(401).json({ message: "No autenticado" });
        }

        const data = await verifyToken(token); 
        const usuario = data.data;

        return res.status(200).json({ usuario });
    } catch (error) {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        logger.error("Ha ocurrido un error en getAuthenticatedUser Controller", error);
        return res.status(401).json({ message: "Error de autenticación" });
    }
};


export const logout = (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });

    res.status(200).json({ 
        code:200,
        message: "Sesión cerrada exitosamente" 
    });
};
