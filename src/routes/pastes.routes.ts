import { Router } from "express";
import { handleCreatePaste } from "../controllers/pastes.controllers";
import { pasteValidation } from "../middlewares/pastesValidation.middlewares";

const router = Router();

router.post("/pastes", pasteValidation, handleCreatePaste);

export default router;
