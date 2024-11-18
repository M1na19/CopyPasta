import mysql from 'mysql2/promise';
import { PoolOptions } from 'mysql2/promise';
import dotenv from "dotenv"

dotenv.config({
    path: "./DB/.db.env"
})
const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10,
};
export const pool:mysql.Pool=mysql.createPool(dbConfig);
