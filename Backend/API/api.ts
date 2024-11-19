import express, {Express,Request,Response} from "express"
import dotenv from "dotenv";
import { get_all_recipies, get_reviews } from "./src/recipes";
import { body, query } from "express-validator";
import { RecipeAPI } from "../DB/recipes";
import { pool } from "../DB/db";
import { randomUUID } from "crypto";

dotenv.config({
    path: "./API/.api.env"
})

const app:Express=express();
const port=process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
pool.getConnection().then(conn=>{
    RecipeAPI.remove_recipe(conn,randomUUID())
})