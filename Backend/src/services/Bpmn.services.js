import { Procesos, IntermediaProcesos } from "../models/models.js";
import { ProcessError } from "../errors/TypeError.js";


export const createProcessIfNotExist = async (idCreador, idProceso, idAprobadores, idNivel, nombre="pendiente", descripcion="", estado , macroproceso=false, transaction=null)=> {
    try {
        const proceso = await Procesos.findOne({ where: { id_bpmn: idProceso } });
    if (!proceso) {
        const nuevoProceso = await Procesos.create({
            id_creador: idCreador,
            id_aprobadores_cargo: idAprobadores,
            id_nivel: idNivel,
            nombre: nombre,
            descripcion: descripcion,
            estado: estado,
            id_bpmn: idProceso,
            macroproceso: macroproceso === "true"

        },{ transaction });
        return nuevoProceso
    }else{
        await Procesos.update({
            id_aprobadores_cargo: idAprobadores,
            nombre: proceso.nombre === "pendiente" ? nombre : proceso.nombre,
            descripcion: proceso.descripcion,
            estado: estado ? estado : "borrador",
            macroproceso: macroproceso === true

        }, {
            where: {id_bpmn: idProceso},
            transaction 
        }, 
            
    );
        return await Procesos.findOne({ where: { id_bpmn: idProceso } });
    }
    } catch (error) {
        console.warn(`⚠️ Proceso duplicado detectado (${idProceso}`)
        console.log(error);
        throw new ProcessError("Hubo un error al guardar el proceso en la base de datos")
    }
};


export const createAssociation = async (idProceso, callActivity, calledElement ,transaction=null ) => {
    try {
        const asociacion = await IntermediaProcesos.findOne({where:{ call_activity: callActivity}})
    
    if(!asociacion && callActivity && calledElement){
        await IntermediaProcesos.create({
            id_bpmn_padre: idProceso,
            id_bpmn: calledElement,
            call_activity: callActivity,
        },{ transaction });
    }else{
        await IntermediaProcesos.update({
            id_bpmn: calledElement,
        },
        {
            where: {
                id_bpmn_padre: idProceso,
                id_bpmn: calledElement,
            },
        },{ transaction });
    }
    } catch (error) {
        console.log(error);
        throw new ProcessError("Hubo un error al almacenar la asociación del proceso en la base de datos")
    }
}

