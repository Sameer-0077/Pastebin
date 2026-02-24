import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import healthzRoute from "./routes/healthz.routes";
import pastesRoutes from "./routes/pastes.routes";
import pastePage from "./routes/pastePage";

const app: Application = express();

app.use(express.json());

app.use("/api", pastesRoutes);
app.use("/api", healthzRoute);
app.use("/", pastePage);

app.get("/", (req: Request, res: Response) => {
  res.send("Pastebin is running  🚀");
});

export default app;
