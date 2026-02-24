import { Router } from "express";
import { viewPaste } from "../controllers/pastes.controllers";

const router = Router();

router.get("/p/:id", viewPaste);

export default router;
