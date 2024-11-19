import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise"
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
    username:string
    name:string|null
    image:string|null
    email:string|null
    telephone:string|null
    description:string|null
    time:Date
    constructor(un:string,nm:string|null,img:string|null,email:string|null,tlph:string|null,desc:string|null,t:Date){
        this.username=un;
        this.name=nm;
        this.image=img;
        this.email=email;
        this.telephone=tlph;
        this.description=desc;
        this.time=t;
    }
}
export class UserAPI{
    static async sign_up(conn:mysql.Connection,username:string, name:string|null, image:string|null, password:string, email:string|null, description:string|null, tel:string|null):Promise<void>{
        await conn.beginTransaction();
        try{
            let salt=await bcrypt.genSalt(10);
            let hashed=await bcrypt.hash(password,salt);
        
            await conn.execute("INSERT INTO users(username,name,image,password,email,description,telephone,uploadTime) VALUES(?,?,?,?,?,?,?,?)",[username,name,image,hashed,email,description,tel,new Date()]);
            await conn.commit();
        }catch(e){
            await conn.rollback();
            throw "Could not complete create"
        }
    }
    static async log_in(conn:mysql.Connection,username:string, password:string):Promise<boolean>{
        interface hashed extends RowDataPacket{password:string}
        try{
            let [res]=await conn.query<hashed[]>("SELECT password FROM users WHERE username=?",[username])
            if(res.length==0){
                return Promise.reject("No user with this name")
            }

            let hash=res[0].password;
            let success=await bcrypt.compare(password,hash);
            return success;
            
        }catch(e){
            throw "Could not log in";
        }
    }
    static async change_password(conn:mysql.Connection,user:string,new_password:string):Promise<void>{
        await conn.beginTransaction();
        try{
            let salt=await bcrypt.genSalt(10);
            let hashed=await bcrypt.hash(new_password,salt);

            let [data]=await conn.execute<ResultSetHeader>("UPDATE users SET password=? WHERE username=?",[hashed,user]);
            if(data.affectedRows==0){
                await conn.rollback();
                return Promise.reject("Could not find user")
            }

            await conn.commit();
        }catch(e){
            await conn.rollback();
            throw "Could not change password";
        }
    }
    static async get_data(conn:mysql.Connection,username:string):Promise<User>{
        type UserInterface = InstanceType<typeof User>;
        interface user extends RowDataPacket,UserInterface{}

        try{
            let [res]=await conn.query<user[]>("SELECT username,name,image,email,telephone,description,uploadTime as time FROM users WHERE username=?",[username])
            if(res.length==0){
                return Promise.reject("Could not find user")
            }
            return res[0] as User;
        }catch(e){
            throw "Could not get user data";
        }
    }
}
export class TokenAPI{
    static access_expiration:number=2;
    static secret:string=process.env.SECRET as string

    //Returns username if successfull
    static async issue_access_token(at:string):Promise<string | null>{
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
    static async verify_access_token(at:string):Promise<string | null>{
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

    static async issue_auth_token(conn:mysql.Connection,username:string,purpose:TokenPurpose):Promise<string>{
        await conn.beginTransaction();
        try{
            let rnd=await bcrypt.genSalt(10);
            let exp=new Date();
            exp.setDate(exp.getDate()+get_exp_days(purpose));

            let [data]=await conn.execute<ResultSetHeader>("INSERT INTO authTokens(value,expiration,userID,purpose) SELECT ?,?,u.id,? FROM users u WHERE u.username=?",[rnd,exp,purpose,username]);
            if(data.affectedRows==0){
                await conn.rollback();
                return Promise.reject("Could not find user")
            }
            await conn.commit();

            return rnd;
        }catch(e){
            await conn.rollback();
            throw "Could not issue token";
        }
    }
    static async verify_auth_token(conn:mysql.Connection,at:string,purpose:TokenPurpose):Promise<string>{
        interface token extends RowDataPacket{expiration:Date,username:string,purpose:TokenPurpose};
        try{
            let [res]=await conn.query<token[]>("SELECT value,expiration,u.username,purpose FROM authTokens at INNER JOIN users u ON u.id=at.userID WHERE value=? AND purpose=?",[at,purpose])
            if(res.length==0 || res[0].expiration<new Date()){
                return Promise.reject("Invalid token")
            }else{
                return res[0].username;
            }
            
        }catch(e){
            throw "Could not verify token";
        }
    }
   
}