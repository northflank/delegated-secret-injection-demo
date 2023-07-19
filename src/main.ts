import express from "express";
import jwt from "jsonwebtoken";
import { JwtPayload, SecretCollection } from "./types";

const HOST = process.env.HOST ?? "0.0.0.0";
const PORT = process.env.PORT ?? 8080;

const SECRET = process.env.SECRET ?? "APP_SECRET";

const getSecrets = (secretRequest: JwtPayload): SecretCollection => {
  const { projectId, nfObjectId, nfObjectType } = secretRequest;

  return {
    secrets: [
      {
        type: "FILE",
        path: "/test-file",
        data: `projectId ${projectId}; nfObjectId: ${nfObjectId}; nfObjectType: ${nfObjectType}`,
      },
      { type: "ENV", key: "SECRET_ENV_1", value: "VALUE_1" },
      { type: "ENV", key: "SECRET_ENV_2", value: "VALUE_2" },
      { type: "ENV", key: "PROJECT_ID", value: projectId },
      { type: "ENV", key: "OBJECT_ID", value: nfObjectId },
      { type: "ENV", key: "OBJECT_TYPE", value: nfObjectType },
    ],
  };
};

(async () => {
  const app = express();

  app.get("/", (req, res) => {
    console.log();
    console.log("Incoming request");

    const authorization = req.header("Authorization");

    if (!authorization) {
      console.log("Unauthorized");
      return res.status(401).send("Unauthorized");
    }

    const token = authorization.replace("Bearer ", "");

    let payload: JwtPayload;

    try {
      payload = jwt.verify(token, SECRET) as JwtPayload;
    } catch (e) {
      console.log(`Unauthorized ${e}`);
      return res.status(401).send("Unauthorized");
    }

    console.log(`Authorized`);
    console.log("Payload", payload);

    const secrets = getSecrets(payload);

    return res.send(JSON.stringify(secrets));
  });

  app.listen(Number(PORT), HOST, () => {
    console.log(`Server listening at http://${HOST}:${PORT}`);
  });
})();
