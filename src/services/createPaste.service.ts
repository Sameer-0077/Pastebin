import { nanoid } from "nanoid";
import { Paste } from "../types/pastes.types";

const pastes = new Map<string, Paste>();
export const createPaste = (
  content: string,
  ttl_seconds?: number,
  max_views?: number,
): Paste => {
  const id = nanoid(8);
  const now = Date.now();

  //   const ttlSeconds = ttl_seconds !== undefined ? Number(ttl_seconds) : null;

  const paste: Paste = {
    id,
    content,
    created_at: now,
    expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
    max_views: max_views ?? null,
  };

  pastes.set(id, paste);
  return paste;
};
