const express = require('express')
const path = require('path')
const app = express()
const exphbs = require('express-handlebars')
const homeRoute = require('./routes/homeRoute')
const addRoute = require('./routes/addRoute')
const cardRoute = require('./routes/card')
const coursesRoute = require('./routes/coursesRoute')

const PORT = process.env.PORT || 3009
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoute)
app.use('/add', addRoute)
app.use('/courses', coursesRoute)
app.use('/card', cardRoute)
// app.get('/about/contacts.js', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'contacts.js'))
// })
app.listen(PORT, () => { console.log(`server starts on port : ${PORT}`) })
