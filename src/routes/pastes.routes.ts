import { Router } from "express";
import { getPaste, handleCreatePaste } from "../controllers/pastes.controllers";
import { pasteValidation } from "../middlewares/pastesValidation.middlewares";

const router = Router();

router.post("/pastes", pasteValidation, handleCreatePaste);
router.get("/pastes/:id", getPaste);

export default router;
