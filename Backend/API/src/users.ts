import { Request, Response } from "express";
import { PrivateListAPI, RecipeAPI } from "../../DB/recipes";
import { pool } from "../../DB/db";
import { UUID } from "crypto";
import { validationResult } from "express-validator";
import { get_exp_days, TokenAPI, TokenPurpose, UserAPI } from "../../DB/user";

export async function request_sign_up(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}
    let conn=await pool.getConnection();
    await conn.beginTransaction();

    let username=req.body.username;
    let name=req.body.name || null;
    let password=req.body.password;
    let image=req.body.image || null;
    let email=req.body.email || null;
    let telephone=req.body.telephone || null
    let description=req.body.description || null;
    try{
        await UserAPI.sign_up(conn,username,name,image,password,email,description,telephone);
        let token=await TokenAPI.issue_auth_token(conn,username,TokenPurpose.VerifySignUp);
        console.log(token)
        //MAIL SERVICE
        await conn.commit();

        res.status(200).json({
            "success":true,
        })
    }catch(e:any){
        await conn.rollback();
        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }

    conn.release();
}
export async function request_activation(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}
    let conn=await pool.getConnection();
    await conn.beginTransaction();

    let token=req.params.token;
    try{
        let user=await TokenAPI.verify_auth_token(conn,token,TokenPurpose.VerifySignUp);
        await TokenAPI.delete_auth_token(conn,user,TokenPurpose.VerifySignUp);
        await UserAPI.activate_account(conn,user);
        await conn.commit();

        res.status(200).json({
            "success":true,
        })
    }catch(e:any){
        await conn.rollback();

        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }

    conn.release();
}
export async function log_in(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}
    let conn=await pool.getConnection();
    await conn.beginTransaction();
    let username=req.body.username;
    let password=req.body.password;
    try{
        let success=await UserAPI.log_in(conn,username,password);
        if(success==true){
            let access_token=await TokenAPI.issue_access_token(username);
            let refresh_token=await TokenAPI.issue_auth_token(conn,username,TokenPurpose.RefreshToken);
            await TokenAPI.delete_auth_token(conn,username,TokenPurpose.RefreshToken);
            res.cookie('AccessToken',access_token,{
                signed:true,
                httpOnly:true,
                maxAge:TokenAPI.access_expiration*60*60*1000,
            })
            .cookie('RefreshToken',refresh_token,{
                signed:true,
                httpOnly:true,
                maxAge:get_exp_days(TokenPurpose.RefreshToken)*24*60*60*1000,
            })
        }
        await conn.commit();
        res.status(200).json({
            "success":success,
        })
    }catch(e:any){
        await conn.rollback();

        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }

    conn.release();
}
export async function remove_account(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}
    let conn=await pool.getConnection();
    await conn.beginTransaction();

    let user=res.locals.username;
    try{
        await UserAPI.delete_account(conn,user);
        await conn.commit();

        res.status(200).json({
            "success":true,
        })
    }catch(e:any){
        await conn.rollback();

        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }

    conn.release();
}
export async function request_password_change(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}
    let conn=await pool.getConnection();
    await conn.beginTransaction();

    let user=res.locals.username;
    try{
        await TokenAPI.issue_auth_token(conn,user,TokenPurpose.ChangePassword);
        
        //MAIL SERVICE

        await conn.commit();

        res.status(200).json({
            "success":true,
        })
    }catch(e:any){
        await conn.rollback();

        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }

    conn.release();
}
export async function change_password(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}
    let conn=await pool.getConnection();
    await conn.beginTransaction();

    let token=req.params.token;
    let password=req.body.password;
    try{
        let username=await TokenAPI.verify_auth_token(conn,token,TokenPurpose.ChangePassword);
        await UserAPI.change_password(conn,username,password);
        await TokenAPI.delete_auth_token(conn,username,TokenPurpose.ChangePassword)
        await conn.commit();

        res.status(200).json({
            "success":true,
        })
    }catch(e:any){
        await conn.rollback();

        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }

    conn.release();
}
export async function get_user_data(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}
    let conn=await pool.getConnection();

    let username=req.query.username as string;
    try{
        let user=await UserAPI.get_data(conn,username);
        res.status(200).json({
            "success":true,
            "user":user
        })
    }catch(e:any){

        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }

    conn.release();
}
export async function refresh(req:Request,res:Response){
    if(!validationResult(req).isEmpty()){res.status(400).json({success:false});return;}
    let conn=await pool.getConnection();
    await conn.beginTransaction();

    try{
        if(!req.signedCookies['RefreshToken'])throw "No token available for refresh";
        let username=await TokenAPI.verify_auth_token(conn,req.signedCookies['RefreshToken'],TokenPurpose.RefreshToken)!;
        await TokenAPI.delete_auth_token(conn,username,TokenPurpose.RefreshToken);

        let access_token=await TokenAPI.issue_access_token(username);
        let refresh_token=await TokenAPI.issue_auth_token(conn,username,TokenPurpose.RefreshToken);
        res.cookie('AccessToken',access_token,{
            signed:true,
            httpOnly:true,
            maxAge:TokenAPI.access_expiration*60*60*1000,
        })
        .cookie('RefreshToken',refresh_token,{
            signed:true,
            httpOnly:true,
            maxAge:get_exp_days(TokenPurpose.RefreshToken)*24*60*60*1000,
        })
        
        await conn.commit();
        res.status(200).json({
            "success":true,
        })
    }catch(e:any){
        await conn.rollback();

        res.status(e.status).json({
            "success":false,
            "error":e.message
        })
    }

    conn.release();
}