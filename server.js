const express = require('express');
const app = express();
const dotenv = require('dotenv/config');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const cors = require('cors');
const O3Auth= require('./routes/verfiy');


//connect server and  DB
app.listen(process.env.PORT,()=>{
    console.log(`Server Running on port : ${process.env.PORT}`);
    mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true, useUnifiedTopology:true  }, ()=>{
    console.log('DB Connected (MLAB)');
    });
});





//body parser
app.use(express.json());

//enable cors
app.use(cors());

//Import Routes 
const UserRoutes= require('./routes/users');
const adminRoutes= require('./routes/admin');

//Use Middleware
app.use('/user',UserRoutes);
app.use('/admin',O3Auth,adminRoutes);




