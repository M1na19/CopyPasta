import { Request, Response } from "express";
import { RecipeAPI } from "../../DB/recipes";
import { pool } from "../../DB/db";
import { UUID } from "crypto";
import { validationResult } from "express-validator";

export async function get_all_recipes(req:Request,res:Response){
    let conn=await pool.getConnection();
    try{
        let recipes=await RecipeAPI.get_all_recipes(conn);
        res.status(200).json({
            "success":true,
            "recipes":recipes
        })
    }catch(e:any){
        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }

    conn.release();
}
export async function get_all_reviews(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}
    let conn=await pool.getConnection();
    let uuid:UUID=req.query.uuid as UUID;
    try{
        let reviews=await RecipeAPI.get_all_reviews(conn,uuid);
        res.status(200).json({
            "success":true,
            "reviews":reviews
        })
    }catch(e:any){
        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }

    conn.release();
}
export async function post_recipe(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}
    let conn=await pool.getConnection();
    let name=req.body.name;
    let author=req.body.author;
    let images=req.body.images || null;
    let type=req.body.type;
    let cookTime=req.body.cookTime || null;
    let difficulty=req.body.difficulty || null;
    let description=req.body.description || null;
    try{
        await RecipeAPI.create_recipe(conn,name,author,images,type,cookTime,difficulty,description);
        res.status(200).json({"success":true})
    }catch(e:any){
        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }

    conn.release();
}