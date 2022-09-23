// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import sgMail from "@sendgrid/mail";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";
import { StatusCodes as STATUS_CODE } from "http-status-codes";
import prisma from "@lib/PrismaClient";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = session?.user;
  if (user) {
    if (req.body.addProvider) {
      return addProvider(req, res);
    }
    if (req.body.removeProvider) {
      return removeProvider(req, res);
    }
  }
  res.status(STATUS_CODE.UNAUTHORIZED).json({ error: "Not logged in!" });
}

async function addProvider(req: NextApiRequest, res: NextApiResponse) {
  const provider = req.body.provider;
  const user = await prisma.user.findFirst({
    where: {
      email: req.body.email,
    },
  });
  if (!user)
    return res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "User not found in database" });
  const checkIfProviderAllowed = user.providerIds.some((p) => p === provider);
  if (checkIfProviderAllowed)
    return res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({ error: "Account already linked" });
  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      providerIds: [...user.providerIds, provider],
    },
  });
  return res.send(STATUS_CODE.OK);
}

async function removeProvider(req: NextApiRequest, res: NextApiResponse) {}
