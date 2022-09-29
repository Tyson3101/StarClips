// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { StatusCodes as STATUS_CODE } from "http-status-codes";
import prisma from "@lib/PrismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = session?.user;
  if (user) {
    if (req.body.addComment) {
      return addComment(req, res, user);
    }
    if (req.body.deleteComment) {
      return deleteComment(req, res, user);
    }
  }
  res.status(STATUS_CODE.UNAUTHORIZED).json({ error: "Not logged in!" });
}
async function addComment(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {
  if (!user || !user.email)
    res.status(STATUS_CODE.UNAUTHORIZED).json({ error: "Not logged in!" });
  const { message, clipId } = req.body;
  if (!message || !clipId)
    return res
      .status(STATUS_CODE.FORBIDDEN)
      .json({ error: "Not all information present" });

  const comment = await prisma.comment.create({
    data: {
      message,
      createdAt: Date.now(),
      clip: {
        connect: {
          clipId,
        },
      },
      author: {
        connect: {
          email: user.email as string,
        },
      },
    },
    include: { author: true, likes: true },
  });
  res.status(STATUS_CODE.OK).json({ comment });
}
async function deleteComment(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {}
