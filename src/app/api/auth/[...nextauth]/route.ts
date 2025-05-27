import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your-email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const { email, password } = credentials;

        const client = await clientPromise;
        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({ email });

        if (!user) return null;

        const isValid = await compare(password, user.hashedPassword);

        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || null,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
