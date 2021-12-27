const scapper = require('./scrapper')
const express = require('express')
const { env } = require('process')
const cors = require('cors')

const app = express()
app.use(cors())

app.get('/api/', (req, res) => {
    res.send(`
        Latest Chapters at: /api/latest/:page (example: /api/latest/1)<br>
        All Manhwa List at: /api/all/:page (example: /api/all/1)<br>
        Manhwa Search at: /api/search/:search+query/:page (example: /api/search/a/1)<br>
        Manhwa Genre at: /api/genre/:genre/:page (example: /api/genre/romance/1)<br>
        Manhwa Info + Chapters at: /api/info/:slug (example: /api/info/hypnotized-sex-with-my-brother/)<br>
        Manhwa Images List at: /api/chapter/:manga/:chapter (example: /api/chapter/real-no-heroine-wa-irimasen-english/69/)
        `)
})

app.get('/api/latest/:page', async (req, res) => {
    const result = await scapper.latest(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/api/all/:page', async (req, res) => {
    const result = await scapper.all(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/api/completed/:page', async (req, res) => {
    const result = await scapper.completed(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/api/info/:slug', async (req, res) => {
    const result = await scapper.info(req.params.slug)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/api/chapter/:manga/:chapter', async (req, res) => {
    const result = await scapper.chapter(req.params.manga,req.params.chapter)
    res.setHeader('Cache-Control', 's-maxage=43200');
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/api/genre/:genre/:page', async (req, res) => {
    const result = await scapper.genre(req.params.genre,req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/api/search/:search/', async (req, res) => {
    const result = await scapper.search(req.params.search)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/api/search/:search/:page', async (req, res) => {
    const result = await scapper.search(req.params.search,req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

port = env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})
