import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const adminPassword = process.env.ADMIN_PASSWORD!;
                const entered = (credentials?.password ?? "") as string;

                // Allow plain text comparison (dev) or bcrypt (if ADMIN_PASSWORD is hashed)
                const isValid = adminPassword.startsWith("$2")
                    ? await bcrypt.compare(entered, adminPassword)
                    : entered === adminPassword;

                if (isValid) {
                    return { id: "1", name: "Admin", email: "admin@anchor-point.local" };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/admin/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
