import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import healthzRoute from "./routes/healthz";

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Pastebin is running  🚀");
});

app.use("/api", healthzRoute);

export default app;
