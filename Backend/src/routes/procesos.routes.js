import { Router } from "express";
import { connectSubprocess, getAllProcess, getS3Bucket, getSubprocessesOfProcess, readProcessById, readSubprocesoById, saveProcessChanges, saveSubProcessChanges, uploadProcess } from "../controllers/process.controller.js";


const router = Router()
router.get("/", getAllProcess)

router.get("/get-process/:idProceso", readProcessById)
router.get("/get-subproceso/:callActivity/:idProcesoPadre", readSubprocesoById)
router.get("/get-subprocess-process/:idProceso", getSubprocessesOfProcess)
router.post("/connect-subprocess", connectSubprocess)
router.post("/upload-process", uploadProcess)
router.post("/save-process-changes", saveProcessChanges)
router.post("/save-subprocess-changes", saveSubProcessChanges)
router.get("/get-s3", getS3Bucket)




export default router