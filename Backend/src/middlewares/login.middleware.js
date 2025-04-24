import { AuthenticationError, UnauthorizedError } from "../errors/TypeError.js";
import logger from "../utils/logger.js";
import { comparePassword, createToken, verifyToken } from "../services/auth.services.js";
import { Usuario } from "../models/Usuario.model.js";
import { Rol } from "../models/Rol.model.js"
import { Empresa } from "../models/Empresa.model.js"


export const issueTokenMiddleware = async(req, res, next) =>{
    try {
        const {email, password } = req.body

        let user = await Usuario.findOne({
            attributes: ["id_usuario", "nombre", "email", "id_rol", "id_empresa", "password_hash" ],
            include: [
                {
                    model: Rol,
                    as: "roles"
                },
                {
                    model: Empresa,
                    as: "empresa"
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
            rol: user.roles.nombre,
            empresa: user.empresa.nombre
        }

        const validatePassword = await comparePassword(password, user.password_hash)

        if(!validatePassword){
            throw new UnauthorizedError("Email o contraseña incorrectos")
        }

        const token = createToken(userMap, "1d")

        req.token = token
        /* req.user = userMap */
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

        req.user = decoded.data
        next()
        
    } catch (error) {
        console.log(error)
        logger.error("Ha ocurrido un error en authMiddleware Middleware", error)
        next(error);
    }
}