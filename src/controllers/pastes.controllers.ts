import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { createPaste } from "../services/createPaste.service";
import { redis } from "../db/redis";
import { getNow } from "../utils/getNow";
import { escapeHtml } from "../utils/escapeHtml";
export const handleCreatePaste = async (req: Request, res: Response) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    const paste = createPaste(content, ttl_seconds, max_views);

    const pasteKey = `paste:${paste.id}`;
    await redis.set(pasteKey, JSON.stringify(paste));

    return res.status(201).json({
      id: paste.id,
      url: `${process.env.BASE_URL}/p/${paste.id}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getPaste = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pasteKey = `paste:${id}`;

    const rawPaste = await redis.get(pasteKey);

    // if no paste availble
    if (!rawPaste) {
      return res.status(404).json({ error: "Paste not found" });
    }

    const paste =
      typeof rawPaste === "string" ? JSON.parse(rawPaste) : rawPaste;

    const now = getNow(req);

    // Check TTL
    if (paste.expires_at && now >= paste.expires_at) {
      await redis.del(pasteKey);
      return res.status(404).json({ error: "Paste expired" });
    }

    // Check view limits
    if (paste.max_views !== null && paste.views >= paste.max_views) {
      await redis.del(pasteKey);
      return res.status(404).json({ error: "View limit exceeded" });
    }

    // Increment view
    paste.views += 1;

    await redis.set(pasteKey, JSON.stringify(paste));

    // Calculate remaining views
    const remaining_views =
      paste.max_views !== null
        ? Math.max(paste.max_views - paste.views, 0)
        : null;

    const date = new Date(paste.expires_at);
    const expires_at = date.toLocaleTimeString();
    return res.status(200).json({
      content: paste.content,
      remaining_views,
      expires_at,
    });
  } catch (error) {
    res.status(500).json({ error: "Sever error" });
  }
};

export const viewPaste = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pasteKey = `paste:${id}`;

    const rawPaste = await redis.get(pasteKey);

    if (!rawPaste) {
      return res.status(404).json({ error: "Paste not found" });
    }

    const paste =
      typeof rawPaste === "string" ? JSON.parse(rawPaste) : rawPaste;

    const now = getNow(req);

    // Cheak TTL
    if (paste.expires_at && now >= paste.expires_at) {
      await redis.del(pasteKey);
      return res.status(404).json({ error: "Paste expired" });
    }

    // Cheack remaining views
    if (paste.max_views && paste.views >= paste.max_views) {
      await redis.del(pasteKey);
      return res.status(404).json({ error: "Max view reached" });
    }

    const safeContent = escapeHtml(paste.content);

    return res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Paste ${id}</title>
            <style>
              body {
                font-family: monospace;
                padding: 20px;
                background: #f6f8fa;
              }
              pre {
                background: #fff;
                padding: 16px;
                border-radius: 6px;
                white-space: pre-wrap;
                word-break: break-word;
              }
            </style>
          </head>
          <body>
            <pre>${safeContent}</pre>
          </body>
        </html>
      `);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
