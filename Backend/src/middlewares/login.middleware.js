import { AuthenticationError, UnauthorizedError } from "../errors/TypeError.js";
import logger from "../utils/logger.js";
import { comparePassword, createToken, verifyToken, hashPassword } from "../services/auth.services.js";
import { Usuarios, Roles, Cargo } from "../models/models.js";


export const issueTokenMiddleware = async(req, res, next) =>{
    try {
        const {email, password } = req.body


        let user = await Usuarios.findOne({
            attributes: ["id_usuario", "id_rol", "id_cargo", "id_jefe_directo", "nombre", "email", "password_hash"],
            include: [
                {
                    model: Roles,
                    as: "id_rol_role"
                },
                {
                    model: Cargo,
                    as: "id_cargo_cargo"
                }
            ],
            where:{
                email
            }
        })
        
        if (!user){
            throw new UnauthorizedError("Email o contraseña incorrectos")
        }
        
        const userMap = {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            email: user.email,
            rol: user.id_rol_role?.nombre,
            id_rol: user.id_rol_role?.id_rol,
            cargo: user.id_cargo_cargo?.nombre,
            id_cargo: user.id_cargo_cargo?.id_cargo,
        }

        const validatePassword = await comparePassword(password, user.password_hash)

        if(!validatePassword){
            throw new UnauthorizedError("Email o contraseña incorrectos")
        }

        const token = createToken(userMap, "1d")

        req.token = token
        next()

    } catch (error) {
        console.log(error.message)
        logger.error("Ha ocurrido un error en issuetoken Middleware", error)
        next(error);
    } 
}

export const verifyTokenMiddleware = async(req, res, next) =>{

    try {
        let {authorization} = req.headers
        let tokenFromQuery = req.query.token
        let token = null

        if(authorization && authorization.startsWith('Bearer ')){
            token = authorization.split(" ")[1] 
        }else if(tokenFromQuery){
            token = tokenFromQuery
        }else{
            throw new AuthenticationError("Token no proporcionado")
        }


        const decoded = await verifyToken(token);

        req.user = decoded
        req.token = token
        next()
        
    } catch (error) {
        console.log(error)
        logger.error("Ha ocurrido un error en authMiddleware Middleware", error)
        next(error);
    }
}