const express = require('express')
const app = express()
const dotenv = require('dotenv/config')
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
const cors = require('cors')
const { adminAuth, userAuth, appAuth } = require('./routes/verfiy')

//connect server and  DB
app.listen(process.env.PORT, () => {
    console.log(`Server Running on port : ${process.env.PORT}`);
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log('DB Connected (MLAB)')
    })
})
app.use('/excdn', express.static('uploads'));
//body parser
app.use(express.json())

//enable cors
app.use(cors())


// Entry for Pakistani's only
app.use(appAuth)

process.on('warning', e => console.warn(e.stack));

//Import Routes 
const UserRoutes = require('./routes/users')
const adminRoutes = require('./routes/admin')
const postRoutes = require('./routes/posts')
const publicRoutes = require('./routes/public')

//Use Middleware
app.use('/user', UserRoutes)
app.use('/post',postRoutes)
app.use('/admin', adminRoutes)
app.use('/public', publicRoutes)





