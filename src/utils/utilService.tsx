import { jwtDecode } from "jwt-decode";
import { UserTokenType } from "./types";

export const decodeJwtToken= (jwt: string) => {
    const decoded: UserTokenType = jwtDecode(jwt);
    return decoded;
  }