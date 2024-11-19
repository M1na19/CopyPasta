
import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise'

import { UUID } from "crypto";
export class Review{
    author:string
    rating:number
    comment:string|null
    time:Date
    constructor(ath:string,rtg:number,comment:string|null,time:Date){
        this.author=ath;
        this.rating=rtg;
        this.comment=comment;
        this.time=time;
    }
}
export class Recipe{
    guid:number
    name:string
    author:string
    images:string[]|null
    rating:number|null
    type:string|null
    cookTime:number|null
    difficulty:number|null
    description:string|null
    time:Date
    constructor(gid:number,nm:string,ath:string,imgs:string[]|null,rtg:number|null,typ:string|null,cT:number|null,diff:number|null,desc:string|null,tm:Date){
        this.guid=gid;
        this.name=nm;
        this.author=ath;
        this.images=imgs;
        this.rating=rtg;
        this.type=typ;
        this.cookTime=cT;
        this.description=desc;
        this.difficulty=diff;
        this.time=tm;
    }
}
export class RecipeAPI{
    static async create_recipe(conn:mysql.Connection,name:string,author:string,images:string[]|null,type:string|null,cookingTime:number|null,difficulty:number|null,description:string|null):Promise<void>{
        await conn.beginTransaction();
        try{
            let uuid=crypto.randomUUID()
            let [data]=await conn.execute<ResultSetHeader>("INSERT INTO recipes(name,authorID,uuid,images,typeID,cookingTime,difficulty,description,uploadTime) SELECT ?,u.id,?,?,t.id,?,?,?,?,? FROM users u INNER JOIN types t WHERE u.username=?)",[name,uuid,images?.join(';'),type,cookingTime,difficulty,description,new Date(),author])
            if(data.affectedRows==0){
                await conn.rollback();
                throw "User or Type does not exist"
            }
            await conn.commit();
        }
        catch(e){
            await conn.rollback();
            throw "Could not complete create"
        }
    }
    static async remove_recipe(conn:mysql.Connection,uuid:UUID):Promise<void>{
        await conn.beginTransaction();
        try{
            await conn.execute("DELETE rev FROM reviews rev INNER JOIN recipes rec ON rev.recipeID=rec.id WHERE rec.uuid=?",[uuid])
            let [data]=await conn.execute<ResultSetHeader>("DELETE FROM recipes WHERE uuid=?",[uuid])

            if(data.affectedRows==0){
                await conn.rollback();
                throw "Recipe does not exist"
            }

            await conn.commit();
        }
        catch(e){
            await conn.rollback();
            throw "Could not remove recipe"
        }
    }

    static async rate_recipe(conn:mysql.Connection,uuid:UUID,rater:string,rating:number,comment:string|null):Promise<void>{
        await conn.beginTransaction();
        try{
            let [data]=await conn.execute<ResultSetHeader>("INSERT INTO reviews(recipeID,userID,rating,comment,uploadTime) SELECT r.id,u.id,?,?,? FROM recipes r INNER JOIN users u WHERE u.username=? AND r.uuid=?",[rating,comment,new Date(),rater,uuid])
            if(data.affectedRows==0){
                await conn.rollback();
                throw "Recipe or User does not exist"
            }
            await conn.commit();
        }
        catch(e){
            await conn.rollback();
            throw "Could not rate recipe"
        }
    }
    static async get_all_reviews(conn:mysql.Connection,uuid:UUID):Promise<Review[]>{
        interface review extends RowDataPacket, InstanceType<typeof Review>{}

        try{
            let [res]=await conn.query<review[]>("SELECT u.username as author,rev.rating,rev.comment,rev.uploadTime FROM reviews as rev INNER JOIN users as u ON rev.userID=u.id INNER JOIN recipes rec ON rev.recipeID=rec.id WHERE rec.uuid=?",[uuid]);
            return res;
        }
        catch(e){
            throw "Could not fetch reviews"
        }
    }
    static async get_recipe_data(conn:mysql.Connection,uuid:UUID):Promise<Recipe>{
        interface recipe extends RowDataPacket, InstanceType<typeof Recipe>{}
        
        try{
            let [res]=await conn.query<recipe[]>("SELECT r.name,r.images,AVG(rev.rating) as rating ,u.username as author,t.name as type,r.cookingTime,r.difficulty,r.description,r.uploadTime FROM recipes r INNER JOIN users u ON r.authorID=u.id INNER JOIN types t ON t.id=r.typeID INNER JOIN reviews rev ON rev.recipeID=r.id WHERE r.uuid=?",[uuid]);
            if(res.length==0){
                throw "Recipe does not exist"
            }
            return res[0];
        }
        catch(e){
            throw "Could not fetch recipe"
        }

    }
    static async get_all_recipes(conn:mysql.Connection):Promise<Recipe[]>{
        interface recipe extends RowDataPacket, InstanceType<typeof Recipe>{}
        try{
            let [res]=await conn.query<recipe[]>("SELECT r.name,r.images,AVG(rev.rating) as rating ,u.username as author,t.name as type,r.cookingTime,r.difficulty,r.description,r.uploadTime FROM recipes r INNER JOIN users u ON r.authorID=u.id INNER JOIN types t ON t.id=r.typeID INNER JOIN reviews rev ON rev.recipeID=r.id");
            return res;
        }
        catch(e){
            throw "Could not fetch recipes"
        }

    }
    static async add_type(conn:mysql.Connection,type:string):Promise<void>{
        await conn.beginTransaction();
        
        try{
            await conn.execute("INSERT INTO types(name) VALUES(?)",[type])
            await conn.commit();
        }
        catch(e){
            await conn.rollback();
            throw "Could not add type"
        }
    }
    static async get_types(conn:mysql.Connection):Promise<string[]>{
        interface type extends RowDataPacket{name:string}
        try{
            let [res]=await conn.query<type[]>("SELECT name FROM types",[]);
            
            let types:string[]=[];
            res.forEach((tp)=>{types.push(tp.name)});

            return types;
        }
        catch(e){
            throw "Could not get types"
        }
    }
}
export class PrivateListAPI{
    static async add_to_list(conn:mysql.Connection,uuid:UUID,user:string):Promise<void>{
        await conn.beginTransaction();
        try{
            await conn.execute("INSERT INTO privateList(recipeID,userID) SELECT r.id,u.id FROM recipes r INNER JOIN user u WHERE r.uuid=? AND u.username=?",[uuid,user])
            await conn.commit();
        }
        catch(e){
            await conn.rollback();
            throw "Could not add recipe to list"
        }
    }
    static async remove_from_list(conn:mysql.Connection,uuid:UUID,user:string):Promise<void>{
        await conn.beginTransaction();
        try{
            await conn.execute("DELETE FROM privateList pl INNER JOIN user u ON pl.userID=u.id INNER JOIN recipes r ON r.id=pl.recipeID WHERE r.uuid=? AND u.username=?",[uuid,user]);
            await conn.commit();
        }
        catch(e){
            await conn.rollback();
            throw "Could not add recipe to list"
        }
    }
    static async get_list(conn:mysql.Connection,user:string):Promise<Recipe[]>{
        interface recipe extends RowDataPacket, InstanceType<typeof Recipe>{}
        try{
            let [res]=await conn.query<recipe[]>("SELECT r.name,r.images,AVG(rev.rating) as rating ,u.username as author,t.name as type,r.cookingTime,r.difficulty,r.description,r.uploadTime FROM recipes r INNER JOIN users u ON r.authorID=u.id INNER JOIN types t ON t.id=r.typeID INNER JOIN reviews rev ON rev.recipeID=r.id WHERE u.username=?",[user]);
            return res;
        }
        catch(e){
            throw "Could not get list"
        }
    }
}