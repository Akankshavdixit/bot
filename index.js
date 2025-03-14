require("dotenv").config();
 const express = require("express");
 const pool = require('./config/db')
 const resourceRoutes = require("./routes/resourceRoutes");
 
 const app = express();
 app.use(express.json());
 
 const testconnection = async ()=>{  
     try{
         const test = await pool.connect();
         console.log('database connected successfully');
         test.release();
     }catch(err)
     {
         console.log('error connecting the database', err);
     }
 
 }
 
 app.use("/api", resourceRoutes);
 
 
 app.listen(process.env.PORT, ()=> {
     console.log('App is listening on port ', process.env.PORT);
     
     testconnection();
 })