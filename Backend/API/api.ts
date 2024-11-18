import express, {Express,Request,Response} from "express"
import dotenv from "dotenv";
import { configDotenv } from "dotenv";
import path from "path";
import { pool } from "../DB/db";
import { TokenAPI, TokenPurpose, UserAPI } from "../DB/user";

dotenv.config({
    path: "./API/.api.env"
})

const app:Express=express();
const port=process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
