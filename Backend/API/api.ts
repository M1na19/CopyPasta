import express, {Express,Request,Response} from "express"
import dotenv from "dotenv";
import { body, query } from "express-validator";
import { RecipeAPI } from "../DB/recipes";
import { pool } from "../DB/db";
import { randomUUID } from "crypto";
import { UserAPI } from "../DB/user";

dotenv.config({
    path: "./API/.api.env"
})

const app:Express=express();
const port=process.env.PORT || 3000;
app.get("/recipes");
app.get("/reviews",
    query('recipe').notEmpty().isAlphanumeric().isLength({min:4,max:255}),
    query('author').notEmpty().isAlphanumeric().isLength({min:4,max:255}),

);
app.post("/post_recipe",
    body("name").notEmpty().isAlphanumeric().isLength({min:4,max:255}),
    body("images").optional().isArray({min:1,max:10}),
    body("images.*").isAlphanumeric().isLength({min:1,max:25}),
    body("author").notEmpty().isAlphanumeric().isLength({min:4,max:255}),
    body("type").optional().isAlpha().isLength({max:255}),
    body("cookTime").optional().isInt({min:0}),
    body("difficulty").optional().isFloat({min:0,max:5}),
    body("description").optional().isAscii()
)
app.post("/sign_up",
    body("username").notEmpty().isAlphanumeric().isLength({min:4,max:255}),
    body("name").optional().isAlpha().isLength({min:1}),
    body("password").notEmpty().isAscii().isLength({min:8,max:255}),
    body("image").optional().isAlphanumeric().isLength({min:1,max:25}),
    body("email").optional().isEmail({}).isLength({max:255}),
    body("telephone").optional().isMobilePhone('any'),
    body("description").optional().isAscii()
)
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});