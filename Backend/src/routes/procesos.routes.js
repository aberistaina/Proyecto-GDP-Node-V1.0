import { Router } from "express";
import { connectSubprocess, getAllProcess, getSubprocessesOfProcess, readActualProcessVersion, readSubprocesoById, getProcessSummary, saveProcessChanges, saveSubProcessChanges, uploadProcess, createCommentary, getCommentaries } from "../controllers/process.controller.js";


const router = Router()

router.get("/", getAllProcess)
router.get("/get-process/:idProceso", readActualProcessVersion)
router.get("/get-process/resumen-proceso/:idProceso", getProcessSummary)
router.get("/get-subproceso/:callActivity/:idProcesoPadre", readSubprocesoById)
router.get("/get-subprocess-process/:idProceso", getSubprocessesOfProcess)
router.get("/comentarios/getAll/:idProceso", getCommentaries)

router.post("/connect-subprocess", connectSubprocess)
router.post("/upload-process", uploadProcess)
router.post("/save-process-changes", saveProcessChanges)
router.post("/save-subprocess-changes", saveSubProcessChanges)
router.post("/comentarios/agregar", createCommentary)





export default router