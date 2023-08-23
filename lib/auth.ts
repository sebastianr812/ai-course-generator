import { DefaultSession, NextAuthOptions, getServerSession } from "next-auth";
import { db } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            credits: number;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        credits: number;
    }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        jwt: async ({ token, }) => {
            const db_user = await db.user.findFirst({
                where: {
                    email: token.email
                }
            });
            if (db_user) {
                token.id = db_user.id;
                token.credits = db_user.credits
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.credits = token.credits;
            }
            return session;
        }
    },
    secret: process.env.NEXT_AUTH_SECRET as string,
    adapter: PrismaAdapter(db),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ]
}

export const getAuthSession = () => {
    return getServerSession(authOptions);
}