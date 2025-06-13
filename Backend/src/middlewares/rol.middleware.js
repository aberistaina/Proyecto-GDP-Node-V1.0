export const verificarRoles = (rolesPermitidos = []) => {
    return (req, res, next) => {
        const user = req.user;
        const rol = user.data?.id_rol

        if (!rol || !rolesPermitidos.includes(rol)) {
            return res.status(403).json({
                code: 403,
                message: `Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(", ")}.`
            });
        }

        next();
    };
};