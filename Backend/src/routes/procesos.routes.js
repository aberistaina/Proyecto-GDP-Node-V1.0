import { Router } from "express";
import { connectSubprocess, getAllProcess, getSubprocessesOfProcess, readActualProcessVersion, readProcessVersion, getProcessSummary, saveNewProcessChanges, getProcessByNivel,  downloadProcess, getProcessVersions, createNewProcessVersion, getPendingProcess, getPendingDraft,  generarDocumentacion, downloadFiles } from "../controllers/process.controller.js";
import { verifyTokenMiddleware } from "../middlewares/login.middleware.js";
import { verificarRoles } from "../middlewares/rol.middleware.js";


const router = Router()

//Rutas Comunes
router.get("/get-all", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getAllProcess)
router.get("/get-process-nivel/:idNivel", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getProcessByNivel)
router.get("/get-process/:idProceso/:version", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), readActualProcessVersion)
router.get("/get-process/resumen-proceso/:idProceso/:version?", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getProcessSummary)
router.get("/get-process-xml/:idProceso/:version", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), readProcessVersion)
router.get("/get-subprocess-process/:idProceso", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getSubprocessesOfProcess)
router.get("/get-versiones/:idProceso", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), getProcessVersions)
router.get("/download-process/:idProceso", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), downloadProcess)
router.get("/download-files/:fileName", verifyTokenMiddleware, verificarRoles([1,2,3,4,5]), downloadFiles)
router.post("/generar-documentacion", verifyTokenMiddleware, verificarRoles([3,1,5]), generarDocumentacion)


//Rutas Diseñador

router.get("/get-pending-draft/:idUsuario", verifyTokenMiddleware, verificarRoles([3,1,5]), getPendingDraft)

router.post("/connect-subprocess", verifyTokenMiddleware, verificarRoles([3,1,5]), connectSubprocess)
router.post("/save-process-changes", verifyTokenMiddleware, verificarRoles([3,1,5]), saveNewProcessChanges)
router.post("/save-new-version-changes", verifyTokenMiddleware, verificarRoles([3,1,5]), createNewProcessVersion)



//Rutas Aprobador
router.get("/get-pending-process/:idUsuario",verifyTokenMiddleware, verificarRoles([2,1,5]), getPendingProcess)


export default router