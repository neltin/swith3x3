import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "../lib/queryFuntion";

export const authOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }   
      },
      async authorize(credentials) {
        // En algún momento puede ser que acá sea posible que necesitemos cambiar la ruta para que sea dinámica (venga del .env) y que el idioma también sea dinámico

        const user = await login(credentials.email, credentials.password);

        console.log("user: ", user);
        if (user) {
          return user;
        } else {
          return  null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // user is only available the first time a user signs in authorized
      if (user) {
          token.id = user.id;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/users/login",
  },
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.NEXT_JWT_SECRET,
  }
};
