const keys = require('./keys/config')
const express = require('express')
const path = require('path')
const app = express()
const exphbs = require('express-handlebars')
const homeRoute = require('./routes/homeRoute')
const addRoute = require('./routes/addRoute')
const cardRoute = require('./routes/card')
const coursesRoute = require('./routes/coursesRoute')
const orderRoute = require('./routes/order')
const authRoute = require('./routes/auth')
const mongoose = require('mongoose')
const csrf = require('csurf')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const varMiddleware = require('./middleware/middlewares')
//const User = require('./models/user')
const userMiddleware = require('./middleware/user')
const errorPage = require('./middleware/errorPage')



const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/helper-hbs')
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById('60e34d7df7ea1207b0ae0c85')
//     req.user = user
//     next()
//   } catch (error) {
//     throw error
//   }
// })
const store = new MongoStore({
  uri: keys.url,
  collection: 'sessions',
})
app.use(session({
  secret: keys.secret,
  resave: false,
  saveUninitialized: false,
  store,
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)
app.use('/', homeRoute)
app.use('/add', addRoute)
app.use('/courses', coursesRoute)
app.use('/card', cardRoute)
app.use('/order', orderRoute)
app.use('/auth', authRoute)
app.use(errorPage)
// app.get('/about/contacts.js', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'views', 'contacts.js'))
  // })

  
start()
async function start() {
  try {
    await mongoose.connect(keys.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })

    app.listen(keys.PORT, () => { console.log(`server starts on port : ${keys.PORT}`) })
  } catch (error) {
    throw error
  }
}