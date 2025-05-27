import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing email or password');
          return null;
        }

        try {
          const client = await clientPromise;
          const db = client.db();
          const usersCollection = db.collection('users');

          const user = await usersCollection.findOne({ email: credentials.email });

          if (!user) {
            console.log('❌ User not found:', credentials.email);
            return null;
          }

          const isValid = await compare(credentials.password, user.hashedPassword);

          if (!isValid) {
            console.log('❌ Invalid password for:', credentials.email);
            return null;
          }

          console.log('✅ Login successful for:', credentials.email);

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || null,
          };
        } catch (error) {
          console.error('🔴 Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/', 
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
