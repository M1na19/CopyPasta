import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import {
  body,
  check,
  cookie,
  ExpressValidator,
  param,
  query,
} from "express-validator";
import {
  add_favorite,
  add_type,
  get_all_recipes,
  get_all_reviews,
  get_list,
  get_recipe,
  get_types,
  post_recipe,
  rate_recipe,
  remove_favorite,
  remove_recipe,
} from "./src/recipes";
import { CustomValidation } from "express-validator/lib/context-items";
import { TokenAPI } from "./src/users";
import {
  change_password,
  get_user_data,
  log_in,
  refresh,
  remove_account,
  request_activation,
  request_password_change,
  request_sign_up,
} from "./src/users";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import nodemailer from "nodemailer";
dotenv.config({
  path: "./.env",
});

export const prisma = new PrismaClient();
export const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASS,
  },
});

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
  }),
);

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});
app.use(cookieParser(process.env.SECRET));

async function access_token_validator(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let at = req.signedCookies["AccessToken"];
    if (at && typeof at == "string") {
      let username = await TokenAPI.verify_access_token(at);
      if (username != null) {
        res.locals.username = username;
        next();
        return;
      }
    }
    res.status(401).json({
      message: "User not authenticated",
      success: false,
    });
  } catch (e) {
    res.status(401).json({
      message: "Could not authentificate user",
      success: false,
    });
  }
}

app.get("/recipes", get_all_recipes);
app.get("/reviews", query("uuid").isUUID(), get_all_reviews);
app.post(
  "/post_recipe",
  access_token_validator,
  body("name").isAlphanumeric().isLength({ min: 4, max: 255 }),
  body("images").optional().isArray({ min: 1, max: 10 }),
  body("images.*").isAlphanumeric().isLength({ min: 1, max: 25 }),
  body("type").isAlpha().isLength({ max: 255 }),
  body("cookTime").optional().isInt({ min: 0 }),
  body("difficulty").optional().isFloat({ min: 0, max: 5 }),
  body("description").optional().isAscii(),
  post_recipe,
);
app.post(
  "/request_sign_up",
  body("username").isAlphanumeric().isLength({ min: 4, max: 255 }),
  body("name").optional().isAlpha().isLength({ min: 1 }),
  body("password").isAscii().isLength({ min: 8, max: 255 }).isStrongPassword(),
  body("image").optional().isAlphanumeric().isLength({ min: 1, max: 25 }),
  body("email").notEmpty().isEmail({}).isLength({ max: 255 }),
  body("telephone").optional().isMobilePhone("any"),
  body("description").optional().isAscii(),
  request_sign_up,
);
app.post(
  "/activate_account/:token",
  param("token").isAscii().isLength({ max: 255 }),
  request_activation,
);
app.post(
  "/log_in",
  body("username").isAlphanumeric().isLength({ min: 4, max: 255 }),
  body("password").isAscii().isLength({ min: 8, max: 255 }),
  log_in,
);
app.get("/logged_in", access_token_validator, (req: Request, res: Response) => {
  res.json({ username: res.locals.username, success: true });
});
app.post("/log_out", (req: Request, res: Response) => {
  res
    .clearCookie("RefreshToken", { path: "/refresh" })
    .clearCookie("AccessToken")
    .json({
      success: true,
    });
});
app.delete(
  "/remove_recipe",
  access_token_validator,
  body("uuid").isUUID(),
  remove_recipe,
);
app.delete("/remove_account", access_token_validator, remove_account);

app.post(
  "/rate_recipe",
  access_token_validator,
  body("uuid").isUUID(),
  body("rating").isFloat({ min: 0, max: 5 }),
  body("comment").optional().isAscii(),
  rate_recipe,
);
app.get("/recipe_data", query("uuid").isUUID(), get_recipe);
app.post(
  "/add_type",
  access_token_validator,
  body("type").isAscii().isLength({ max: 255 }),
  add_type,
);
app.get("/get_types", get_types);
app.post(
  "/add_to_list",
  access_token_validator,
  body("uuid").isUUID(),
  add_favorite,
);
app.delete(
  "/remove_from_list",
  access_token_validator,
  body("uuid").isUUID(),
  remove_favorite,
);
app.get("/list", access_token_validator, get_list);
app.post(
  "/request_change_password",
  access_token_validator,
  request_password_change,
);
app.post(
  "/change_password/:token",
  param("token").isAscii().isLength({ max: 255 }),
  body("password").isAscii().isLength({ min: 8, max: 255 }).isStrongPassword(),
  change_password,
);
app.get(
  "/get_user_data",
  query("username").isAlphanumeric().isLength({ min: 4, max: 255 }),
  get_user_data,
);
app.post("/refresh", refresh);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
