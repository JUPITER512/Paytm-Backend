const mongoose = require("mongoose");
const { number } = require("zod");
mongoose.connect("mongodb+srv://alimurtaza:alimurtaza123@cluster0.bn8dnvi.mongodb.net/Paytm")
const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true,
        maxlength:50

    },
    lastname:{
        type:String,
        required:true,
        trim:true,
        maxlength:50

    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8

    },
    username:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        minlength:3,
        maxlength:50
    }

})



const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId ,// reference id to User Model,
        ref:"users",
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})
// userSchema.methods.createHash=async function(plainPassword){
//     const saltRound=10;
//     const salt=await bycrypt.genSalt(saltRound)
//     return await bycrypt.hash(plainPassword, salt)
// }

// userSchema.methods.validatePassword=async function(plainpassword){
//     return await bycrypt.compare(plainpassword,this.password_hash)
// }

 const Account=mongoose.model('Account',accountSchema)
 const User=mongoose.model("users",userSchema)
 module.exports = {User,Account}