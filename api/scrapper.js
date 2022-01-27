const cheerio = require('cheerio');
const axios = require('axios');

async function info(slug) {
    let genres = [];
    try {
        res = await axios.get(`https://manhwa18.me/manhwa/${slug}`);
        const body = await res.data;
        const $ = cheerio.load(body);
        let id = slug;
        let manhwa_title = $('.post-title > h1:nth-child(1)').text().trim();
        let poster = $('.summary_image img').attr('src');
        let author_list = [];
        let author_e = $('.author-content a');
        $(author_e).each((index, element) => {
            $elements = $(element);
            author_name = $elements.text().trim();
            author_list.push({ author_name });
        });
        let author = author_list.map(e => e.author_name).join(", ");
        let artist_list = [];
        let artist_e = $('.artist-content a');
        $(artist_e).each((index, element) => {
            $elements = $(element);
            artist_name = $elements.text().trim();
            artist_list.push({ artist_name });
        });
        let artist = artist_list.map(e => e.artist_name).join(", ");
        let genres_e = $('.genres-content a');
        $(genres_e).each((index, element) => {
            $elements = $(element);
            genre_title = $elements.text().trim();
            genre_url = $elements.attr('href');
            genre_slug = genre_url.replace('https://manhwa18.me/manhwa-genre', '/genre');
            genre_list = { 'genre_title': genre_title, 'genre_url': genre_url, 'genre_slug': genre_slug };
            genres.push(genre_list);
        });
        let other_name = $('div.post-content_item:nth-child(5) > div:nth-child(2)').text().trim();
        let type = $('div.post-content_item:nth-child(9) > div:nth-child(2)').text().trim();
        let status = $('div.post-content_item:nth-child(2) > div:nth-child(2)').text().trim();
        let released = $('div.post-content_item:nth-child(1) > div:nth-child(2) a').text().trim();
        let description = $('.description-summary').text().trim();
        let ch_list = await chaptersList(`https://manhwa18.me/manhwa/${slug}/ajax/chapters/`);
        return await ({
            'id': id,
            'page': manhwa_title,
            'other_name': other_name,
            'poster': poster,
            'authors': author,
            'artists': artist,
            'genres': genres,
            'type': type,
            'status': status,
            'released': released,
            'description': description,
            ch_list
        });
    } catch (error) {
        return await ({ 'error': 'Sorry dude, an error occured! No Info!' });
    }
}

async function chaptersList(url) {
    let ch_list = []
    try {
        res = await axios.post(url);
        const body = await res.data;
        const $ = cheerio.load(body);
        $('.version-chap li').each((index, element) => {

                $elements = $(element)
                title = $elements.find('a').text().trim()
                url = $elements.find('a').attr('href')
                time = $elements.find('.chapter-release-date').find('i').text()
                status = $elements.find('.chapter-release-date').find('a').attr('title')

                chapters = {'ch_title': title, 'time': time, 'status': status, 'url': url}

                ch_list.push(chapters)     
        })
        return await (ch_list);
    } catch (error) {
        return await ('Error Getting Chapters!');
    }
}

async function all(page) {
    let m_list = []
    try {
        res = await axios.get(`https://manhwa18.me/manga-list/page/${page}`);
        const body = await res.data;
        const $ = cheerio.load(body);
        let p_title = $('.c-blog__heading h1').text().trim();
        $('#loop-content .badge-pos-1').each((index, element) => {
            $elements = $(element);
            image = $elements.find('.page-item-detail').find('img').attr('src');
            url = $elements.find('.page-item-detail').find('a').attr('href');
            slug = url.replace('https://manhwa18.me/manga', '/series');
            get_id = slug.replace('/series/', '');
            id = get_id.replace('/', '');
            title = $elements.find('.page-item-detail .post-title').find('h3').text().trim();
            rating = $elements.find('.total_votes').text().trim();
            chapter = $elements.find('.list-chapter .chapter-item');
            let chapters = [];
            $(chapter).each((i, e) => {
                let c_title = $(e).find('a').text().trim();
                let c_ch = c_title.replace('Chapter ', '');
                let c_url = $(e).find('a').attr('href');
                let c_slug = c_url.replace('https://manhwa18.me/manga', '/chapter');
                let c_date = $(e).find('.post-on').text().trim();
                let status = $(e).find('.post-on a').attr('title');
                chapters.push({
                    'c_title': c_title,
                    'c_ch': c_ch,
                    'c_url': c_url,
                    'c_slug': c_slug,
                    'c_date': c_date,
                    'status': status
                });
            });
            m_list.push({
                'id': id,
                'title': title,
                'rating': rating,
                'image': image,
                'url': url,
                'slug': slug,
                'chapters': chapters
            });
        });
        let current = $('.current').text();
        let check_page = $('.pages').text();
        let last_page = check_page.match(/\d+/g);
        return await ({
            'p_title': p_title,
            'list': m_list,
            'current_page': current,
            'last_page': last_page
        });
    } catch (error) {
        return await ({ 'error': 'Sorry dude, an error occured! No List!' });
    }
}

async function search(search, page) {
    let m_list = [];
    try {
        res = await axios.get(`https://manhwa18.me/page/${page}/?s=${search}&post_type=wp-manga`);
        const body = await res.data;
        const $ = cheerio.load(body);
        let p_title = $('.c-blog__heading h1').text().trim();
        $('.c-tabs-item .c-tabs-item__content').each((index, element) => {
            $elements = $(element);
            image = $elements.find('.c-image-hover').find('img').attr('src');
            url = $elements.find('.c-image-hover').find('a').attr('href');
            slug = url.replace('https://manhwa18.me/manga', '/series');
            get_id = slug.replace('/series/', '');
            id = get_id.replace('/', '');
            title = $elements.find('.tab-summary .post-title').find('h3').text().trim();
            rating = $elements.find('.total_votes').text().trim();
            chapter = $elements.find('.tab-meta');
            let chapters = [];
            $(chapter).each((i, e) => {
                let c_title = $(e).find('a').text().trim();
                let c_ch = c_title.replace('Chapter ', '');
                let c_url = $(e).find('a').attr('href');
                let c_slug = c_url.replace('https://manhwa18.me/manga', '/chapter');
                let c_date = $(e).find('.post-on').text().trim();
                let status = $(e).find('.post-on a').attr('title');
                chapters.push({
                    'c_title': c_title,
                    'c_ch': c_ch,
                    'c_url': c_url,
                    'c_slug': c_slug,
                    'c_date': c_date,
                    'status': status
                });
            });
            m_list.push({
                'id': id,
                'title': title,
                'rating': rating,
                'image': image,
                'url': url,
                'slug': slug,
                'chapters': chapters
            });
        });
        let current = $('.current').text();
        let check_page = $('.pages').text();
        let last_page = check_page.match(/\d+/g);
        return await ({
            'p_title': p_title,
            'list': m_list,
            'current_page': current,
            'last_page': last_page
        });
    } catch (error) {
        return await ({ 'error': 'Sorry dude, an error occured! No List!' });
    }
}

async function latest(page) {
    let m_list = [];
    try {
        res = await axios.get(`https://manhwa18.me/page/${page}`);
        const body = await res.data;
        const $ = cheerio.load(body);
        let p_title = $('.c-blog__heading h1').text().trim();
        $('#loop-content .badge-pos-1').each((index, element) => {
            $elements = $(element);
            image = $elements.find('.page-item-detail').find('img').attr('src');
            url = $elements.find('.page-item-detail').find('a').attr('href');
            slug = url.replace('https://manhwa18.me/manga', '/series');
            get_id = slug.replace('/series/', '');
            id = get_id.replace('/', '');
            title = $elements.find('.page-item-detail .post-title').find('h3').text().trim();
            rating = $elements.find('.total_votes').text().trim();
            chapter = $elements.find('.list-chapter .chapter-item');
            let chapters = [];
            $(chapter).each((i, e) => {
                let c_title = $(e).find('a').text().trim();
                let c_ch = c_title.replace('Chapter ', '');
                let c_url = $(e).find('a').attr('href');
                let c_slug = c_url.replace('https://manhwa18.me/manga', '/chapter');
                let c_date = $(e).find('.post-on').text().trim();
                let status = $(e).find('.post-on a').attr('title');
                chapters.push({
                    'c_title': c_title,
                    'c_ch': c_ch,
                    'c_url': c_url,
                    'c_slug': c_slug,
                    'c_date': c_date,
                    'status': status
                });
            });
            m_list.push({
                'id': id,
                'title': title,
                'rating': rating,
                'image': image,
                'url': url,
                'slug': slug,
                'chapters': chapters
            });
        });
        let current = $('.current').text();
        let check_page = $('.pages').text();
        let last_page = check_page.match(/\d+/g);
        return await ({
            'p_title': p_title,
            'list': m_list,
            'current_page': current,
            'last_page': last_page
        });
    } catch (error) {
        return await ({ 'error': 'Sorry dude, an error occured! No Latest!' });
    }
}

async function completed(page) {
    let m_list = [];
    try {
        res = await axios.get(`https://manhwa18.me/completed/page/${page}`);
        const body = await res.data;
        const $ = cheerio.load(body);
        let p_title = $('.c-blog__heading h1').text().trim();
        $('#loop-content .badge-pos-1').each((index, element) => {
            $elements = $(element);
            image = $elements.find('.page-item-detail').find('img').attr('src');
            url = $elements.find('.page-item-detail').find('a').attr('href');
            slug = url.replace('https://manhwa18.me/manga', '/series');
            get_id = slug.replace('/series/', '');
            id = get_id.replace('/', '');
            title = $elements.find('.page-item-detail .post-title').find('h3').text().trim();
            rating = $elements.find('.total_votes').text().trim();
            chapter = $elements.find('.list-chapter .chapter-item');
            let chapters = [];
            $(chapter).each((i, e) => {
                let c_title = $(e).find('a').text().trim();
                let c_ch = c_title.replace('Chapter ', '');
                let c_url = $(e).find('a').attr('href');
                let c_slug = c_url.replace('https://manhwa18.me/manga', '/chapter');
                let c_date = $(e).find('.post-on').text().trim();
                let status = $(e).find('.post-on a').attr('title');
                chapters.push({
                    'c_title': c_title,
                    'c_ch': c_ch,
                    'c_url': c_url,
                    'c_slug': c_slug,
                    'c_date': c_date,
                    'status': status
                });
            });
            m_list.push({
                'id': id,
                'title': title,
                'rating': rating,
                'image': image,
                'url': url,
                'slug': slug,
                'chapters': chapters
            });
        });
        let current = $('.current').text();
        let check_page = $('.pages').text();
        let last_page = check_page.match(/\d+/g);
        return await ({
            'p_title': p_title,
            'list': m_list,
            'current_page': current,
            'last_page': last_page
        });
    } catch (error) {
        return await ({ 'error': 'Sorry dude, an error occured! No List!' });
    }
}

async function genre(genre, page) {
    let m_list = [];
    try {
        res = await axios.get(`https://manhwa18.me/manhwa-genre/${genre}/page/${page}`);
        const body = await res.data;
        const $ = cheerio.load(body);
        let p_title = $('.item-title.h4').text().trim();
        $('.page-content-listing .badge-pos-1').each((index, element) => {
            $elements = $(element);
            image = $elements.find('.page-item-detail').find('img').attr('src');
            url = $elements.find('.page-item-detail').find('a').attr('href');
            slug = url.replace('https://manhwa18.me/manga', '/series');
            get_id = slug.replace('/series/', '');
            id = get_id.replace('/', '');
            title = $elements.find('.page-item-detail .post-title').find('h3').text().trim();
            rating = $elements.find('.total_votes').text().trim();
            chapter = $elements.find('.list-chapter .chapter-item');
            let chapters = [];
            $(chapter).each((i, e) => {
                let c_title = $(e).find('a').text().trim();
                let c_ch = c_title.replace('Chapter ', '');
                let c_url = $(e).find('a').attr('href');
                let c_slug = c_url.replace('https://manhwa18.me/manga', '/chapter');
                let c_date = $(e).find('.post-on').text().trim();
                let status = $(e).find('.post-on a').attr('title');
                chapters.push({
                    'c_title': c_title,
                    'c_ch': c_ch,
                    'c_url': c_url,
                    'c_slug': c_slug,
                    'c_date': c_date,
                    'status': status
                });
            });
            m_list.push({
                'id': id,
                'title': title,
                'rating': rating,
                'image': image,
                'url': url,
                'slug': slug,
                'chapters': chapters
            });
        });
        let current = $('.current').text();
        let check_page = $('.pages').text();
        let last_page = check_page.match(/\d+/g);
        return await ({
            'p_title': p_title,
            'list': m_list,
            'current_page': current,
            'last_page': last_page
        });
    } catch (error) {
        return await ({ 'error': 'Sorry dude, an error occured! No List!' });
    }
}

async function chapter(manga, chapter) {
    let ch_list = [];
    try {
        res = await axios.get(`https://manhwa18.me/manga/${manga}/${chapter}`);
        const body = await res.data;
        const $ = cheerio.load(body);
        $('.read-container img').each((index, element) => {
            $elements = $(element);
            image = $elements.attr('src').trim();
            ch_list.push({ 'img': image });
        });
        let ch_title = $('#chapter-heading').text().trim();
        let manga_title = $('.breadcrumb > li:nth-child(2) > a:nth-child(1)').text().trim();
        let manga_url = $('.breadcrumb > li:nth-child(2) > a:nth-child(1)').attr('href');
        let manga_slug = manga_url.replace('https://manhwa18.me/manga', '/series');
        let manga_getid = manga_slug.replace('/series/', '');
        let manga_id = manga_getid.replace('/', '');
        let ch = $('.active').text().trim();
        let current_ch = ch.replace('Chapter ', '');
        let ch_id = manga_id + '-chapter-' + current_ch;
        let filter_id = ch_id.replace(' - [END]', '');
        let prev = $('.prev_page').attr('href');
        let next = $('.next_page').attr('href');
        return await ({
            'id': filter_id,
            'manga': ch_title,
            'manga_title': manga_title,
            'manga_url': manga_url,
            'manga_slug': manga_slug,
            'current_ch': current_ch,
            'chapters': ch_list,
            'nav': [{
                'prev': prev,
                'next': next
            }]
        });
    } catch (error) {
        return await ({ 'error': 'Sorry dude, an error occured! No Chapter Images!' });
    }
}

module.exports = {
    latest,
    all,
    completed,
    search,
    genre,
    info,
    chapter
}
