import { Router } from "express";
import { connectSubprocess, getAllProcess, getSubprocessesOfProcess, readActualProcessVersion, readProcessVersion, getProcessSummary, saveNewProcessChanges, uploadProcess, createCommentary, getCommentaries, createOppotunity, getOpportunities, getNiveles, getProcessByNivel, getNivelById, downloadProcess, getProcessVersions, createNewProcessVersion, getPendingProcess, enviarAprobacion, aprobarProceso, rechazarProceso, getPendingDraft, getBitacoraMessages, generarDocumentacion, createNewBitacoraMessage, getComentariesFiles, getOpportunitiesFiles, downloadFiles } from "../controllers/process.controller.js";
import { getAllCargos, getAllRoles } from "../controllers/admin.controller.js";



const router = Router()

router.get("/", getAllProcess)
router.get("/get-process-nivel/:idNivel", getProcessByNivel)
router.get("/get-process/:idProceso/:version", readActualProcessVersion)
router.get("/get-process/resumen-proceso/:idProceso/:version?", getProcessSummary)
router.get("/get-process-xml/:idProceso/:version", readProcessVersion)
router.get("/get-subprocess-process/:idProceso", getSubprocessesOfProcess)
router.get("/comentarios/getAll/:idProceso/:version", getCommentaries)
router.get("/comentarios/get-files/:idComentario", getComentariesFiles)
router.get("/oportunidades/getAll/:idProceso/:version", getOpportunities)
router.get("/oportunidades/get-files/:idComentario", getOpportunitiesFiles)
router.get("/get-niveles", getNiveles)
router.get("/get-nivel/:idNivel", getNivelById)
router.get("/get-all-cargos", getAllCargos)
router.get("/get-versiones/:idProceso", getProcessVersions)
router.get("/download-process/:idProceso", downloadProcess)
router.get("/download-files/:fileName", downloadFiles)

router.get("/get-pending-process/:idUsuario", getPendingProcess)
router.get("/get-pending-draft/:idUsuario", getPendingDraft)
router.get("/get-bitacora-aprobaciones/:version", getBitacoraMessages)

router.post("/connect-subprocess", connectSubprocess)
router.post("/upload-process", uploadProcess)
router.post("/save-process-changes", saveNewProcessChanges)
router.post("/save-new-version-changes", createNewProcessVersion)
router.post("/comentarios/agregar", createCommentary)
router.post("/oportunidades/agregar", createOppotunity)
router.post("/bitacora/agregar", createNewBitacoraMessage)
router.post("/solicitar-aprobacion", enviarAprobacion)
router.post("/aprobar-proceso", aprobarProceso)
router.post("/rechazar-proceso", rechazarProceso)
router.post("/generar-documentacion", generarDocumentacion)







export default router