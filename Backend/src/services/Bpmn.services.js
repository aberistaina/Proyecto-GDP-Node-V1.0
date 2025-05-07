import { Procesos, IntermediaProcesos } from "../models/models.js";
import { ProcessError } from "../errors/TypeError.js";
import { changeCallElement } from "../utils/bpmnUtils.js";

export const createProcessIfNotExist = async (idCreador, idProceso, idAprobadores, idNivel, nombre="pendiente", descripcion="", estado , macroproceso=false, transaction=null)=> {
    try {
        const proceso = await Procesos.findOne({ where: { id_bpmn: idProceso } });
    if (!proceso) {
        await Procesos.create({
            id_creador: idCreador,
            id_aprobadores_cargo: idAprobadores,
            id_nivel: idNivel,
            nombre: nombre,
            descripcion: descripcion,
            estado: estado,
            id_bpmn: idProceso,
            macroproceso: macroproceso
        },{ transaction });
    }else{
        await Procesos.update({
            id_aprobadores_cargo: idAprobadores,
            nombre: nombre,
            descripcion: descripcion,
            estado: estado,
            macroproceso: macroproceso
        }, {
            where: {
                id_bpmn: idProceso,
            },
        },{ transaction });
    }
    } catch (error) {
        console.log(error);
        throw new ProcessError("Hubo un error al guardar el proceso en la base de datos")
    }
};


export const createAssociation = async (idProceso, callActivity, calledElement, rutaRelativa, nombre = null, rutaAbsoluta, transaction=null ) => {
    try {
        const subProceso = await Procesos.findByPk(calledElement);
        const asociacion = await CallActivity.findOne({where:{ callActivity}})
    
    

    if (!subProceso && callActivity && calledElement) {
        await Procesos.create({
            idProceso: calledElement,
            nombre: "Pendiente",
            ruta: rutaRelativa,
        },{ transaction });
    }else{
        await Procesos.update({
            nombre: nombre ? nombre : idProceso,
            ruta: rutaRelativa
        }, {
            where: {
                idProceso: calledElement,
            },
        },{ transaction });
    }

    if(!asociacion && callActivity && calledElement){
        await IntermediaProcesos.create({
            idProceso,
            callActivity,
            idSubProceso: calledElement,
        },{ transaction });
    }else{
        await IntermediaProcesos.update({
            idSubProceso: calledElement,
        },
        {
            where: {
                idProceso,
            },
        },{ transaction });
    }

    changeCallElement(rutaAbsoluta, callActivity, calledElement, nombre)
    } catch (error) {
        console.log(error);
        throw new ProcessError("Hubo un error al almacenar la asociación del proceso en la base de datos")
    }
}

