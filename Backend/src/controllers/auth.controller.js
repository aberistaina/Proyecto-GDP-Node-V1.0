import { Usuarios, Token } from "../models/models.js";
import jwt from "jsonwebtoken";
import { createToken, hashPassword, verifyToken } from "../services/auth.services.js";
import { validateUserData, userIfExist, userNotExist } from "../services/validateUserData.js";
import { AuthenticationError, NotFoundError } from "../errors/TypeError.js";
import { normalizeEmail } from "../utils/normalize.js";
import logger from "../utils/logger.js";
import { sendEmail } from "../services/email.services.js";
import { getAdminConfig } from "../services/admin.services.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

const { token_expiracion_password } = await getAdminConfig()

export const createUser = async (req, res, next) => {
    const transaction = await sequelize.transaction();
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
        }, {transaction});

        sendEmail(normalizeEmail(email), "registro", nombre);

        await transaction.commit()
        res.status(201).json({
            code: 201,
            message: "Usuario creado con éxito",
        });
    } catch (error) {
        await transaction.rollback()
        logger.error(`[${fileName} -> createUser] ${error.message}`);
        console.log(error);
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
        logger.error(`[${fileName} -> login] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { email } = req.body;

        //Verifica si el usuario no existe en la base de datos, si existe lo almacena en la variable user
        const user = await userNotExist(email);

        const token = createToken(email, token_expiracion_password);

        await Token.create({
            id_usuario: user.id_usuario,
            token,
            activo: true,
        }, { transaction });

        sendEmail(email, "recover-password", user.nombre, token);

        await transaction.commit();
        res.status(200).json({
            code: 200,
            message:
                "Email de recuperación de contraseña enviado correctamente",
        });
    } catch (error) {
        logger.error(`[${fileName} -> forgotPassword] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { password } = req.body;
        const email = req.user.data

        const user = await Usuarios.findOne({ where: { email }, transaction });

        if (!user) {
            throw new NotFoundError("No existe un usuario con este email en la base de datos.");
        }
        
        if (!email) {
            throw new AuthenticationError("No se pudo validar tu solicitud. Por favor solicita un nuevo enlace de recuperación.");
        }

        //se verifica si el token existe en la base de datos de token de recuperación de contraseña
        const token = await Token.findOne({
            where: { 
                token: req.token,
                id_usuario: user.id_usuario
            }, transaction});


        if (!token) {
            throw new AuthenticationError("No se pudo validar tu solicitud. Por favor solicita un nuevo enlace de recuperación.");
        }
        
        if (token.activo === false) {
            throw new AuthenticationError("El enlace de recuperación ya no es válido.");
        }

        const decoded = jwt.verify(req.token, process.env.SECRET);

        if (decoded.email !== email) {
            throw new AuthenticationError("Token inválido para este usuario.");
        }

        const hash = hashPassword(password);
        
        
        await user.update({password_hash: hash}, {transaction});

        sendEmail(email, "passwordChanged", user.Nombre, null);

        //Se anula el token luego de utilizado
        await token.update({activo: false}, {transaction});

        await transaction.commit()
        res.status(200).json({
            code: 200,
            message: "Contraseña modificada con éxito",
        });
    } catch (error) {
        logger.error(`[${fileName} -> changePassword] ${error.message}`);
        console.log(error);
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
                sameSite: "strict"});

            throw new AuthenticationError("Usuario no autenticado.")
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
        console.log(error);
        logger.error("Ha ocurrido un error en getAuthenticatedUser Controller", error);
        next(error)
    }
};

export const logout = (req, res) => {

    try {
        res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });

    res.status(200).json({ 
        code:200,
        message: "Sesión cerrada exitosamente" 
    });
    } catch (error) {
        console.log(error);
        logger.error("Ha ocurrido un error en getAuthenticatedUser Controller", error);
        next(error)
    }
};
