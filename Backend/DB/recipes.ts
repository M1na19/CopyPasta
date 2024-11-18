import { pool } from "./db";
import { UserAPI } from "./user";
import mysql, { RowDataPacket } from 'mysql2/promise'
export class RecipeID{
    name:String
    authorID:Number
    constructor(nm:String,athID:Number){
        this.name=nm;
        this.authorID=athID;
    }
}
export class Review{
    author!:String
    rating!:Number
    comment!:String
    time!:Date
}
export class Recipe{
    id!:RecipeID
    images!:String[]
    rating!:Number
    type!:String
    cookTime!:Number
    difficulty!:Number
    description!:String
    time!:Date
}
export class RecipeAPI{
    static async check_for_recipeID(conn:mysql.Connection,rID:RecipeID):Promise<Number|null>{
        interface id extends RowDataPacket{id:number}
        try{
            let [res]=await conn.query<id[]>("SELECT id FROM recipes WHERE name=? AND authorID",[rID.name,rID.authorID])
            if(res.length==0){
                return null;
            }else{
                return res[0].id;
            }
        }catch(e){
            throw "Could not fetch db idx";
        }
    }
    //Don t allow recipes with same name and author
    static async create_recipe(rID:RecipeID,images:String[],type:Number,cookingTime:Number,difficulty:Number,description:String):Promise<void>{
        let conn=await pool.getConnection();
        await conn.beginTransaction();
        let id=await this.check_for_recipeID(conn,rID);
        if(typeof(id)=="number"){
            return Promise.reject("A recipe with the same author and name already exists");
        }
        try{
            await conn.execute("INSERT INTO recepies(name,authorID,images,type,cookingTime,difficulty,description,uploadTime) VALUES(?,?,?,?,?,?,?,?,?)",[rID.name,rID.authorID,images.toString(),type,cookingTime,difficulty,description,new Date()])
            await conn.commit();
            conn.release();
        }
        catch(e){
            await conn.rollback();
            conn.release();
            return Promise.reject("Could not complete create")
        }
    }
    static async remove_recipe(rID:RecipeID):Promise<void>{
        let conn=await pool.getConnection();
        await conn.beginTransaction();
        let id=await this.check_for_recipeID(conn,rID);
        if(id==null){
            return Promise.reject("This recipe does not exist");
        }
        try{
            await conn.execute("DELETE FROM recipes WHERE id=?",[id])
            await conn.commit();
            conn.release();
        }
        catch(e){
            await conn.rollback();
            conn.release();
            return Promise.reject("Could not remove recipe")
        }
    }
    static async rate_recipe(rID:RecipeID,raterID:Number,rating:Number,comment:String):Promise<void>{

    }
    static async get_all_reviews(rID:RecipeID):Promise<Review[]>{
        return Promise.reject();
    }
    static async get_recipe_data(rID:RecipeID):Promise<Recipe>{
        return Promise.reject();

    }
    static async get_all_recipies():Promise<Recipe[]>{
        return Promise.reject();

    }
    static async add_type(type:String):Promise<void>{

    }
    static async get_types():Promise<String[]>{
        return Promise.reject();
    }
}
export class PrivateListAPI{
    static async add_to_list(rID:RecipeID,userID:Number):Promise<void>{

    }
    static async remove_from_list(rID:RecipeID,userID:Number):Promise<void>{

    }
    static async get_list(rID:RecipeID,userID:Number):Promise<Recipe[]>{
        return Promise.reject();

    }
}