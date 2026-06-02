import type { JwtPayload } from "jsonwebtoken";
import type { ROLES } from ".";

export interface TJwtPayload extends JwtPayload {
  id: number;
  email: string;
  role: ROLES;
}