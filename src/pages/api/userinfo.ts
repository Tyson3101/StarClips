// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { StatusCodes as STATUS_CODE } from "http-status-codes";
import prisma from "@lib/PrismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = session?.user;
  const users = await prisma.user.findMany({
    include: { providers: true, clips: true },
  });
  console.log(process.env.NEXTAUTH_URL);
  if (session) {
    res.status(STATUS_CODE.OK).json({
      message: "Authorized",
      user,
      users,
    });
  } else res.status(401).json({ message: "Not authorized!", users });
}
