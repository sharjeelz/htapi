const express = require('express')
const app = express()
const dotenv = require('dotenv/config')
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
const cors = require('cors')
const {adminAuth,userAuth} = require('./routes/verfiy')
const getLocation = require('./functions/geoip')



//connect server and  DB
app.listen(process.env.PORT, () => {
    console.log(`Server Running on port : ${process.env.PORT}`);
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log('DB Connected (MLAB)')
    })
})

//body parser
app.use(express.json())

//enable cors
app.use(cors())

// Entry for Pakistani's and Kashmiri's only
app.get('/',(req,res,next)=>{
    
    let my_location = process.env.ENV=='development' ? getLocation('202.166.163.180') : getLocation(req.ip)
    if(my_location && my_location.country=='PK') {
        res.send('Server Running for HT  API only')
        next()
    }
    else
    {
        return res.send('Only For Pakistan and Kashmiris')
    }
})



//Import Routes 
const UserRoutes = require('./routes/users')
const adminRoutes = require('./routes/admin')
const postRoutes = require('./routes/posts')
const publicRoutes = require('./routes/public')

//Use Middleware
app.use('/user',UserRoutes)
app.use('/post',userAuth,postRoutes)
app.use('/admin',adminRoutes)
app.use('/public',publicRoutes)





