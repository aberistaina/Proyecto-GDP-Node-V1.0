import { Usuarios, VersionProceso, Niveles, Cargo, Roles, Administracion, Procesos } from "../models/models.js";
import crypto from "crypto";
import {  extraerDatosBpmn } from "../utils/bpmnUtils.js";
import { adminValidation } from "../services/admin.services.js";
import { FileError, NotFoundError } from "../errors/TypeError.js";
import { formatShortTime } from "../utils/formatearFecha.js";
import { userIfExist } from "../services/validateUserData.js";
import { hashPassword } from "../services/auth.services.js";
import { getAdminConfig } from "../services/admin.services.js";
import { sequelize } from "../database/database.js";
import { createProcessIfNotExist, createAssociation } from "../services/Bpmn.services.js";
import { uploadFileToS3 } from "../services/s3Client.services.js";
import logger from "../utils/logger.js";
import { fileURLToPath } from "url";
import path from "path";


const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);


//CRUD Usuarios
export const getAllUsers = async (req, res, next) => {
    try {
        const usuarios = await Usuarios.findAll({
            attributes: { exclude: ["password_hash"] },
            include: [
                {
                    model: Cargo,
                    as: "id_cargo_cargo",
                },
                {
                    model: Roles,
                    as: "id_rol_role",
                },
            ],
        });

        if(usuarios.length === 0){
            throw new NotFoundError("No existen usuarios en la base de datos")
        }

        const usuariosMap = usuarios.map((usuario) => {
            const data = usuario.toJSON();
            return {
                id_usuario: data.id_usuario,
                nombre: data.nombre,
                email: data.email,
                id_rol: data.id_rol,
                created_at: formatShortTime(data.created_at),
                cargo: data.id_cargo_cargo?.nombre,
                rol: data.id_rol_role?.nombre,
            };
        });

        res.status(200).json({
            code: 200,
            message: "Usuarios Encontrados con éxito",
            data: usuariosMap,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getAllUsers] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuario = await Usuarios.findOne({
            attributes: { exclude: ["password_hash"] },
            where: {
                id_usuario: id,
            },
        });

        if (!usuario) {
            throw new NotFoundError("No existe el usuario en la base de datos")
        }

        res.status(200).json({
            code: 200,
            message: "Usuario Encontrado con éxito",
            data: usuario,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getUserById] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { id_rol, id_cargo, id_jefe_directo, nombre, email } = req.body;
        const { id } = req.params;

        const usuario = await Usuarios.findByPk(id);

        if (!usuario) {
            throw new NotFoundError("No existe el usuario en la base de datos")
        }

        const updateUser = { id_rol, id_cargo, nombre, email,};

        if (id_jefe_directo !== undefined && id_jefe_directo !== "") {
            updateUser.id_jefe_directo = id_jefe_directo;
        }

        await Usuarios.update(updateUser, {
            where: {
                id_usuario: id,
            },
        });

        res.status(200).json({
            code: 200,
            message: "Usuario Actualizado Correctamente",
        });
    } catch (error) {
        logger.error(`[${fileName} -> updateUser] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await Usuarios.findOne({ where: { id_usuario: id } });

        if (!user) {
            throw new NotFoundError("No existe el usuario en la base de datos")
        }

        await Usuarios.destroy({
            where: {
                id_usuario: id,
            },
        });

        res.status(200).json({
            code: 200,
            message: "Usuario Eliminado con éxito",
        });
    } catch (error) {
        logger.error(`[${fileName} -> deleteUser] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    
    try {
        const { nombre, email, id_rol, id_cargo, id_jefe_directo } = req.body;

        await userIfExist(email);
        const password = crypto.randomBytes(16).toString("hex");

        const hash = hashPassword(password);

        await Usuarios.create({
            nombre,
            email,
            password_hash: hash,
            id_rol,
            id_cargo,
            id_jefe_directo,
        });
        res.status(201).json({
            code: 201,
            message: "Usuario Creado con éxito",
        });
    } catch (error) {
        logger.error(`[${fileName} -> createUser] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//CRUD Roles
export const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Roles.findAll();

        if(roles.length === 0){
            throw new NotFoundError("No Roles en la base de datos")
        }
        res.status(200).json({
            code: 200,
            message: "Roles Encontrados con éxito",
            data: roles,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getAllRoles] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const getRolById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const rol = await Roles.findOne({
            where: {
                id_rol: id,
            },
        });

        if (!rol) {
            throw new NotFoundError("No Existe el rol en la base de datos")
        }

        res.status(200).json({
            code: 200,
            message: "Rol Encontrado con éxito",
            data: rol,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getRolById] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const updateRol = async (req, res, next) => {
    try {
        const { nombre } = req.body;
        const { id } = req.params;

        const rol = await Roles.findByPk(id);

        if (!rol) {
            throw new NotFoundError("No Existe el rol en la base de datos")
        }

        await Roles.update(
            {
                nombre,
            },
            {
                where: {
                    id_rol: id,
                },
            }
        );

        res.status(200).json({
            code: 200,
            message: "Rol Actualizado Correctamente",
        });
    } catch (error) {
        logger.error(`[${fileName} -> updateRol] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const deleteRol = async (req, res, next) => {
    try {
        const { id } = req.params;

        const rol = await Roles.findByPk(id);

        if (!rol) {
            throw new NotFoundError("No Existe el rol en la base de datos")
        }

        await Roles.destroy({
            where: {
                id_rol: id,
            },
        });

        res.status(200).json({
            code: 200,
            message: "Rol Eliminado con éxito",
        });
    } catch (error) {
        logger.error(`[${fileName} -> deleteRol] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const createRol = async (req, res, next) => {
    try {
        const { nombre } = req.body;

        const roles = await Roles.findOne({ where: { nombre } });

        if (roles) {
            throw new NotFoundError("Ya existe un rol con ese nombre")
        }

        await Roles.create({
            nombre,
        });

        res.status(201).json({
            code: 201,
            message: "Rol Creado Correctamente",
        });
    } catch (error) {
        logger.error(`[${fileName} -> createRol] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//CRUD Cargos
export const getAllCargos = async (req, res, next) => {
    try {
        const cargos = await Cargo.findAll();

        if(cargos.length === 0){
            throw new NotFoundError("No existen cargos en la base de datos")
        }
        res.status(200).json({
            code: 200,
            message: "Cargos Encontrados con éxito",
            data: cargos,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getAllCargos] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const getCargoById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const cargo = await Cargo.findOne({
            where: {
                id_cargo: id,
            },
        });

        if (!cargo) {
            throw new NotFoundError("No existe este cargo en la base de datos")
        }

        res.status(200).json({
            code: 200,
            message: "Cargo Encontrado con éxito",
            data: cargo,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getCargoById] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const updateCargo = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        const { id } = req.params;

        const cargo = await Cargo.findByPk(id);

        if (!cargo) {
            throw new NotFoundError("No existe este cargo en la base de datos")
        }

        await Cargo.update(
            {
                nombre,
                descripcion,
            },
            {
                where: {
                    id_cargo: id,
                },
            }
        );
        res.status(200).json({
            code: 200,
            message: "Cargo Actualizado Correctamente",
        });
    } catch (error) {
        logger.error(`[${fileName} -> updateCargo] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const deleteCargo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const cargo = await Cargo.findByPk(id);

        if (!cargo) {
            throw new NotFoundError("No existe este cargo en la base de datos")
        }

        await Cargo.destroy({
            where: {
                id_cargo: id,
            },
        });

        res.status(200).json({
            code: 200,
            message: "Cargo Eliminado con éxito",
        });
    } catch (error) {
        logger.error(`[${fileName} -> deleteCargo] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const createCargo = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;

        const cargo = await Cargo.findOne({ where: { nombre } });

        if (cargo) {
            throw new NotFoundError("Ya existe un cargo con ese nombre")
        }

        await Cargo.create({
            nombre,
            descripcion,
        });

        res.status(201).json({
            code: 201,
            message: "Cargo Creado Correctamente",
        });
    } catch (error) {
        logger.error(`[${fileName} -> createCargo] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//CRUD Niveles
export const getAllNiveles = async (req, res, next) => {
    try {
        const niveles = await Niveles.findAll();

        if(niveles.length === 0){
            throw new NotFoundError("No hay niveles en la base de datos")
        }
        res.status(200).json({
            code: 200,
            message: "Niveles Encontrados con éxito",
            data: niveles,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getAllNiveles] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const getNivelById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const nivel = await Niveles.findOne({
            where: {
                id_nivel: id,
            },
        });

        if (!nivel) {
            throw new NotFoundError("No existe el nivel en la base de datos")
        }

        res.status(200).json({
            code: 200,
            message: "Nivel Encontrado con éxito",
            data: nivel,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getNivelById] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const updateNivel = async (req, res, next) => {
    try {
        const { nombre } = req.body;
        const { id } = req.params;

        const nivel = await Niveles.findByPk(id);

        if (!nivel) {
            throw new NotFoundError("No existe el nivel en la base de datos")
        }

        await Niveles.update(
            {
                nombre,
            },
            {
                where: {
                    id_nivel: id,
                },
            }
        );
        res.status(200).json({
            code: 200,
            message: "Nivel Modificado Correctamente",
        });
    } catch (error) {
        logger.error(`[${fileName} -> updateNivel] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const deleteNivel = async (req, res, next) => {
    try {
        const { id } = req.params;

        const nivel = await Niveles.findByPk(id);

        if (!nivel) {
            throw new NotFoundError("No existe el nivel en la base de datos")
        }

        await Niveles.destroy({
            where: {
                id_nivel: id,
            },
        });

        res.status(200).json({
            code: 200,
            message: "Nivel Eliminado con éxito",
        });
    } catch (error) {
        logger.error(`[${fileName} -> deleteNivel] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const createNivel = async (req, res, next) => {
    try {
        const { nombre } = req.body;

        const nivel = await Niveles.findOne({ where: { nombre } });

        if (nivel) {
            throw new NotFoundError("Ya existe un Nivel con este nombre")
        }

        await Niveles.create({
            nombre,
        });

        res.status(201).json({
            code: 201,
            message: "Nivel Creado Correctamente",
        });
    } catch (error) {
        logger.error(`[${fileName} -> createNivel] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//CRUD Procesos

export const getProcessById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const proceso = await Procesos.findOne({
            where: {
                id_proceso: id,
            },
        });

        if (!proceso) {
            throw new NotFoundError("No existe el proceso en la base de datos")
        }

        res.status(200).json({
            code: 200,
            message: "proceso Encontrado con éxito",
            data: proceso,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getProcessById] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const updateProcess = async (req, res, next) => {
    try {
        const { nivel, nombre, descripcion, estado, macroproceso } = req.body;
        const { id } = req.params;

        const proceso = await Procesos.findByPk(id);

        if (!proceso) {
            throw new NotFoundError("No existe el proceso en la base de datos")
        }

        await proceso.update(
            {
                nombre,
                nivel,
                descripcion,
                estado,
                macroproceso
            },
            {
                where: {
                    id_proceso: id,
                },
            }
        );
        res.status(200).json({
            code: 200,
            message: "Proceso Modificado Correctamente",
        });
    } catch (error) {
        logger.error(`[${fileName} -> updateProcess] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const deleteProcess = async (req, res, next) => {
    try {
        const { id } = req.params;

        const proceso = await Procesos.findByPk(id);

        if (!proceso) {
            throw new NotFoundError("No existe el proceso en la base de datos")
        }

        await Procesos.destroy({
            where: {
                id_nivel: id,
            },
        });

        res.status(200).json({
            code: 200,
            message: "Proceso Eliminado con éxito",
        });
    } catch (error) {
        logger.error(`[${fileName} -> deleteProcess] ${error.message}`);
        console.log(error);
        next(error);
    }
};



//Options Admin

export const setAdminConfig = async (req, res, next) => {
    try {
        const {bucket, procesos, adjuntos, imagenes, documentacion, tokenSesionValor, tokenSesionUnidad,tokenRecuperacionValor, tokenRecuperacionUnidad} = req.body;
        
        adminValidation(bucket, procesos, adjuntos, imagenes, documentacion, tokenSesionValor, tokenSesionUnidad,tokenRecuperacionValor, tokenRecuperacionUnidad)

        const data = {
            token_expiracion_login: `${tokenSesionValor}${tokenSesionUnidad}`,
            token_expiracion_password: `${tokenRecuperacionValor}${tokenRecuperacionUnidad}`,
            s3_bucket:bucket,
            s3_bucket_procesos: procesos,
            s3_bucket_adjuntos: adjuntos,
            s3_bucket_imagenes: imagenes,
            s3_bucket_documentacion: documentacion,
        };

        await Administracion.update(data, { where: { id_administrador: 1 } });

        res.status(200).json({
            code: 200,
            message: "Configuración Guardada con éxito",
        });
    } catch (error) {
        logger.error(`[${fileName} -> setAdminConfig] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const getAdminDataConfig = async (req, res, next) => {
    try {
        const adminConfig = await getAdminConfig();

        const config = {
            bucket: adminConfig.s3_bucket,
            procesos: adminConfig.s3_bucket_procesos,
            adjuntos: adminConfig.s3_bucket_adjuntos,
            imagenes: adminConfig.s3_bucket_imagenes,
            documentacion: adminConfig.s3_bucket_documentacion,
            tokenSesionValor: adminConfig.token_expiracion_login.slice(0, -1),
            tokenSesionUnidad: adminConfig.token_expiracion_login.slice(-1),
            tokenRecuperacionValor: adminConfig.token_expiracion_password.slice(0, -1),
            tokenRecuperacionUnidad: adminConfig.token_expiracion_password.slice(-1)
        };

        res.status(200).json({
            code: 200,
            message: "Configuración obtenida exitosamente",
            data: config,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getAdminDataConfig] ${error.message}`);
        console.log(error);
        next(error);
    }
};

//Data Card Admin
export const getCardData = async (req, res, next) => {
    try {
        const niveles = await Niveles.findAll();
        const cargos = await Cargo.findAll();
        const roles = await Roles.findAll();
        const usuarios = await Usuarios.findAll({
            attributes: { exclude: ["password_hash"] },
        });

        if(niveles.length === 0){
            throw new NotFoundError("No existen niveles en la base de datos")
        }
        if(cargos.length === 0){
            throw new NotFoundError("No existen cargos en la base de datos")
        }
        if(roles.length === 0){
            throw new NotFoundError("No existen roles en la base de datos")
        }
        if(usuarios.length === 0){
            throw new NotFoundError("No existen usuarios en la base de datos")
        }
        const cardsData = {
            usuarios: usuarios.length,
            cargos: cargos.length,
            roles: roles.length,
            niveles: niveles.length,
        };

        res.status(200).json({
            code: 200,
            message: "Datos Encontrados con éxito",
            data: cardsData,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getUserById] ${error.message}`);
        console.log(error);
        next(error);
    }
};

export const getEntidades = async (req, res, next) => {
    try {
        const niveles = await Niveles.findAll();
        const cargos = await Cargo.findAll();
        const roles = await Roles.findAll();
        const usuarios = await Usuarios.findAll({
            attributes: ["id_usuario", "nombre"],
        });
        if(niveles.length === 0){
            throw new NotFoundError("No existen niveles en la base de datos")
        }
        if(cargos.length === 0){
            throw new NotFoundError("No existen cargos en la base de datos")
        }
        if(roles.length === 0){
            throw new NotFoundError("No existen roles en la base de datos")
        }
        if(usuarios.length === 0){
            throw new NotFoundError("No existen usuarios en la base de datos")
        }

        const entidades = {
            cargos,
            roles,
            niveles,
            usuarios,
        };

        res.status(200).json({
            code: 200,
            message: "Entidades Encontradas con éxito",
            data: entidades,
        });
    } catch (error) {
        logger.error(`[${fileName} -> getEntidades] ${error.message}`);
        console.log(error);
        next(error);
    }
};


//Función para subir procesos a S3 y guardar en la base de datos
export const uploadProcess = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            throw new FileError("No se adjuntaron archivos")
        }
        const { archivos } = req.files;
        const { id_aprobador, id_creador, id_nivel } = req.body;

        //Variables momentáneas
        const estado = "activo";
        //variables momentáneas
        const id_aprobadores_cargo = "3";

        const archivosArray = Array.isArray(archivos) ? archivos : [archivos];
        const datosArchivos = [];

        for (const archivo of archivosArray) {
            const datoArchivo = await extraerDatosBpmn(archivo);
            /* const nombreArchivo = formatFileName(archivo.name.split(".")[0]) */

            const nombreProceso = datoArchivo.name;
            datosArchivos.push(datoArchivo);

            const { idProceso, subProcesos } = datoArchivo;

            const nuevoProceso = await createProcessIfNotExist(
                id_creador,
                idProceso,
                id_aprobadores_cargo,
                id_nivel,
                nombreProceso,
                null,
                estado,
                null,
                transaction
            );

            const versionExistente = await VersionProceso.findOne({
                where: {
                    id_proceso: nuevoProceso.id_proceso,
                    estado: "aprobado",
                },
                transaction,
            });

            if (!versionExistente) {
                await VersionProceso.create(
                    {
                        id_proceso: nuevoProceso.id_proceso,
                        id_creador,
                        id_aprobadores_cargo,
                        nombre_version: "1.0",
                        estado: "aprobado",
                        id_bpmn: idProceso,
                    },
                    { transaction }
                );
            }

            for (const subProceso of subProcesos) {
                const callActivity = subProceso.callActivity;
                const calledElement = subProceso.calledElement;

                if (calledElement) {
                    await createProcessIfNotExist(
                        id_creador,
                        calledElement,
                        id_aprobadores_cargo,
                        id_nivel,
                        "pendiente",
                        null,
                        estado,
                        null,
                        transaction
                    );

                    if (callActivity) {
                        await createAssociation(
                            idProceso,
                            callActivity,
                            calledElement,
                            transaction
                        );
                    }
                }
            }
            const { s3_bucket, s3_bucket_procesos } = await getAdminConfig();
            await uploadFileToS3(
                `${s3_bucket}`,
                `${s3_bucket_procesos}/${idProceso}.bpmn`,
                archivo.data,
                "application/xml",
                "1.0",
                "activo"
            );
        }

        await transaction.commit();

        res.status(201).json({
            code: 201,
            message: "Procesos cargado correctamente",
        });
    } catch (error) {
        await transaction.rollback();
        logger.error(`[${fileName} -> uploadProcess] ${error.message}`);
        console.log(error);
        next(error);
    }
};