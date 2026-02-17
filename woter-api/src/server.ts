import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AuthenticationComponent } from "./routes/authentication/component";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

const authentication = new AuthenticationComponent();
app.use("/api/v1/authentication", authentication.router.getRouter());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Woter API listening on http://localhost:${port}`);
});
