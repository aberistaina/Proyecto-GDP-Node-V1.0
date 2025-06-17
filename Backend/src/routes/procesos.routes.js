import { Router } from "express";
import { connectSubprocess, getAllProcess, getSubprocessesOfProcess, readActualProcessVersion, readProcessVersion, getProcessSummary, saveNewProcessChanges, createCommentary, getCommentaries, createOppotunity, getOpportunities, getNiveles, getProcessByNivel, getNivelById, downloadProcess, getProcessVersions, createNewProcessVersion, getPendingProcess, enviarAprobacion, aprobarProceso, rechazarProceso, getPendingDraft, getBitacoraMessages, generarDocumentacion, createNewBitacoraMessage, getComentariesFiles, getOpportunitiesFiles, downloadFiles } from "../controllers/process.controller.js";
import { getAllCargos } from "../controllers/admin.controller.js";
import { verifyTokenMiddleware } from "../middlewares/login.middleware.js";
import { verificarRoles } from "../middlewares/rol.middleware.js";


const router = Router()

//Rutas Comunes
router.get("/", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getAllProcess)
router.get("/get-process-nivel/:idNivel", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getProcessByNivel)
router.get("/get-process/:idProceso/:version", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), readActualProcessVersion)
router.get("/get-process/resumen-proceso/:idProceso/:version?", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getProcessSummary)
router.get("/get-process-xml/:idProceso/:version", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), readProcessVersion)
router.get("/get-subprocess-process/:idProceso", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getSubprocessesOfProcess)
router.get("/comentarios/getAll/:idProceso/:version", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getCommentaries)
router.get("/comentarios/get-files/:idComentario", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getComentariesFiles)
router.get("/oportunidades/getAll/:idProceso/:version", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getOpportunities)
router.get("/oportunidades/get-files/:idComentario", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getOpportunitiesFiles)
router.get("/get-niveles", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getNiveles)
router.get("/get-nivel/:idNivel", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getNivelById)
router.get("/get-all-cargos", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getAllCargos)
router.get("/get-versiones/:idProceso", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getProcessVersions)
router.get("/download-process/:idProceso", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), downloadProcess)
router.get("/download-files/:fileName", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), downloadFiles)

router.post("/comentarios/agregar", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), createCommentary)
router.post("/oportunidades/agregar", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), createOppotunity)

//Rutas Diseñador

router.get("/get-pending-draft/:idUsuario", verifyTokenMiddleware, verificarRoles([3,1,5]), getPendingDraft)
router.get("/get-bitacora-aprobaciones/:version", verifyTokenMiddleware, verificarRoles([3,1,5]), getBitacoraMessages)

router.post("/connect-subprocess", verifyTokenMiddleware, verificarRoles([3,1,5]), connectSubprocess)
router.post("/save-process-changes", verifyTokenMiddleware, verificarRoles([3,1,5]), saveNewProcessChanges)
router.post("/save-new-version-changes", verifyTokenMiddleware, verificarRoles([3,1,5]), createNewProcessVersion)
router.post("/bitacora/agregar", verifyTokenMiddleware, verificarRoles([3,1,5]), createNewBitacoraMessage)
router.post("/solicitar-aprobacion", verifyTokenMiddleware, verificarRoles([3,1,5]), enviarAprobacion)
router.post("/generar-documentacion", verifyTokenMiddleware, verificarRoles([3,1,5]), generarDocumentacion)

//Rutas Aprobador
router.get("/get-pending-process/:idUsuario",verifyTokenMiddleware, verificarRoles([2,1,5]), getPendingProcess)

router.post("/aprobar-proceso", verifyTokenMiddleware, verificarRoles([2,1,5]), aprobarProceso)
router.post("/rechazar-proceso", verifyTokenMiddleware, verificarRoles([2,1,5]), rechazarProceso)




export default router