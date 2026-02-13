import { Router, Request, Response } from "express";

const router = Router();

router.get("/healthz", (req: Request, res: Response): Response => {
  try {
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false });
  }
});

export default router;
