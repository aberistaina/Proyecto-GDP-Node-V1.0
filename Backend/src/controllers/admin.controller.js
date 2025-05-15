import { Procesos, IntermediaProcesos, Usuarios, Aprobadores, ComentariosVersionProceso, VersionProceso,OportunidadesMejora, Niveles, Cargo, Roles } from "../models/models.js";
import crypto from 'crypto'
import { formatShortTime } from "../utils/formatearFecha.js"
import logger from "../utils/logger.js";
import { userIfExist } from "../services/validateUserData.js";
import { hashPassword } from "../services/auth.services.js";


//CRUD Usuarios
export const getAllUsers = async(req, res, next)=>{
    try {
        const usuarios = await Usuarios.findAll({
            attributes:{exclude: ["password_hash"]},
            include:[
                {
                    model: Cargo,
                    as: 'id_cargo_cargo',
                },
                {
                    model: Roles,
                    as: 'id_rol_role',
                }
            ],
        })

        const usuariosMap = usuarios.map((usuario) => {
            const data = usuario.toJSON();
            return {
                id_usuario: data.id_usuario,
                nombre: data.nombre,
                email: data.email,
                created_at: formatShortTime(data.created_at),
                cargo: data.id_cargo_cargo?.nombre,
                rol: data.id_rol_role?.nombre
            };
            });


        res.status(200).json({
            code: 200,
            message: "Usuarios Encontrados con éxito",
            data:usuariosMap

        });
    } catch (error) {
        logger.error("Controlador getAllUsers", error);
        console.log(error);
        next(error);
    }
}

export const getUserById = async(req, res, next)=>{
    try {
        const { id } = req.params
        const usuario = await Usuarios.findOne({
            attributes:{exclude: ["password_hash"]},
            where:{
                id_usuario: id
            }
            
        })

        if(!usuario){
            res.status(400).json({
            code: 400,
            message: "No existe este usuario en la base de datos",
        });
        }


        res.status(200).json({
            code: 200,
            message: "Usuario Encontrado con éxito",
            data:usuario

        });
    } catch (error) {
        logger.error("Controlador getUserById", error);
        console.log(error);
        next(error);
    }
}

export const updateUser = async (req, res, next) =>{
    try {
        const { id_rol, id_cargo, id_jefe_directo, nombre, email } = req.body
        const { id } = req.params

        const usuario = await Usuarios.findByPk(id)

        if(!usuario){
            res.status(400).json({
            code: 400,
            message: "No existe este usuario en la base de datos",
        });
        }

        const updateUser = {
            id_rol,
            id_cargo,
            nombre,
            email
        }

        if (id_jefe_directo !== undefined && id_jefe_directo !== "") {
            updateUser.id_jefe_directo = id_jefe_directo;
            }

        await Usuarios.update(updateUser,{
            where:{
                id_usuario: id
            }
        }
    )

        res.status(200).json({
            code: 200,
            message: "Usuario Actualizado Correctamente",
        });
    } catch (error) {
        logger.error("Controlador updateUser", error);
        console.log(error);
        next(error);
    }
}

export const deleteUser = async (req, res, next) =>{
    try {
        const { id } = req.params

        const user = await Usuarios.findOne({where:{id_usuario: id}})

        if(!user){
            res.status(400).json({
            code: 400,
            message: "No existe este usuario en la base de datos",
        });
        }

        Usuarios.destroy({
            where:{
                id_usuario: id
            }
        })

        res.status(200).json({
            code: 200,
            message: "Usuarios Eliminado con éxito",
        });
    } catch (error) {
        logger.error("Controlador deleteUser", error);
        console.log(error);
        next(error);
    }
}

export const createUser = async (req, res, next) =>{

    const { nombre, email, id_rol, id_cargo, id_jefe_directo } = req.body

    await userIfExist(email)
    const password = crypto.randomBytes(16).toString('hex')

    const hash = hashPassword(password)

    await Usuarios.create({
        nombre,
        email,
        password_hash: hash,
        id_rol,
        id_cargo,
        id_jefe_directo
    })
    try {
        res.status(201).json({
            code: 201,
            message: "Usuario Creado con éxito",
        });
    } catch (error) {
        logger.error("Controlador createUser", error);
        console.log(error);
        next(error);
    }
}

//CRUD Roles
export const getAllRoles = async (req, res, next) =>{
    try {
        const roles = await Roles.findAll()
        res.status(200).json({
            code: 200,
            message: "Roles Encontrados con éxito",
            data:roles
        });
    } catch (error) {
        logger.error("Controlador getAllRoles", error);
        console.log(error);
        next(error);
    }
    
}

export const getRolById = async(req, res, next)=>{
    try {
        const { id } = req.params

        const rol = await Roles.findOne({
            where:{
                id_rol: id
            }
            
        })

        if(!rol){
            res.status(400).json({
            code: 400,
            message: "No existe este rol en la base de datos",
        });
        }


        res.status(200).json({
            code: 200,
            message: "Rol Encontrado con éxito",
            data:rol

        });
    } catch (error) {
        logger.error("Controlador getRolById", error);
        console.log(error);
        next(error);
    }
}

export const updateRol = async (req, res, next) =>{
    try {

        const { nombre } = req.body
        const { id } = req.params

        const rol = await Roles.findByPk(id)

        if(!rol){
            res.status(400).json({
            code: 400,
            message: "No existe este rol en la base de datos",
        });
        }

        await Roles.update({
            nombre, 
        },{
            where:{
                id_rol: id
            }
        }
    )

        res.status(200).json({
            code: 200,
            message: "Rol Actualizado Correctamente",
        });
    } catch (error) {
        logger.error("Controlador updateRoles", error);
        console.log(error);
        next(error);
    }
}

export const deleteRol = async (req, res, next) =>{
    try {
        const { id } = req.params

        const rol = await Roles.findByPk(id)

        if(!rol){
            res.status(400).json({
            code: 400,
            message: "No existe este rol en la base de datos",
        });
        }

        Roles.destroy({
            where:{
                id_rol: id
            }
        })

        res.status(200).json({
            code: 200,
            message: "Rol Eliminado con éxito",
        });
    } catch (error) {
        logger.error("Controlador deleteRoles", error);
        console.log(error);
        next(error);
    }
}

export const createRol = async (req, res, next) =>{
    try {
        const { nombre } = req.body

        const roles = await Roles.findOne({where:{nombre}})

        if(roles){
            res.status(400).json({
            code: 400,
            message: "Ya existe un Rol con este nombre",
            })
        }

        await Roles.create({
            nombre
        })

        res.status(201).json({
            code: 201,
            message: "Rol Creado Correctamente",
        });
    } catch (error) {
        logger.error("Controlador createRoles", error);
        console.log(error);
        next(error);
    }
}



//CRUD Cargos
export const getAllCargos = async (req, res, next) =>{
    try {
        const cargos = await Cargo.findAll()
        res.status(200).json({
            code: 200,
            message: "Cargos Encontrados con éxito",
            data:cargos
        });
    } catch (error) {
        logger.error("Controlador getAllCargos", error);
        console.log(error);
        next(error);
    }
    
}

export const getCargoById = async(req, res, next)=>{
    try {
        const { id } = req.params

        const cargo = await Cargo.findOne({
            where:{
                id_cargo: id
            }
            
        })

        if(!cargo){
            res.status(400).json({
            code: 400,
            message: "No existe este cargo en la base de datos",
        });
        }


        res.status(200).json({
            code: 200,
            message: "Cargo Encontrado con éxito",
            data:cargo

        });
    } catch (error) {
        logger.error("Controlador getCargoById", error);
        console.log(error);
        next(error);
    }
}

export const updateCargo = async (req, res, next) =>{
    try {
        console.log(req.body);
        const { nombre, descripcion } = req.body
        const { id } = req.params

        const cargo = await Cargo.findByPk(id)

        if(!cargo){
            res.status(400).json({
            code: 400,
            message: "No existe este cargo en la base de datos",
        });
        }

        await Cargo.update({
            nombre,
            descripcion 
        },{
            where:{
                id_cargo: id
            }
        }
    )
        res.status(200).json({
            code: 200,
            message: "Cargo Actualizado Correctamente",
        });
    } catch (error) {
        logger.error("Controlador updateCargos", error);
        console.log(error);
        next(error);
    }
}

export const deleteCargo = async (req, res, next) =>{
    try {
        const { id } = req.params

        const cargo = await Cargo.findByPk(id)

        if(!cargo){
            res.status(400).json({
            code: 400,
            message: "No existe este cargo en la base de datos",
        });
        }

        Cargo.destroy({
            where:{
                id_cargo: id
            }
        })

        res.status(200).json({
            code: 200,
            message: "Cargo Eliminado con éxito",
        });
    } catch (error) {
        logger.error("Controlador deleteCargos", error);
        console.log(error);
        next(error);
    }
}

export const createCargo = async (req, res, next) =>{
    try {
        const { nombre, descripcion } = req.body

        const cargo = await Cargo.findOne({where:{nombre}})

        if(cargo){
            res.status(400).json({
            code: 400,
            message: "Ya existe un Cargo con este nombre",
            })
        }

        await Cargo.create({
            nombre,
            descripcion
        })

        res.status(201).json({
            code: 201,
            message: "Cargo Creado Correctamente",
        });
    } catch (error) {
        logger.error("Controlador createCargos", error);
        console.log(error);
        next(error);
    }
}


//CRUD Niveles
export const getAllNiveles = async (req, res, next) =>{
    try {
        const niveles = await Niveles.findAll()
        res.status(200).json({
            code: 200,
            message: "Niveles Encontrados con éxito",
            data:niveles
        });
    } catch (error) {
        logger.error("Controlador getAllNiveles", error);
        console.log(error);
        next(error);
    }
    
}

export const getNivelById = async(req, res, next)=>{
    try {
        const { id } = req.params

        const nivel = await Niveles.findOne({
            where:{
                id_nivel: id
            }
            
        })

        if(!nivel){
            res.status(400).json({
            code: 400,
            message: "No existe este nivel en la base de datos",
        });
        }


        res.status(200).json({
            code: 200,
            message: "Nivel Encontrado con éxito",
            data:nivel

        });
    } catch (error) {
        logger.error("Controlador getNivelById", error);
        console.log(error);
        next(error);
    }
}

export const updateNivel = async (req, res, next) =>{
    try {

        const { nombre } = req.body
        const { id } = req.params

        const nivel = await Niveles.findByPk(id)

        if(!nivel){
            res.status(400).json({
            code: 400,
            message: "No existe este nivel en la base de datos",
        });
        }

        await Niveles.update({
            nombre, 
        },{
            where:{
                id_nivel: id
            }
        }
    )
        res.status(200).json({
            code: 200,
            message: "Nivel Modificado Correctamente",
        });
    } catch (error) {
        logger.error("Controlador updateNiveles", error);
        console.log(error);
        next(error);
    }
}

export const deleteNivel = async (req, res, next) =>{
    try {

        const { id } = req.params

        const nivel = await Niveles.findByPk(id)

        if(!nivel){
            res.status(400).json({
            code: 400,
            message: "No existe este nivel en la base de datos",
        });
        }

        Niveles.destroy({
            where:{
                id_nivel: id
            }
        })

        res.status(200).json({
            code: 200,
            message: "Nivel Eliminado con éxito",
        });
    } catch (error) {
        logger.error("Controlador deleteNiveles", error);
        console.log(error);
        next(error);
    }
}

export const createNivel = async (req, res, next) =>{
    try {
        const { nombre } = req.body

        const nivel = await Niveles.findOne({where:{nombre}})

        if(nivel){
            res.status(400).json({
            code: 400,
            message: "Ya existe un Nivel con este nombre",
            })
        }

        await Niveles.create({
            nombre
        })

        res.status(201).json({
            code: 201,
            message: "Nivel Creado Correctamente",
        });
    } catch (error) {
        logger.error("Controlador createNiveles", error);
        console.log(error);
        next(error);
    }
}


//Options Admin

export const defineTokenExpiration = async (req, res, next) =>{
    try {
        res.status(200).json({
            code: 200,
            message: "Usuarios Encontrados con éxito",
        });
    } catch (error) {
        logger.error("Controlador getAllProcess", error);
        console.log(error);
        next(error);
    }
}

//Data Card Admin
export const getCardData = async(req, res, next) =>{
    try {
        const niveles = await Niveles.findAll()
        const cargos = await Cargo.findAll()
        const roles = await Roles.findAll()
        const usuarios = await Usuarios.findAll({
            attributes:{exclude: ["password_hash"]}
        })

        const cardsData = {
            usuarios: usuarios.length,
            cargos: cargos.length,
            roles: roles.length,
            niveles:niveles.length
        }

        res.status(200).json({
            code: 200,
            message: "Roles Encontrados con éxito",
            data:cardsData
        });
    } catch (error) {
         logger.error("Controlador getAllProcess", error);
        console.log(error);
        next(error);
    }
}

export const getEntidades = async(req, res, next) =>{
    try {
        const niveles = await Niveles.findAll()
        const cargos = await Cargo.findAll()
        const roles = await Roles.findAll()
        const usuarios = await Usuarios.findAll({
            attributes:["id_usuario", "nombre"]
        })
        
        const entidades = {
            cargos,
            roles,
            niveles,
            usuarios
        }

        res.status(200).json({
            code: 200,
            message: "Entidades Encontradas con éxito",
            data:entidades
        });
    } catch (error) {
        logger.error("Controlador getEntidades", error);
        console.log(error);
        next(error);
    }
}