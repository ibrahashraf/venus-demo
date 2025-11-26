import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

const isSecure =
  (process.env.WEBSITE_URL || "").startsWith("https://");

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await mongooseConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.verified) throw new Error("Email not verified");
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid credentials");
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  cookies: {
    sessionToken: {
      name: isSecure ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        path: "/",
        secure: isSecure,
        sameSite: isSecure ? "none" : "lax",
      },
    },
  },
  
  callbacks: {
    async signIn({ user }) {
      await mongooseConnect();

      let existing = await User.findOne({ email: user.email });
      if (!existing) {
        existing = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }


      return true;
    },
    async jwt({ token }) {
      await mongooseConnect();
       if (token?.email) {
        const dbUser = await User.findOne({  email: token.email }).select("_id");
        if (dbUser?._id) token.userId = dbUser._id.toString();
       }
       return token;
    },

    async session({ session, token }) {
      if (token?.userId) {
        session.user.id = token.userId;
      } else {
      }
      return session;
    },
  
  },
};

export default NextAuth(authOptions);

