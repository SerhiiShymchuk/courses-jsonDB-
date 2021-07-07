const express = require('express')
const path = require('path')
const app = express()
const exphbs = require('express-handlebars')
const homeRoute = require('./routes/homeRoute')
const addRoute = require('./routes/addRoute')
const cardRoute = require('./routes/card')
const coursesRoute = require('./routes/coursesRoute')
const orderRoute = require('./routes/order')
const mongoose = require('mongoose')
const User = require('./models/user')
const PORT = process.env.PORT || 3009
const passMongo = '85hevFHBVxIqZ2tp'
const userNameMongo = 'admin'


const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('60e34d7df7ea1207b0ae0c85')
    req.user = user
    next()
  } catch (error) {
    throw error
  }
})
app.use('/', homeRoute)
app.use('/add', addRoute)
app.use('/courses', coursesRoute)
app.use('/card', cardRoute)
app.use('/order', orderRoute)
// app.get('/about/contacts.js', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'views', 'contacts.js'))
  // })

  
start()
async function start() {
  try {
    const url = `mongodb+srv://${userNameMongo}:${passMongo}@cluster0.hdehi.mongodb.net/shop`
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    const candidate = await User.findOne()
    if(!candidate) {
      const user = new User({
        email: 'serhii@mail.ru',
        name: 'serhii',
        cart: {
          items: []
        },
      })
      await user.save()
    }

    app.listen(PORT, () => { console.log(`server starts on port : ${PORT}`) })
  } catch (error) {
    throw error
  }
}