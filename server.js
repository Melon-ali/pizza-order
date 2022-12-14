const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')

const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000


const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongodb-session')(session)

// mongodb connection

mongoose.connect(process.env.DATABASE_LOCAL).then(()=> {
  console.log('Database Connected');
});

// session store
const store = new MongoDbStore({
              uri: process.env.DATABASE_LOCAL,
              collection: 'mySessions'
            })
// Session config
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitiaLized: false,
  store: store,
  cookie: {maxAge: 1000 * 60 * 60 * 24} // 24 hours
}))

app.use(flash())

// Assets
app.use(express.static('public'))
app.use(express.json())

// Global middleware
app.use((req, res, next)=> {
  res.locals.session = req.session
  next()
})

// set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')


require('./routes/web')(app)

app.listen(PORT, () => {
    console.log('Listening on port 5000')
})