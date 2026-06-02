import type { TJwtPayload } from "./auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: TJwtPayload;
    }
  }
}
