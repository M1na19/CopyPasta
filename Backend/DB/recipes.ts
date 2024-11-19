
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
    uuid:number
    name:string
    author:string
    images:string[]|null
    rating:number|null
    type:string
    cookTime:number|null
    difficulty:number|null
    description:string|null
    time:Date
    constructor(gid:number,nm:string,ath:string,imgs:string[]|null,rtg:number|null,typ:string,cT:number|null,diff:number|null,desc:string|null,tm:Date){
        this.uuid=gid;
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
    static async create_recipe(conn:mysql.Connection,name:string,author:string,images:string[]|null,type:string,cookingTime:number|null,difficulty:number|null,description:string|null):Promise<void>{
        await conn.beginTransaction();
        try{
            let uuid=crypto.randomUUID()
            let stringified:string|null=null;
            if(images!=null)stringified=images.join(';')
            let [data]=await conn.execute<ResultSetHeader>("INSERT INTO recipes(name,authorID,uuid,images,typeID,cookingTime,difficulty,description,uploadTime) SELECT ?,u.id,?,?,t.id,?,?,?,? FROM users u INNER JOIN types t ON t.name=? WHERE u.username=?",[name,uuid,stringified,cookingTime,difficulty,description,new Date(),type,author])
            if(data.affectedRows==0){
                await conn.rollback();
                return Promise.reject({message:"User or Type does not exist",status:400})
            }
            await conn.commit();
        }
        catch(e){
            console.log(e);
            await conn.rollback();
            throw {message:"Could not complete create",status:500}
        }
    }
    static async remove_recipe(conn:mysql.Connection,uuid:UUID):Promise<void>{
        await conn.beginTransaction();
        try{
            await conn.execute("DELETE rev FROM reviews rev INNER JOIN recipes rec ON rev.recipeID=rec.id WHERE rec.uuid=?",[uuid])
            let [data]=await conn.execute<ResultSetHeader>("DELETE FROM recipes WHERE uuid=?",[uuid])

            if(data.affectedRows==0){
                await conn.rollback();
                return Promise.reject({message:"Recipe does not exist",status:400})
            }

            await conn.commit();
        }
        catch(e){
            console.log(e);
            await conn.rollback();
            throw {message:"Could not remove recipe",status:500}
        }
    }

    static async rate_recipe(conn:mysql.Connection,uuid:UUID,rater:string,rating:number,comment:string|null):Promise<void>{
        await conn.beginTransaction();
        try{
            let [data]=await conn.execute<ResultSetHeader>("INSERT INTO reviews(recipeID,userID,rating,comment,uploadTime) SELECT r.id,u.id,?,?,? FROM recipes r INNER JOIN users u WHERE u.username=? AND r.uuid=?",[rating,comment,new Date(),rater,uuid])
            if(data.affectedRows==0){
                await conn.rollback();
                return Promise.reject({message:"Recipe or User does not exist",status:400})
            }
            await conn.commit();
        }
        catch(e){
            await conn.rollback();
            throw {message:"Could not rate recipe",status:500}
        }
    }
    static async get_all_reviews(conn:mysql.Connection,uuid:UUID):Promise<Review[]>{
        interface review extends RowDataPacket, InstanceType<typeof Review>{}

        try{
            let [res]=await conn.query<review[]>("SELECT u.username as author,rev.rating,rev.comment,rev.uploadTime FROM reviews as rev INNER JOIN users as u ON rev.userID=u.id INNER JOIN recipes rec ON rev.recipeID=rec.id WHERE rec.uuid=?",[uuid]);
            return res;
        }
        catch(e){
            throw {message:"Could not fetch reviews",status:500}
        }
    }
    static async get_recipe_data(conn:mysql.Connection,uuid:UUID):Promise<Recipe>{
        interface recipe extends RowDataPacket, InstanceType<typeof Recipe>{}
        
        try{
            let [res]=await conn.query<recipe[]>("SELECT r.uuid,r.name,r.images,AVG(rev.rating) as rating ,u.username as author,t.name as type,r.cookingTime as cookTime,r.difficulty,r.description,r.uploadTime as time FROM recipes r INNER JOIN users u ON r.authorID=u.id INNER JOIN types t ON t.id=r.typeID LEFT JOIN reviews rev ON rev.recipeID=r.id WHERE r.uuid=? GROUP BY r.id, r.name, r.images, u.username, t.name, r.cookingTime, r.difficulty, r.description, r.uploadTime ",[uuid]);
            if(res.length==0){
                return Promise.reject({message:"Recipe does not exist",status:400})
            }
            return res[0];
        }
        catch(e){
            console.log(e);
            throw {message:"Could not fetch recipe",status:500}
        }

    }
    static async get_all_recipes(conn:mysql.Connection):Promise<Recipe[]>{
        interface recipe extends RowDataPacket, InstanceType<typeof Recipe>{}
        try{
            let [res]=await conn.query<recipe[]>("SELECT r.uuid,r.name,r.images,AVG(rev.rating) as rating ,u.username as author,t.name as type,r.cookingTime as cookTime,r.difficulty,r.description,r.uploadTime as time FROM recipes r INNER JOIN users u ON r.authorID=u.id INNER JOIN types t ON t.id=r.typeID LEFT JOIN reviews rev ON rev.recipeID=r.id GROUP BY r.id, r.name, r.images, u.username, t.name, r.cookingTime, r.difficulty, r.description, r.uploadTime");
            return res;
        }
        catch(e){
            throw {message:"Could not fetch recipes",status:500}
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
            throw {message:"Could not add type",status:500}
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
            throw {message:"Could not get types",status:500}
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
            throw {message:"Could not add recipe to list",status:500}
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
            throw {message:"Could not add recipe to list",status:500}
        }
    }
    static async get_list(conn:mysql.Connection,user:string):Promise<Recipe[]>{
        interface recipe extends RowDataPacket, InstanceType<typeof Recipe>{}
        try{
            let [res]=await conn.query<recipe[]>("SELECT r.uuid,r.name,r.images,AVG(rev.rating) as rating ,u.username as author,t.name as type,r.cookingTime as cookTime,r.difficulty,r.description,r.uploadTime as time FROM recipes r INNER JOIN users u ON r.authorID=u.id INNER JOIN types t ON t.id=r.typeID LEFT JOIN reviews rev ON rev.recipeID=r.id WHERE u.username=? GROUP BY r.id, r.name, r.images, u.username, t.name, r.cookingTime, r.difficulty, r.description, r.uploadTime ",[user]);
            return res;
        }
        catch(e){
            throw {message:"Could not get list",status:500}
        }
    }
}