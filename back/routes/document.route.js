import { Router } from "express";
import { getAllDocs, getDocById, addDoc, updateDoc, deleteDoc } from "../controllers/document.controller.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get('/', auth, getAllDocs);
router.get('/:id', auth, getDocById);
router.post('/add', auth, addDoc);
router.put('/:id', auth, updateDoc);
router.delete('/:id', auth, deleteDoc);

export default router;