import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { createPaste } from "../services/createPaste.service";
export const handleCreatePaste = async (req: Request, res: Response) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    const paste = createPaste(content, ttl_seconds, max_views);

    return res.status(201).json({
      id: paste.id,
      url: `${process.env.BASE_URL}/p/${paste.id}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
