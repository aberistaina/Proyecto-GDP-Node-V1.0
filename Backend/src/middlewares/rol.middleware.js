import { UnauthorizedError } from "../errors/TypeError.js";
import logger from "../utils/logger.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

export const verificarRoles = (rolesPermitidos = []) => {
    return (req, res, next) => {
        const user = req.user;
        const rol = user.data?.id_rol;

        if (!rol || !rolesPermitidos.includes(rol)) {
            const message = `Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(
                ", "
            )}. El usuario tiene el rol: ${rol}`;

            logger.error(`[${fileName} -> verificarRoles] ${message}`);

            throw new UnauthorizedError("Acceso denegado", {
                requiredRoles: rolesPermitidos,
                userRol: rol,
            });
        }

        next();
    };
};
