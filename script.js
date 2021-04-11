let fs = require("fs");
let puppeteer = require('puppeteer');
// node script.js "TOP 10 ENGLISH SONGS" 
let playlistname = process.argv[2];

function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(ms)
        }, ms)
    })
}

(async function () {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        slowMo: 20,
        args: ['--start-fullscreen', '--disable-notifications', '--incognito']
    });

    let user = "kabip19010@tlhao86.com";
    let pwd = "kabip19010@tlhao86.com";

    let pages = await browser.pages();
    let page = pages[0];
    page.goto('https://open.spotify.com', {
        waitUntil: 'networkidle2'
    });

    // Login
    await page.waitForSelector("._3f37264be67c8f40fa9f76449afdb4bd-scss._1f2f8feb807c94d2a0a7737b433e19a8-scss", {
        visible: true
    });
    await page.click("._3f37264be67c8f40fa9f76449afdb4bd-scss._1f2f8feb807c94d2a0a7737b433e19a8-scss");


    await page.waitForSelector('#login-username', {
        visible: true
    });
    await page.type('#login-username', user);
    await page.type('#login-password', pwd);
    await page.click("#login-button");

    await page.waitForSelector('.icon.search-icon', {
        visible: true
    });

    let search = "/search";
    page.goto('https://open.spotify.com' + search, {
        waitUntil: 'networkidle2'
    });

    await page.waitForSelector('._748c0c69da51ad6d4fc04c047806cd4d-scss.f3fc214b257ae2f1d43d4c594a94497f-scss', {
        visible: true
    });
    await page.type('._748c0c69da51ad6d4fc04c047806cd4d-scss.f3fc214b257ae2f1d43d4c594a94497f-scss', playlistname);

    await page.waitForSelector('._85fec37a645444db871abd5d31db7315-scss', {
        visible: true
    });
    await page.click("._85fec37a645444db871abd5d31db7315-scss");


    await page.waitForSelector('.da0bc4060bb1bdb4abb8e402916af32e-scss.standalone-ellipsis-one-line._8a9c5cc886805907de5073b8ebc3acd8-scss span span');
    let elements = await page.$$('.da0bc4060bb1bdb4abb8e402916af32e-scss.standalone-ellipsis-one-line._8a9c5cc886805907de5073b8ebc3acd8-scss span span');
    let song_names_promise = [];
    for (let idx = 0; idx < elements.length; idx++) {
        let text = await elements[idx].getProperty('innerText');
        let ft = (await text).jsonValue();
        song_names_promise.push(ft);
    }
    let song_names = await Promise.all(song_names_promise);

    //create new playlist
    page.goto('https://open.spotify.com/collection/playlists', {
        waitUntil: 'networkidle2'
    });
    await page.waitForSelector("._3f37264be67c8f40fa9f76449afdb4bd-scss._1f2f8feb807c94d2a0a7737b433e19a8-scss._0b979b912e80659fe92da99af4ebd251-scss");
    await page.click("._3f37264be67c8f40fa9f76449afdb4bd-scss._1f2f8feb807c94d2a0a7737b433e19a8-scss._0b979b912e80659fe92da99af4ebd251-scss");

    for (let song of song_names) {
        await page.waitForSelector("._655bc45ccbf3d91c685865ff470892eb-scss.f3fc214b257ae2f1d43d4c594a94497f-scss");
        await page.click("._655bc45ccbf3d91c685865ff470892eb-scss.f3fc214b257ae2f1d43d4c594a94497f-scss");
        await page.type("._655bc45ccbf3d91c685865ff470892eb-scss.f3fc214b257ae2f1d43d4c594a94497f-scss", song);

        await wait(1000);

        await page.waitForSelector("._3f37264be67c8f40fa9f76449afdb4bd-scss._110dbc41d89af63f97cdd8b7cd7fea47-scss._2e6fd4bdb936691a0eceb04a1e880c2f-scss");
        await page.click("._3f37264be67c8f40fa9f76449afdb4bd-scss._110dbc41d89af63f97cdd8b7cd7fea47-scss._2e6fd4bdb936691a0eceb04a1e880c2f-scss");
        
        await wait(1000);

        await page.waitForSelector(".e2743454bbd40e4ecd04d30f09d53798-scss");
        await page.click(".e2743454bbd40e4ecd04d30f09d53798-scss");
    }

    await browser.close();
})();
