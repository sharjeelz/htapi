const express = require('express');
const app = express();
const dotenv = require('dotenv/config');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

//body parser
app.use(express.json());

//Import Routes 
const UserRoutes= require('./routes/users');

//Use Middleware
app.use('/user',UserRoutes);





//connect to DB

mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true, useUnifiedTopology:true  }, ()=>{
   
    console.log('DB Connected (MLAB)');
});


app.listen(process.env.PORT,()=>{
    console.log(`Server Running on port : ${process.env.PORT}`)
});