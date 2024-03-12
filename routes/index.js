const express=require('express');
const routes=express.Router();
const userRoute=require('./user')
const accountRoute=require('./account')
routes.use('/user',userRoute)
routes.use('/account',accountRoute)
module.exports = routes