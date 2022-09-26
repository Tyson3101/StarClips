// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { StatusCodes as STATUS_CODE } from "http-status-codes";
//import token from "randomatic";
import prisma from "@lib/PrismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = session?.user;
  if (user) {
    if (req.body.addClip) {
      return addClip(req, res, user);
    }
    if (req.body.delteClip) {
      return deleteClip(req, res, user);
    }
  }
  res.status(STATUS_CODE.UNAUTHORIZED).json({ error: "Not logged in!" });
}
async function addClip(req: NextApiRequest, res: NextApiResponse, user: User) {
  if (!user || !user.email)
    res.status(STATUS_CODE.UNAUTHORIZED).json({ error: "Not logged in!" });
  const { title, visabilty, game, video } = req.body;
  if (!title || !visabilty || !game || !video)
    return res
      .status(STATUS_CODE.FORBIDDEN)
      .json({ error: "Not all information present" });

  const { id } = await prisma.clip.create({
    data: {
      title,
      game,
      visabilty,
      author: {
        connect: {
          email: user.email as string,
        },
      },
    },
  });
  console.log(id);
  res.status(STATUS_CODE.OK).send(id);
}
async function deleteClip(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {}
