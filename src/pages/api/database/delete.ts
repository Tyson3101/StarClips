// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/PrismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await prisma.provider.deleteMany();
    res.send(await prisma.user.deleteMany());
  } catch (e) {
    res.send(e);
  }
}
