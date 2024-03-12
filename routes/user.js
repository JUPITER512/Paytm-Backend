const express = require('express')
const zod=require('zod');
const {User,Account}=require('../db.js')
const jwt=require('jsonwebtoken')
const jwtsecret=require('../config.js');
const authMiddleWare = require('../middleware.js');
const routes= express.Router()

const signupValidation=zod.object({
    userName:zod.string().email().max(50),
    firstName:zod.string().max(50),
    lastName:zod.string().max(50),
    password:zod.string().min(8)
})

routes.get('/bulk',authMiddleWare,async (req,res)=>{
    
    const filtervalue=req.query.filter || ""
    const users = await User.find({
        $or: [{
            firstname: {
                "$regex": filtervalue
            }
        }, {
            lastname: {
                "$regex": filtervalue
            }
        }]
    })
    res.json({
        user:users.map((user)=>({
            username:user.username,
            firstname:user.firstname,
            lastname:user.lastname,
            _id:user.id

        }))
    })
})

routes.post('/signup',async (req,res)=>{
    const success=signupValidation.safeParse(req.body)
    if (!success){
        return res.status(411).json({
            message:"Invalid Input"
        })
    }
    const existingUser=await User.findOne({
        username:req.body.username
    })
    if(existingUser){
        return res.status(411).json({
            message:"User already exists"
        })
    }
    const user= await User.create({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        password:req.body.password,
        username:req.body.username
    
    })
    const userId=user._id
    await Account.create({
        userId,
        balance:1+Math.random()*1000
    })
    const token= jwt.sign({
        userId
    },jwtsecret)
    res.status(200).json({
        userId:"userId of newly added user",
        token:token
    })
})

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

const updateInformation=zod.object(
{
    firstname:zod.string().optional(),
    lastName:zod.string().optional(),
    password: zod.string().optional()

}    
)
routes.put('/',authMiddleWare,async (req,res)=>{
    const success=updateInformation.safeParse(req.body)
    if(!success){
        return res.status(403).json({
            message:"Error while updating the information"
        })
    }
    await User.updateOne({_id:req.userId},req.body)
    res.json({
        message: "Updated successfully"
    })
    
})

routes.post('/signin',async(req,res)=>{
    try{
        const success=signinBody.safeParse(req.body)

        if(!success){
            return res.status(401).json({
                message:"Invalid login Details"
            })
        }
        const user=await User.findOne({
            username:req.body.username,
            password:req.body.password
        })
        if(user){
            const token=jwt.sign({
                userId:user._id,
            },jwtsecret)
            res.status(200).json({
                message:`user exist`,
                token:token
            })
            return
        }
        res.status(411).json({
            message: "Error while logging in"
        })
    }
    catch(err){
        console.log(err.toString())
        return res.status(500).json({
            message:"Server error"
        })
    }
})
module.exports = routes