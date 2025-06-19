import { AuthenticationError, UnauthorizedError } from "../errors/TypeError.js";
import logger from "../utils/logger.js";
import { comparePassword, createToken, verifyToken } from "../services/auth.services.js";
import { Usuarios, Roles, Cargo } from "../models/models.js";
import { getAdminConfig } from "../services/admin.services.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);
const { token_expiracion_login } = await getAdminConfig();

export const issueTokenMiddleware = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        let user = await Usuarios.findOne({
            attributes: [
                "id_usuario",
                "id_rol",
                "id_cargo",
                "id_jefe_directo",
                "nombre",
                "email",
                "password_hash",
            ],
            include: [
                {
                    model: Roles,
                    as: "id_rol_role",
                },
                {
                    model: Cargo,
                    as: "id_cargo_cargo",
                },
            ],
            where: {
                email,
            },
        });

        if (!user) {
            throw new UnauthorizedError("Email o contraseña incorrectos");
        }

        const userMap = {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            email: user.email,
            rol: user.id_rol_role?.nombre,
            id_rol: user.id_rol_role?.id_rol,
            cargo: user.id_cargo_cargo?.nombre,
            id_cargo: user.id_cargo_cargo?.id_cargo,
        };

        const validatePassword = await comparePassword(
            password,
            user.password_hash
        );

        if (!validatePassword) {
            throw new UnauthorizedError("Email o contraseña incorrectos");
        }

        const token = createToken(userMap, token_expiracion_login);

        req.token = token;
        next();
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> issueTokenMiddleware] ${error.message}`);
        next(error);
    }
};

export const verifyTokenMiddleware = async (req, res, next) => {
    try {
        const tokenFromHeader = req.headers.authorization?.split(" ")[1];
        const tokenFromQuery = req.query.token;
        const tokenFromBody = req.body.token;
        const tokenFromCookie = req.cookies.token;

        const token = tokenFromHeader || tokenFromQuery || tokenFromCookie || tokenFromBody

        if (!token) {
            throw new AuthenticationError("Token no proporcionado");
        }

        const decoded = await verifyToken(token);
        req.user = decoded;
        req.token = token;
        next();
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> verifyTokenMiddleware] ${error.message}`);
        next(error);
    }
};

