const express = require("express");
const cors=require('cors')
const appRouter=require('./routes/index')
const app= express();
const port=3000
app.use(cors())
app.use(express.json())
app.use("/api/v1",appRouter)
app.listen(port,()=>{
    console.log("Backend is up on port "+ port)
})

module.exports = app