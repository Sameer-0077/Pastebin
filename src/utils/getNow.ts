import { Request } from "express";

export const getNow = (req: Request) => {
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    return Number(req.headers["x-test-now-ms"]);
  }

  return Date.now();
};
