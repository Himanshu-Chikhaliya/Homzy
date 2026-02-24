import express from 'express';
import { createResidency, getAllResidencies, getResidency, removeResidency } from '../controllers/resdCntrl.js';
import jwtCheck from '../config/auth0Config.js';
const router = express.Router()

router.post("/create", jwtCheck, createResidency)
router.get("/allresd", getAllResidencies)
router.get("/:id", getResidency)
router.delete("/remove/:id", jwtCheck, removeResidency)

export { router as residencyRoute }
