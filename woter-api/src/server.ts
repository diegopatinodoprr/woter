import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AuthenticationComponent } from "./routes/authentication/component";
import { BddComponent } from "./routes/bdd/component";
import { BddRouteService, MongoDatabaseService } from "./routes/bdd/service";
import { UserComponent } from "./routes/user/component";

dotenv.config();

async function bootstrap() {
  const app = express();
  const port = Number(process.env.PORT ?? 3000);

  app.use(cors());
  app.use(express.json());

  const sharedDatabaseService = new MongoDatabaseService();
  const sharedBddService = new BddRouteService(sharedDatabaseService);

  try {
    await sharedBddService.connect({ databaseName: process.env.MONGO_DATABASE_NAME });
  } catch (error) {
    console.error("Aucune base de donnees disponible. Arret du serveur.");
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }

  const authentication = new AuthenticationComponent(sharedBddService);
  app.use("/api/v1/authentication", authentication.router.getRouter());

  const user = new UserComponent(sharedBddService);
  app.use("/api/v1/user", user.router.getRouter());

  const bdd = new BddComponent(sharedBddService);
  app.use("/api/v1/bdd", bdd.router.getRouter());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.listen(port, () => {
    console.log(`Woter API listening on http://localhost:${port}`);
  });
}

void bootstrap();
