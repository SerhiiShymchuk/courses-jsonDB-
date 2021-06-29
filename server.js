const http = require('http')
const fs = require('fs/promises')
const path = require('path')

const port = 3000
const server = http.createServer((req, res) => {
    const { url, method } = req
    const route = routes[method + url]
    if (route) route(res)
    else routes.default(res, url)

})
server.listen(port, () => console.log('server started'))
const routes = {
    'GET/': async (res) => {
        const html = await fs.readFile(path.join(__dirname, 'views', 'hello.html'))
        res.end(html)
    },
    async default(res, url) {
        try {
            if (!/\.\w+$/.test(url)) {
                url += '.html'
            }
            const file = await fs.readFile(path.join(__dirname, 'views', url))
            if (url.endsWith('.js')) {
                res.setHeader('content-type', 'application/javascript')
            }
            res.end(file)
        } catch (error) {
            res.end('file not found')
        }
    }
}