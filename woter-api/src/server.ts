import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AuthenticationComponent } from "./routes/authentication/component";
import { UserComponent } from "./routes/user/component";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

const authentication = new AuthenticationComponent();
app.use("/api/v1/authentication", authentication.router.getRouter());
const user = new UserComponent();
app.use("/api/v1/user", user.router.getRouter());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Woter API listening on http://localhost:${port}`);
});
