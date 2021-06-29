const {Router} = require('express')
const router = Router()

router.get('', (req, res, next) => {
    //res.sendFile(path.join(__dirname, 'views', 'hello.html'))
    res.render('hello', {
      title: 'Головна сторінка', ishome: true
    })
  })

module.exports = router