import express, {Express,Request,Response} from "express"
import dotenv from "dotenv";
import { body, query } from "express-validator";
import { RecipeAPI } from "../DB/recipes";
import { pool } from "../DB/db";
import { randomUUID } from "crypto";
import { UserAPI } from "../DB/user";
import { get_all_recipes, get_all_reviews, post_recipe } from "./src/recipes";

dotenv.config({
    path: "./API/.api.env"
})

const app:Express=express();
const port=process.env.PORT || 3000;
app.use(express.json())
app.get("/recipes",get_all_recipes);
app.get("/reviews",
    query('uuid').isUUID(),
    get_all_reviews
);
app.post("/post_recipe",
    body("name").isAlphanumeric().isLength({min:4,max:255}),
    body("images").optional().isArray({min:1,max:10}),
    body("images.*").isAlphanumeric().isLength({min:1,max:25}),
    body("author").isAlphanumeric().isLength({min:4,max:255}),
    body("type").isAlpha().isLength({max:255}),
    body("cookTime").optional().isInt({min:0}),
    body("difficulty").optional().isFloat({min:0,max:5}),
    body("description").optional().isAscii(),
    post_recipe
)
app.post("/request_sign_up",
    body("username").isAlphanumeric().isLength({min:4,max:255}),
    body("name").optional().isAlpha().isLength({min:1}),
    body("password").isAscii().isLength({min:8,max:255}).isStrongPassword(),
    body("image").optional().isAlphanumeric().isLength({min:1,max:25}),
    body("email").optional().isEmail({}).isLength({max:255}),
    body("telephone").optional().isMobilePhone('any'),
    body("description").optional().isAscii(),
)
app.post("/activate_account",
    body("token").isAscii().isLength({max:255})
)
app.post("/log_in",
    body("username").isAlphanumeric().isLength({min:4,max:255}),
    body("password").isAscii().isLength({min:8,max:255}),
)
app.delete("/remove_recipe",
    body('uuid').isUUID()
)
app.delete("/remove_account",
    body("username").isAlphanumeric().isLength({min:4,max:255}),
    body("password").isAscii().isLength({min:8,max:255}),
)
app.post("/rate_recipe",
    body('uuid').isUUID(),
    body('rating').isFloat({min:0,max:5}),
    body('comment').optional().isAscii()
)
app.get("/recipe_data",
    query('uuid').isUUID(),
)
app.post("/add_type",
    body("type").isAlpha().isLength({max:255}),
)
app.get("/get_types")
app.post("/add_favorite",
    body('uuid').isUUID()
)
app.delete('/delete_favorite',
    body('uuid').isUUID()
)
app.get('/get_favorites')
app.post('/request_change_password',
    body("username").isAlphanumeric().isLength({min:4,max:255}),
    body("password").isAscii().isLength({min:8,max:255}),
)
app.post('/change_password',
    body("token").isAscii().isLength({max:255})
)
app.get('/get_user_data',
    body("username").isAlphanumeric().isLength({min:4,max:255})
)
app.post('/refresh');
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});