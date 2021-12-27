# Hiperdex Scrapper API

Manhwa/Manga Scrapper from hiperdex.com based on cheerio, node.js and express.

## Test Url

https://hiperdex-scrapper.vercel.app/api/

## Installing

    npm install
    node api
    
## Endpoints

Latest Chapters at: `/api/latest/:page` (example: `/api/latest/1`) 

All Manhwa List at: `/api/all/:page` (example: `/api/all/1`)

Manhwa Search at: `/api/search/:search+query/:page` (example: `/api/search/a/1`)

Manhwa Genre at: `/api/genre/:genre/:page` (example: `/api/genre/romance/1`)

Manhwa Info + Chapters at: `/api/info/:slug` (example: `/api/info/hypnotized-sex-with-my-brother/`) 

Manhwa Images List at: `/api/chapter/:manga/:chapter` (example: `/api/chapter/real-no-heroine-wa-irimasen-english/69/`)

## Original Repo

https://github.com/mrluffyx/hiperdex-scrapper
