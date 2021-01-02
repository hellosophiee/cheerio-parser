const axios = require('axios');
const cheerio = require('cheerio');
const chalk = require('chalk');
const fs = require('fs');

const parse = async () => {
    const getHTML = async (url) => {
        const { data } = await axios.get(url);
        return cheerio.load(data);
    };

    const $ = await getHTML('https://kanobu.ru/games/playstation_5/popular/');
    const pageNumber = $('a.ui-kit-paginator--list-link').eq(-2).text();

    for (let i = 1; i <= pageNumber; i++) {
        const selector = await getHTML(
            `https://kanobu.ru/games/playstation_5/popular/?page=${i}`
        );
        selector('.c-game').each((i, element) => {
            const title = selector(element).find('div.h2').text();
            const link = `https://kanobu.ru${selector(element)
                .find('a')
                .attr('href')}`;
            // console.log(
            //     chalk.blue(
            //         `Game Title: ${title}`,
            //         chalk.bgYellow(`\nLink: ${link}`)
            //     )
            // );

            fs.appendFileSync(
                './data.txt',
                `Game Title :${title} \nLink: ${link}\n`
            );
        });
    }
};

parse();
