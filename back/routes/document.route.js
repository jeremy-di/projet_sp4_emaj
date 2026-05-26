import { Router } from "express";
import { getAllDocs, getDocById, addDoc, updateDoc, deleteDoc } from "../controllers/document.controller.js";

const router = Router();

router.get('/', getAllDocs);
router.get('/:id', getDocById);
router.post('/add', addDoc);
router.put('/:id', updateDoc);
router.delete('/:id', deleteDoc);

export default router;