const e = require('express')
const express= require('express')
const authMiddleWare = require('../middleware')
const { Account } = require('../db')
const { default: mongoose } = require('mongoose')

const route=express.Router()
route.get('/balance',authMiddleWare,async (req,res)=>{
    const userId = req.userId;
    const account=await Account.findOne({
        userId:userId
    })
    console.log("Account " ,account)
    res.json({
        balance:account.balance
    })
})
route.post('/transfer',authMiddleWare,async (req,res)=>{
    const session= await mongoose.startSession();
    session.startTransaction();
    const {amount ,to}=req.body;
    const userId = req.userId;
    const account=await Account.findOne({
        userId:userId
    }).session(session)


    if(!account||account.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Insuffiecient Balance"
        })
    }
    const toAccount= await Account.findOne({
        userId:to
    }).session(session)
    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Invalid account"
        })
    }


    await Account.updateOne({userId:userId},{$inc:{balance:-amount}}).session(session);
    await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session)
    await session.commitTransaction();
    res.status(200).json({
        message:"Transaction Successful"
    })
})

module.exports=route