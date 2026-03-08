import { Role } from "src/common/enums/role.enum";

export interface TokenPayload {
  sub: string;

  email: string;

  role: Role;

  username: string;
}
