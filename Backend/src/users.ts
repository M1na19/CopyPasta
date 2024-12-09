import { Request, Response } from "express";
import { prisma, transporter } from "../api";
import { hash, UUID } from "crypto";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { sendPasswordMail, sendSignUpMail } from "./mail";
const refresh_token_exp = 28;
const sign_up_pass_exp = 1;

export class TokenAPI {
  static access_expiration: number = 2;
  static secret: string = process.env.SECRET as string;

  //Returns username if successfull
  static async issue_access_token(username: string): Promise<string | null> {
    let exp = new Date();
    exp.setHours(exp.getHours() + this.access_expiration);
    let header = Buffer.from(
      JSON.stringify({
        alg: "bcrypt",
        typ: "JWT",
      }),
    ).toString("base64");
    let payload = Buffer.from(
      JSON.stringify({
        username: username,
        expiration: exp,
      }),
    ).toString("base64");

    let salt = await bcrypt.genSalt(10);
    let hashed = await bcrypt.hash(
      (header + payload + this.secret).toString(),
      salt,
    );
    let secret = Buffer.from(hashed).toString("base64");
    return header + "." + payload + "." + secret;
  }
  //Return userID on success
  static async verify_access_token(at: string): Promise<string | null> {
    let parts = at.split(".");
    if (
      parts.length != 3 &&
      !(await bcrypt.compare(
        parts[0] + parts[1] + this.secret,
        Buffer.from(parts[2], "base64").toString(),
      ))
    ) {
      return null;
    }
    let payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    let exp: Date = new Date(payload.expiration);
    if (exp < new Date()) {
      return null;
    }
    return payload.username;
  }
}
export async function request_sign_up(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    console.log(validationResult(req));
    res.status(400).json({ success: false });
    return;
  }

  let username = req.body.username;
  let name = req.body.name || null;
  let password = req.body.password;
  let image = req.file?.filename ? "/upload_images/" + req.file.filename : null;
  let email = req.body.email;
  let telephone = req.body.telephone || null;
  let description = req.body.description || null;
  try {
    let salt = await bcrypt.genSalt(10);
    let hashed = await bcrypt.hash(password, salt);
    await prisma.$transaction(async (prisma) => {
      await prisma.users.create({
        data: {
          username: username,
          name: name,
          password: hashed,
          image: image,
          email: email,
          telephone: telephone,
          description: description,
        },
      });
      let exp = new Date();
      exp.setDate(exp.getDate() + sign_up_pass_exp);
      const token = (
        await prisma.authTokens.create({
          data: {
            value: crypto.randomBytes(64).toString("hex"),
            users: {
              connect: {
                username: username,
              },
            },
            purpose: "SIGNUP",
            expiration: exp,
          },
          select: {
            value: true,
          },
        })
      ).value;
      await sendSignUpMail(transporter, email, token);
    });

    res.status(200).json({
      success: true,
    });
  } catch (e: any) {
    console.log(e);
    if (e instanceof PrismaClientKnownRequestError && e.code == "P2002") {
      res.status(403).json({
        success: false,
        error: "User with the same credentials already exists",
      });
    } else {
      res.status(500).json({ success: false });
    }
  }
}
export async function request_activation(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  let token = req.params.token;
  try {
    await prisma.$transaction(async (prisma) => {
      let user = (
        await prisma.authTokens.findUniqueOrThrow({
          where: {
            value: token,
            purpose: "SIGNUP",
            expiration: {
              gt: new Date(),
            },
          },
          select: {
            users: {
              select: {
                username: true,
              },
            },
          },
        })
      ).users.username;
      await prisma.authTokens.delete({
        where: {
          value: token,
          purpose: "SIGNUP",
        },
      });
      await prisma.users.update({
        data: {
          active: true,
        },
        where: {
          username: user,
        },
      });
    });

    res.redirect("http://localhost:5173/");
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError && e.code == "P2025") {
      res.status(400).json({ success: false, error: "Input not found in db" });
    } else {
      res.status(500).json({ success: false });
    }
  }
}
export async function log_in(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }
  let username = req.body.username;
  let password = req.body.password;
  try {
    let hashed = (
      await prisma.users.findUniqueOrThrow({
        where: {
          username: username,
          active: true,
        },
        select: {
          password: true,
        },
      })
    ).password;
    if (await bcrypt.compare(password, hashed)) {
      let exp = new Date();
      exp.setDate(exp.getDate() + refresh_token_exp);
      let access_token = await TokenAPI.issue_access_token(username);
      let refresh_token = await prisma.$transaction(async (prisma) => {
        await prisma.authTokens.deleteMany({
          where: {
            users: {
              username: username,
            },
            purpose: "REFRESH",
          },
        });
        return (
          await prisma.authTokens.create({
            data: {
              value: crypto.randomBytes(64).toString("hex"),
              users: {
                connect: {
                  username: username,
                },
              },
              purpose: "REFRESH",
              expiration: exp,
            },
            select: {
              value: true,
            },
          })
        ).value;
      });
      res
        .status(200)
        .cookie("AccessToken", access_token, {
          signed: true,
          secure: false,
          sameSite: "lax",
          path: "/",
          maxAge: TokenAPI.access_expiration * 60 * 60 * 1000,
        })
        .cookie("RefreshToken", refresh_token, {
          path: "/refresh",
          secure: false,
          signed: true,
          sameSite: "lax",
          httpOnly: true,
          maxAge: refresh_token_exp * 24 * 60 * 60 * 1000,
        })
        .json({
          success: true,
        });
    } else {
      res.status(200).json({
        success: false,
      });
    }
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError && e.code == "P2025") {
      res.status(200).json({ success: false });
    } else {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }
}
export async function remove_account(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  let user = res.locals.username;
  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.users.update({
        where: {
          username: user,
        },
        data: {
          active: false,
        },
      });
      await prisma.authTokens.deleteMany({
        where: {
          users: {
            username: user,
          },
        },
      });
    });
    res.status(200).json({
      success: true,
    });
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError && e.code == "P2025") {
      res.status(400).json({ success: false, error: "Input not found in db" });
    } else {
      res.status(500).json({ success: false });
    }
  }
}
export async function request_password_change(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  let email = req.body.email;
  try {
    let exp = new Date();
    exp.setDate(exp.getDate() + sign_up_pass_exp);
    const user = (
      await prisma.users.findUniqueOrThrow({
        where: {
          email: email,
        },
        select: {
          username: true,
        },
      })
    ).username;
    await prisma.authTokens.deleteMany({
      where: {
        purpose: "PASSWORD",
        users: {
          username: user,
        },
      },
    });
    const token = (
      await prisma.authTokens.create({
        data: {
          value: crypto.randomBytes(64).toString("hex"),
          users: {
            connect: {
              username: user,
            },
          },
          purpose: "PASSWORD",
          expiration: exp,
        },
        select: {
          value: true,
        },
      })
    ).value;
    await sendPasswordMail(transporter, email, token);

    res.status(200).json({
      success: true,
    });
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError && e.code == "P2025") {
      res.status(400).json({ success: false, error: "Input not found in db" });
    } else {
      res.status(500).json({ success: false });
    }
  }
}
export async function change_password(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  let token = req.params.token;
  let password = req.body.password;
  try {
    await prisma.$transaction(async (prisma) => {
      let user = (
        await prisma.authTokens.findUniqueOrThrow({
          where: {
            value: token,
            purpose: "PASSWORD",
            expiration: {
              gt: new Date(),
            },
          },
          select: {
            users: {
              select: {
                username: true,
              },
            },
          },
        })
      ).users.username;
      await prisma.authTokens.deleteMany({
        where: {
          users: {
            username: user,
          },
          purpose: "PASSWORD",
        },
      });
      let salt = await bcrypt.genSalt(10);
      let hashed = await bcrypt.hash(password, salt);
      await prisma.users.update({
        data: {
          password: hashed,
        },
        where: {
          username: user,
        },
      });
    });

    res.status(200).json({
      success: true,
    });
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError && e.code == "P2025") {
      res.status(400).json({ success: false, error: "Input not found in db" });
    } else {
      res.status(500).json({ success: false });
    }
  }
}
export async function get_user_data(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  let username = req.query.username as string;
  try {
    let user = await prisma.users.findUniqueOrThrow({
      where: {
        username: username,
        active: true,
      },
      select: {
        username: true,
        name: true,
        email: true,
        image: true,
        telephone: true,
        description: true,
        uploadTime: true,
      },
    });
    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError && e.code == "P2025") {
      res.status(400).json({ success: false, error: "Input not found in db" });
    } else {
      res.status(500).json({ success: false });
    }
  }
}
export async function refresh(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ success: false });
    return;
  }

  try {
    if (!req.signedCookies["RefreshToken"])
      throw "No token available for refresh";

    let username = (
      await prisma.authTokens.findUniqueOrThrow({
        where: {
          purpose: "REFRESH",
          value: req.signedCookies["RefreshToken"],
          expiration: {
            gt: new Date(),
          },
        },
        select: {
          users: {
            select: {
              username: true,
            },
          },
        },
      })
    ).users.username;
    let exp = new Date();
    exp.setDate(exp.getDate() + refresh_token_exp);
    let access_token = await TokenAPI.issue_access_token(username);
    let refresh_token = await prisma.$transaction(async (prisma) => {
      await prisma.authTokens.deleteMany({
        where: {
          users: {
            username: username,
          },
          purpose: "REFRESH",
        },
      });
      return (
        await prisma.authTokens.create({
          data: {
            value: crypto.randomBytes(64).toString("hex"),
            users: {
              connect: {
                username: username,
              },
            },
            purpose: "REFRESH",
            expiration: exp,
          },
          select: {
            value: true,
          },
        })
      ).value;
    });
    res
      .status(200)
      .cookie("AccessToken", access_token, {
        signed: true,
        secure: false,
        sameSite: "lax",
        maxAge: TokenAPI.access_expiration * 60 * 60 * 1000,
      })
      .cookie("RefreshToken", refresh_token, {
        path: "/refresh",
        secure: false,
        signed: true,
        sameSite: "lax",
        httpOnly: true,
        maxAge: refresh_token_exp * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
      });
  } catch (e: any) {
    if (
      (e instanceof PrismaClientKnownRequestError && e.code == "P2025") ||
      e == "No token available for refresh"
    ) {
      res.status(400).json({ success: false, error: "Input not found in db" });
    } else {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }
}
