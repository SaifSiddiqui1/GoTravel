import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                try {
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        email: credentials.email,
                        password: credentials.password,
                    });
                    if (res.data.token) {
                        return { ...res.data.data, token: res.data.token };
                    }
                    return null;
                } catch { return null; }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).token;
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            (session as any).accessToken = token.accessToken;
            (session.user as any).role = token.role;
            (session.user as any).id = token.id;
            return session;
        },
    },
    pages: { signIn: '/auth/login', error: '/auth/login' },
    session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
