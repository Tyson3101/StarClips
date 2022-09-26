// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import sgMail from "@sendgrid/mail";
import JWT from "jsonwebtoken";
import token from "randomatic";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { StatusCodes as STATUS_CODE } from "http-status-codes";
import prisma from "@lib/PrismaClient";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = session?.user;
  if (!user) {
    const userCheckEmail = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    const userCheckUsername = await prisma.user.findFirst({
      where: {
        username: req.body.username,
      },
    });
    if (userCheckEmail == null) {
      if (userCheckUsername == null) {
        if (req.body.changeVerificationStatus) {
          return verifyWithCode(req, res);
        }
        if (req.body.requestNewVerificationJWT) {
          return createVerificationCode(req, res);
        }
      } else {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ error: "Username already in use!" });
      }
    } else {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ error: "Account already in use with this email!" });
    }
  }
  res.status(STATUS_CODE.UNAUTHORIZED).json({ error: "Already logged in!" });
}

async function verifyWithCode(req: NextApiRequest, res: NextApiResponse) {
  const verificationCheck = await prisma.verification.findFirst({
    where: {
      email: req.body.email,
    },
  });
  if (!verificationCheck)
    return res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({ error: "No code sent yet" });
  const token = req.body.token;
  try {
    const jwt = JWT.verify(
      verificationCheck.jwt,
      process.env.VERIFICATION_SECRET!
    ) as { email: string; token: string };
    if (jwt.token !== token)
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ error: "Code does not match!" });
    if (verificationCheck)
      await prisma.verification.delete({
        where: {
          email: req.body.email,
        },
      });
    return res.status(STATUS_CODE.OK).json({ success: true });
  } catch (e: any) {
    return res.status(STATUS_CODE.UNAUTHORIZED).json({ error: e.message || e });
  }
}

async function createVerificationCode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const verificationCheck = await prisma.verification.findFirst({
    where: {
      email: req.body.email,
    },
  });
  const verificationToken = token("0", 7);
  const jwt = JWT.sign(
    { email: req.body.email, token: verificationToken },
    process.env.VERIFICATION_SECRET!,
    {
      expiresIn: 60 * 5,
    }
  );
  if (verificationCheck) {
    await prisma.verification.update({
      where: {
        email: verificationCheck.email,
      },
      data: {
        jwt,
      },
    });
  } else {
    await prisma.verification.create({
      data: {
        email: req.body.email as string,
        jwt,
      },
    });
  }
  const msg = {
    to: req.body.email, // Change to your recipient
    from: "noreply.starclips@gmail.com", // Change to your verified sender
    subject: "Verify Email",
    text: `Star Clips Verification Code: ${verificationToken}`,
    html: generateHTMLforEmail(verificationToken),
  };

  try {
    await sgMail.send(msg);
    return res.send(STATUS_CODE.OK);
  } catch (e: any) {
    console.log(e);
    return res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "Error sending email!" });
  }
}

function generateHTMLforEmail(token: string) {
  return `
    <div style="background-color: rgb(172, 147, 147);font-family: Arial, Helvetica, sans-serif;margin: 0;padding: 3rem 3rem; max-width: fit-content;">
      <header style="color: rgb(80,0,80);">
        <h1 style="font-size: 3.5rem; margin: 0; padding: 0;">Star Clips</h1>
        <span style="font-size: 0.88rem; margin: 0; padding: 0;">Email Verification Code</span>
      </header>
      <div style="font-size: 3rem; margin: 2rem 0rem; padding: 0; color: rgb(31,31,31);">
        <p style="margin: 0; padding: 0;">Your code is</p>
        <span style="background-color: rgb(150, 114, 114);font-size: 4.9rem;margin: 0; padding: 0;">${token}</span>
      </div>
    </div>
  `;
}
