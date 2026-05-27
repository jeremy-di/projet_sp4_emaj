
import { Router } from "express";
import { createFiles, getAllFiless, getFilesById, deleteFiles } from "../controllers/files.controller.js"
import { upload } from "../middlewares/multer.js"
import auth from "../middlewares/auth.js";

const router = Router()

router.post('/new', auth, upload.single('name'), createFiles)
router.get('/all', auth, getAllFiless)
router.get('/:id', auth, getFilesById)
router.delete('/:id', auth, deleteFiles)

export default router