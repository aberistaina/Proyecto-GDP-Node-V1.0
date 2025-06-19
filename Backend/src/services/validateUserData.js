import { ValidationError, NotFoundError } from "../errors/TypeError.js";
import { isValidName, isValidEmail, isValidPassword } from "../utils/validators.js";
import { Usuarios } from "../models/models.js";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

export const validateUserData = (nombre, email, password) => {

    if (!isValidName(nombre)) {
        throw new ValidationError("El Nombre Proporcionado no cumple con el formato", {
            field: "Nombre",
        });
    }

    if (!isValidEmail(email)) {
        throw new ValidationError("El Email Proporcionado no es válido", {
            field: "Email",
        });
    }

    if (!isValidPassword(password)) {
        throw new ValidationError("La contraseña debe contener 9 caracteres, 4 letras, 4 números, un caracter especial y como mínimo una mayuscula, una minúscula", {
            field: "Password",
        });
    }
};

export const userIfExist = async (email) => {
    
    try {
        if (email) {
        const userByEmail = await Usuarios.findOne({
            where: { email }
        });
        if (userByEmail) {
            throw new ValidationError("Ya existe un usuario registrado con ese Email", {
                field: "email",
            });
        }
    }
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> userIfExist] ${error.message}`);
        throw new ValidationError("Error al validar existencia de usuario", error.message);
    }
}

export const userNotExist = async (email) => {
    
    try {
        if (email) {
        const userByEmail = await Usuarios.findOne({
            where: { email }
        });
        if (!userByEmail) {
            throw new NotFoundError("Usuario no encontrado")
        }else{
            return userByEmail;
        }
    }
    } catch (error) {
        console.log(error);
        logger.error(`[${fileName} -> userNotExist] ${error.message}`);
        throw new ValidationError("Error al validar existencia de usuario", error.message);
    }
}