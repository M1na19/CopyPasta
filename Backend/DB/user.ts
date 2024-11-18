import { pool } from "./db"
import mysql, { RowDataPacket } from "mysql2/promise"
import bcrypt from 'bcrypt';
export enum TokenPurpose{
    RefreshToken=0,
    VerifySignUp=1,
    ChangePassword=2,
}
function get_exp_days(tp:TokenPurpose):number{
    switch (tp){
        case TokenPurpose.RefreshToken:{
            return 28;
        }
        case TokenPurpose.VerifySignUp:{
            return 1;
        }
        case TokenPurpose.ChangePassword:{
            return 1;
        }
    }
}
export class User{
    username!:String
    name!:String
    image!:String
    email:String|undefined
    telephone:String|undefined
    description!:String
    time!:Date
}
export class UserAPI{
    static async get_user_id(conn:mysql.Connection,username:String):Promise<Number|null>{
        interface id extends RowDataPacket{id:number}
        try{
            let [res]=await conn.query<id[]>("SELECT id FROM users WHERE username=?",[username])
            if(res.length==0){
                return null;
            }else{
                return res[0].id;
            }
        }catch(e){
            throw "Could not fetch db idx";
        }
    }
    static async sign_up(username:String, name:String, image:String, password:String, email:String|undefined, description:String, tel:String|undefined):Promise<void>{
        let conn=await pool.getConnection();
        await conn.beginTransaction();
        let id=await this.get_user_id(conn,username);
        
        if(typeof(id)=="number"){
            return Promise.reject("A recipe with the same author and name already exists");
        }
        let salt=await bcrypt.genSalt(10);
        let hashed=await bcrypt.hash(password.toString(),salt);
        try{
            await conn.execute("INSERT INTO users(username,name,image,password,email,description,telephone,uploadTime) VALUES(?,?,?,?,?,?,?,?)",[username,name,image,hashed,email,description,tel,new Date()]);
            await conn.commit();
            conn.release();
        }catch(e){
            await conn.rollback();
            conn.release();
            return Promise.reject("Could not complete create")
        }
    }
    static async log_in(userID:Number, password:String):Promise<Boolean>{
        let conn=await pool.getConnection();
        await conn.beginTransaction();
        interface hashed extends RowDataPacket{password:string}
        try{
            let [res]=await conn.query<hashed[]>("SELECT password FROM users WHERE id=?",[userID])
            if(res.length==0){
                await conn.rollback();
                conn.release();
                throw "DB Error"
            }else{
                let hash=res[0].password;
                let success=await bcrypt.compare(password.toString(),hash);
                await conn.commit();
                conn.release();
                return success;
            }
            
        }catch(e){
            await conn.rollback();
            conn.release();
            throw "Could not log in";
        }
    }
    static async change_password(userID:Number,new_password:String):Promise<void>{
        let conn=await pool.getConnection();
        await conn.beginTransaction();
        try{
            let salt=await bcrypt.genSalt(10);
            let hashed=await bcrypt.hash(new_password.toString(),salt);
            await conn.execute("UPDATE users SET password=? WHERE id=?",[hashed,userID]);
            await conn.commit();
            conn.release();
        }catch(e){
            await conn.rollback();
            conn.release();
            throw "Could not log in";
        }
    }
    static async get_data(userID:Number):Promise<User>{
        let conn=await pool.getConnection();
        await conn.beginTransaction();

        type UserInterface = InstanceType<typeof User>;
        interface user extends RowDataPacket,UserInterface{}

        try{
            let [res]=await conn.query<user[]>("SELECT username,name,image,email,telephone,description,uploadTime as time FROM users WHERE id=?",[userID])
            await conn.commit();
            conn.release();
            return res[0] as User;
        }catch(e){
            await conn.rollback();
            conn.release();
            throw "Could not get user data";
        }
    }
}
export class TokenAPI{
    static access_expiration:number=2;
    static secret:string=process.env.SECRET as string
    //Returns username if successfull
    static async issue_access_token(at:String):Promise<String | null>{
        let exp=new Date();
        exp.setHours(exp.getHours()+this.access_expiration);
        let header=Buffer.from(JSON.stringify({
            alg:"bcrypt",
            typ:"JWT"
        })).toString('base64');
        let payload=Buffer.from(JSON.stringify({
            username:at,
            expiration:exp
        })).toString('base64');

        let salt=await bcrypt.genSalt(10);
        let hashed=await bcrypt.hash((header+payload+this.secret).toString(),salt);
        let secret=Buffer.from(hashed).toString('base64');
        return header+'.'+payload+'.'+secret;
    }
    //Return userID on success
    static async verify_access_token(at:String):Promise<String | null>{
        let parts=at.split('.');
        if(parts.length!=3 && !await bcrypt.compare(parts[0]+parts[1]+this.secret,Buffer.from(parts[2],'base64').toString())){
            return null;
        }
        let payload=JSON.parse(Buffer.from(parts[1],'base64').toString());
        let exp:Date=new Date(payload.expiration);
        if(exp<new Date()){
            return null;
        }
        return payload.username;
    }
    static async issue_auth_token(userID:Number,purpose:TokenPurpose):Promise<String>{
        let conn=await pool.getConnection();
        await conn.beginTransaction();
        try{
            let rnd=await bcrypt.genSalt(10);
            let exp=new Date();
            exp.setDate(exp.getDate()+get_exp_days(purpose));
            await conn.execute("INSERT INTO authTokens(value,expiration,userID,purpose) VALUES(?,?,?,?)",[rnd,exp,userID,purpose]);
            await conn.commit();
            conn.release();
            return rnd;
        }catch(e){
            await conn.rollback();
            conn.release();
            throw "Could not issue token";
        }
    }
    static async verify_auth_token(at:String,purpose:TokenPurpose):Promise<Number>{
        let conn=await pool.getConnection();
        await conn.beginTransaction();
        interface token extends RowDataPacket{expiration:Date,userID:number,purpose:TokenPurpose};
        try{
            let [res]=await conn.query<token[]>("SELECT value,expiration,userID,purpose FROM authTokens WHERE value=? AND purpose=?",[at,purpose])
            if(res.length==0 || res[0].expiration<new Date()){
                await conn.rollback();
                conn.release();
                throw "Invalid token"
            }else{
                await conn.commit();
                conn.release();
                return res[0].userID;
            }
            
        }catch(e){
            await conn.rollback();
            conn.release();
            throw "Could not verify token";
        }
    }
   
}