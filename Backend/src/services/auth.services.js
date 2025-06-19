import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { InvalidTokenError, AuthenticationError } from "../errors/TypeError.js";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

const secret = process.env.SECRET;

export const hashPassword = (password) => {
    if (typeof password !== "string") {
        throw new AuthenticationError("Contraseña inválida");
    }
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
};

export const comparePassword = async (password, hash) => {
    try {
        const validatePassword = await bcrypt.compare(password, hash);
        return validatePassword;
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> comparePassword] ${error.message}`);
        throw new AuthenticationError(null, error.message);
    }
};

export const createToken = (data, expiration) => {
    try {
        return jwt.sign({ data }, secret, { expiresIn: expiration });
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> createToken] ${error.message}`);
        throw new AuthenticationError(null, error.message);
    }
};

export const verifyToken = async (token) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> verifyToken] ${error.message}`);
        throw new InvalidTokenError(null, error.message)
    }
};
