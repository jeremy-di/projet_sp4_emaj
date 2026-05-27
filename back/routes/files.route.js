
import { Router } from "express";
import { createFiles, getAllFiless, getFilesById, deleteFiles } from "../controllers/files.controller.js"
import { upload } from "../middlewares/multer.js"

const router = Router()

router.post('/new', upload.single('name'), createFiles)
router.get('/all', getAllFiless)
router.get('/:id', getFilesById)
router.delete('/:id', deleteFiles)

export default router