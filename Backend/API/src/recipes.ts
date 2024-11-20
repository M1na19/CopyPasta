import { Request, Response } from "express";
import { PrivateListAPI, RecipeAPI } from "../../DB/recipes";
import { pool } from "../../DB/db";
import { UUID } from "crypto";
import { validationResult } from "express-validator";

export async function get_list(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}
    let conn=await pool.getConnection();
    let user=res.locals.username;
    try{
        let list=await PrivateListAPI.get_list(conn,user);
        res.status(200).json({
            "success":true,
            "list":list
        })
    }catch(e:any){
        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }

    conn.release();
}
export async function get_types(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}
    let conn=await pool.getConnection();
    try{
        let types=await RecipeAPI.get_types(conn);
        res.status(200).json({
            "success":true,
            "types":types
        })
    }catch(e:any){
        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }

    conn.release();
}
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
export async function get_recipe(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}
    let conn=await pool.getConnection();
    let uuid:UUID=req.query.uuid as UUID;
    try{
        let recipe=await RecipeAPI.get_recipe_data(conn,uuid);
        res.status(200).json({
            "success":true,
            "recipe":recipe
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
    await conn.beginTransaction();

    let name=req.body.name;
    let author=res.locals.username;
    let images=req.body.images || null;
    let type=req.body.type;
    let cookTime=req.body.cookTime || null;
    let difficulty=req.body.difficulty || null;
    let description=req.body.description || null;
    
    try{
        await RecipeAPI.create_recipe(conn,name,author,images,type,cookTime,difficulty,description);
        res.status(200).json({"success":true})
        await conn.commit();
    }catch(e:any){
        await conn.rollback()
        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }
    conn.release();
}
export async function remove_recipe(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}

    let conn=await pool.getConnection();
    await conn.beginTransaction();

    let uuid=req.body.uuid;
    try{
        await RecipeAPI.remove_recipe(conn,uuid)
        res.status(200).json({"success":true})
        await conn.commit();

    }catch(e:any){
        await conn.rollback()

        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }
    conn.release();
}
export async function rate_recipe(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}

    let conn=await pool.getConnection();
    await conn.beginTransaction();

    let uuid=req.body.uuid;
    let rating=req.body.rating;
    let comment=req.body.comment || null;
    let user=res.locals.username;
    try{
        await RecipeAPI.rate_recipe(conn,uuid,user,rating,comment);
        res.status(200).json({"success":true})
        await conn.commit();

    }catch(e:any){
        await conn.rollback()
        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }
    conn.release();
}
export async function add_type(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}

    let conn=await pool.getConnection();
    await conn.beginTransaction();

    let type=req.body.type;
    try{
        await RecipeAPI.add_type(conn,type);
        res.status(200).json({"success":true})
        await conn.commit();

    }catch(e:any){
        await conn.rollback()

        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }
    conn.release();
}

export async function add_favorite(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}

    let conn=await pool.getConnection();
    await conn.beginTransaction();

    let uuid=req.body.uuid;
    let user=res.locals.username;
    try{
        await PrivateListAPI.add_to_list(conn,uuid,user);
        res.status(200).json({"success":true})
        await conn.commit();

    }catch(e:any){
        await conn.rollback()

        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }
    conn.release();
}
export async function remove_favorite(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}

    let conn=await pool.getConnection();
    await conn.beginTransaction();

    let uuid=req.body.uuid;
    let user=res.locals.username;
    try{
        await PrivateListAPI.remove_from_list(conn,uuid,user);
        res.status(200).json({"success":true})
        await conn.commit();

    }catch(e:any){
        await conn.rollback()

        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }
    conn.release();
}
