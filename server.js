const express = require('express');
const app = express();
const dotenv = require('dotenv/config');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.set('useCreateIndex', true);
const O3Auth= require('./routes/verfiy');
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





//connect to DB

mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true, useUnifiedTopology:true  }, ()=>{
   
    console.log('DB Connected (MLAB)');
});


app.listen(process.env.PORT,()=>{
    console.log(`Server Running on port : ${process.env.PORT}`)
});