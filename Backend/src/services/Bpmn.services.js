import { Procesos } from "../models/Procesos.model.js";
import { CallActivity } from "../models/CallActivity.model.js"
import { ProcessError } from "../errors/TypeError.js";
import { changeCallElement } from "../utils/bpmnUtils.js";

export const createProcessIfNotExist = async (idProceso, nombre="pendiente", rutaRelativa)=> {
    try {
        const proceso = await Procesos.findByPk(idProceso);
    if (!proceso) {
        await Procesos.create({
            idProceso,
            nombre: nombre,
            ruta: rutaRelativa,
        });
    }else{
        await Procesos.update({
            nombre: nombre ? nombre : proceso.nombre,
            ruta: rutaRelativa,
        }, {
            where: {
                idProceso,
            },
        });
    }
    } catch (error) {
        console.log(error);
        throw new ProcessError("Hubo un error al guardar el proceso en la base de datos")
    }
};


export const createAssociation = async (idProceso, callActivity, calledElement, rutaRelativa, nombre = null, rutaAbsoluta ) => {
    try {
        const subProceso = await Procesos.findByPk(calledElement);
        const asociacion = await CallActivity.findOne({where:{ callActivity}})
    
    

    if (!subProceso && callActivity && calledElement) {
        await Procesos.create({
            idProceso: calledElement,
            nombre: "Pendiente",
            ruta
        });
    }else{
        await Procesos.update({
            nombre: nombre ? nombre : idProceso,
            ruta: rutaRelativa
        }, {
            where: {
                idProceso: calledElement,
            },
        });
    }

    if(!asociacion && callActivity && calledElement){
        await CallActivity.create({
            idProceso,
            callActivity,
            idSubProceso: calledElement,
        });
    }else{
        await CallActivity.update({
            idSubProceso: calledElement,
        },
        {
            where: {
                idProceso,
            },
        });
    }

    changeCallElement(rutaAbsoluta, callActivity, calledElement, nombre)
    } catch (error) {
        console.log(error);
        throw new ProcessError("Hubo un error al almacenar la asociación del proceso en la base de datos")
    }
}

