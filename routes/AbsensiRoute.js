import express from "express";
import { createAbsensi, getAbsensi,  getAbsensiById, updateAbsensiById, deleteAbsensi } from "../controllers/Absensi.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.post('/absensi', verifyUser, createAbsensi);
router.get('/absensi', verifyUser, getAbsensi);
router.get('/absensi/:id', verifyUser, getAbsensiById);
router.patch('/absensi/:id', verifyUser, adminOnly, updateAbsensiById);
router.delete('/absensi/:id', verifyUser, adminOnly, deleteAbsensi);
router.delete('/absensi/:id', verifyUser, adminOnly, deleteAbsensi);

export default router;
