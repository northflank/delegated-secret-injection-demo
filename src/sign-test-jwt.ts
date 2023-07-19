import jwt from "jsonwebtoken";
import { JwtPayload } from "./types";

export const signJwt = (secret: string) => {
  const payload: JwtPayload = {
    projectId: "project.internalId",
    nfObjectId: "internalId",
    nfObjectType: "objecttype",
  };

  return jwt.sign(payload, secret, { expiresIn: "24h" });
};
