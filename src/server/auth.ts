import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GOOGLEProvider from "next-auth/providers/GOOGLE";
import { env } from "~/env";
import { db } from "~/server/db";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
      name: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      // Retrieve the user's role from the database using Prisma
      const userData = await db.user.findUnique({
        where: { id: user.id },
        select: { role: true ,
                  name: true,

        },

          // Select the 'role' field from the database
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: userData?.role ?? Role.user,
          name: userData?.name ?? 'user',// Assign role to session; fallback to 'USER' if undefined
        },
      };
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GOOGLEProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // Add more providers if needed
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
