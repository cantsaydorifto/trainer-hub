import { type GetServerSidePropsContext } from "next";
import {
	getServerSession,
	type NextAuthOptions,
	type DefaultSession,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

function getGooogleClientKeys() {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	if (!clientId) {
		throw Error("No Google Client Id");
	}
	if (!clientSecret) {
		throw Error("No Google Client Secret");
	}
	return { clientId, clientSecret };
}

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
	}

	// interface token {
	// 	// ...other properties
	// 	id?: string;
	// }
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
	}
}

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	secret: process.env.JWT_SECRET,
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		session({ session, token }) {
			if (session.user) {
				session.user.id = token.id;
				// session.user.role = user.role; <-- put other properties on the session here
			}
			return session;
		},
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		}),
		GoogleProvider({
			clientId: getGooogleClientKeys().clientId,
			clientSecret: getGooogleClientKeys().clientSecret,
		}),
		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 */
export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext["req"];
	res: GetServerSidePropsContext["res"];
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
