import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import healthzRoute from "./routes/healthz.routes";
import pastesRoutes from "./routes/pastes.routes";

const app: Application = express();

app.use(express.json());

app.use("/api", pastesRoutes);
app.use("/api", healthzRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Pastebin is running  🚀");
});

export default app;
