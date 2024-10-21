import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../lib/db";
import { verifyPassword } from "../../../lib/auth";

export const authOptions = {
  session: {
    secret: process.env.NEXTAUTH_SECRET,
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await connectToDatabase();
        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({
          email: credentials.email,
        });
        if (!user) {
          client.close();
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
        }

        const isPasswordValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          client.close();
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
        }

        client.close();
        // Any object returned will be saved in `user` property of the JWT
        return { email: user.email };
      },
    }),
  ],
};

export default NextAuth(authOptions);
