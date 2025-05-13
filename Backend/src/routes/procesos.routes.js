import { Router } from "express";
import { connectSubprocess, getAllProcess, getSubprocessesOfProcess, readActualProcessVersion, readProcessVersion, getProcessSummary, saveProcessChanges, saveSubProcessChanges, uploadProcess, createCommentary, getCommentaries, createOppotunity, getOpportunities, getNiveles, getProcessByNivel, getNivelById, downloadProcess, getProcessVersions, createNewProcessVersion, getPendingProcess, enviarAprobacion } from "../controllers/process.controller.js";


const router = Router()

router.get("/", getAllProcess)
router.get("/get-process-nivel/:idNivel", getProcessByNivel)
router.get("/get-process/:idProceso/:version", readActualProcessVersion)
router.get("/get-process/resumen-proceso/:idProceso/:version?", getProcessSummary)
router.get("/get-process-xml/:idProceso/:version", readProcessVersion)
router.get("/get-subprocess-process/:idProceso", getSubprocessesOfProcess)
router.get("/comentarios/getAll/:idProceso", getCommentaries)
router.get("/oportunidades/getAll/:idProceso", getOpportunities)
router.get("/get-niveles", getNiveles)
router.get("/get-nivel/:idNivel", getNivelById)
router.get("/get-versiones/:idProceso", getProcessVersions)
router.get("/download-process/:idProceso", downloadProcess)
router.get("/get-pending-process/:idUsuario", getPendingProcess)

router.post("/connect-subprocess", connectSubprocess)
router.post("/upload-process", uploadProcess)
router.post("/save-process-changes", saveProcessChanges)
router.post("/save-new-version-changes", createNewProcessVersion)
router.post("/save-subprocess-changes", saveSubProcessChanges)
router.post("/comentarios/agregar", createCommentary)
router.post("/oportunidades/agregar", createOppotunity)
router.post("/solicitar-aprobacion", enviarAprobacion)







export default router