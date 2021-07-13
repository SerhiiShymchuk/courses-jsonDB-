const multer = require('multer')
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images')
    },
    filename(req, file, cb) {
        cb(null, new Date().toISOString().replace(':', '-') + file.originalname)
    },
})
const exts = ['image/png', 'image/jpg', 'image/jpeg']
const filefilter = (req, file, cb) => {
    if (exts.includes(file.mimetype)) cb(null, true)
    else cb(null, false)
}
module.exports = multer({
    storage,
    filefilter,
})