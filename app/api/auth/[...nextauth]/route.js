import NextAuth from "next-auth";
import { authOptions } from "../../../auth";

async function auth(req, res) {
  return await NextAuth(req, res, authOptions);
}

export { auth as GET, auth as POST };
