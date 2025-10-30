import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";

const isSecure =
  (process.env.WEBSITE_URL || "").startsWith("https://");

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,   // refresh session once/day
  },

  cookies: {
    sessionToken: {
      name: isSecure ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        path: "/",
        secure: isSecure,
        // Lax is ok for most OAuth flows, but payment providers sometimes POST back.
        // If your Paymob return uses POST, use "none". (Secure MUST be true.)
        sameSite: isSecure ? "none" : "lax",
      },
    },
  },
  
  callbacks: {
    async signIn({ user }) {
      await mongooseConnect();

      const existing = await User.findOne({ email: user.email });
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

