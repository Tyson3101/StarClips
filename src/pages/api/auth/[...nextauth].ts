import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
//import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";
import generateRandomAvatar from "@util/generateAvatar";
import prisma from "@lib/PrismaClient";

const credentialsProperties = {
  username: {},
  email: {},
  password: {},
  code: {},
};

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        ...credentialsProperties,
      },
      async authorize(credentials, req) {
        const isSignInPage = req.body?.callbackUrl
          .toLowerCase()
          .includes("/signin");
        if (isSignInPage) return await handleSignIn(credentials!);
        else return await handleSignUp(credentials!);
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user, profile, account }) => {
      let userCheck = await prisma.user.findFirst({
        where: {
          email: user.email || "",
        },
        include: {
          providers: true,
        },
      });
      if (!user.email?.length) return false;
      if (!userCheck) {
        await prisma.user.create({
          data: {
            username: (profile.username as string) || user.email,
            email: user.email,
            avatar:
              profile.image ||
              (profile.image_url as string) ||
              generateRandomAvatar(),
            verified: true,
            providerIds: [account.provider as any],
            providers: {
              create: [
                {
                  providerName: account.provider as string,
                  image: (profile.image ||
                    profile.image_url ||
                    profile.avatar) as string,
                  username: profile.username as string,
                },
              ],
            },
          },
        });
        return true;
      }
      if (account.provider === "credentials") return true;
      const checkIfProviderAllowed = userCheck.providerIds.some(
        (p) => p === account.provider
      );
      if (checkIfProviderAllowed) {
        if (
          !userCheck.providers.some((p) => p.providerName === account.provider)
        ) {
          await prisma.user.update({
            where: { email: userCheck?.email },
            data: {
              providers: {
                create: [
                  {
                    providerName: account.provider as string,
                    image: (profile.image ||
                      profile.image_url ||
                      profile.avatar) as string,
                    username: profile.username as string,
                  },
                ],
              },
            },
          });
        }
      } else return false;
      return true;
    },
    jwt: async ({ token, user }) => {
      user && (token.user = user);

      return token;
    },
    //@ts-ignore (Types... ?)
    session: async ({ session, token }) => {
      const tokenUser = token.user as User;
      let user = await prisma.user.findFirst({
        where: {
          email: token.email!,
        },
      });
      if (!user) return {};
      const extendedSession = {
        ...session,
        user: {
          ...tokenUser,
          ...user,
        },
      };
      //@ts-ignore
      delete extendedSession.user.password;
      delete extendedSession.user.image;
      return extendedSession;
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
};

async function handleSignIn(credentials: typeof credentialsProperties) {
  const userDetails = {
    email: credentials.email as string,
    password: credentials.password as string,
  };
  const user = await prisma.user.findFirst({
    where: { email: userDetails.email },
  });
  let comparedPassword = false;
  try {
    comparedPassword = await bcrypt.compare(
      userDetails.password,
      user?.password!
    );
  } catch {}
  if (user != null && comparedPassword) {
    return userDetails;
  } else {
    throw new Error("Wrong Email or Password");
  }
}
async function handleSignUp(credentials: typeof credentialsProperties) {
  const userDetails = {
    username: credentials.username as string,
    email: credentials.email as string,
    password: credentials.password as string,
    code: credentials.code as string,
  };

  const userCheck = await prisma.user.findFirst({
    where: { email: userDetails.email },
  });
  if (userCheck == null) {
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    userDetails.password = hashedPassword;
    const res = await fetch(process.env.NEXTAUTH_URL + "api/verify/email", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: userDetails.email,
        username: userDetails.username,
        token: userDetails.code,
        changeVerificationStatus: true,
      }),
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      await prisma.user.create({
        data: {
          username: userDetails.username,
          email: userDetails.email,
          password: hashedPassword,
          avatar: generateRandomAvatar(),
          verified: true,
          providerIds: ["credentials"],
        },
      });
    } else {
      throw new Error(data.error);
    }
    //@ts-ignore
    delete userDetails.code;
    return userDetails;
  } else {
    throw new Error("Email already in use");
  }
}

export default NextAuth(authOptions);
