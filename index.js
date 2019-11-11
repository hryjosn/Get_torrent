const rp = require("request-promise");
const cheerio = require("cheerio");
import { getInfo } from "./Util/util";

let page = 1;

let execute = () => {
  console.log(`Page ${page}`)
  rp({
    method: 'GET',
    url: `http://javtorrent.re/page/${page}/`,
    transform: body => {
      return cheerio.load(body);
    }
  }).then(async ($) => {
    if ($(`#content > div.base > div`).length !== 50) {
      return
    }
    for (let i = 1; i <= 50; i++) {
      const a_tag = $(`#content > div.base > div:nth-child(${i}) > a:first-child`);
      const page_url = 'http://javtorrent.re' + a_tag.attr('href');
      const name = a_tag.find('span.base-t').text();
      const { downloadUrlList, time, tagList, type } = await getInfo(page_url);
      console.log('page_url', page_url);
      console.log('name', name);
      console.log('downloadUrlList', downloadUrlList)
      console.log('time', time)
      console.log('tagList', tagList)
      console.log('type', type)
    }

    page++;
    execute();
  }).catch(error => {
    console.log(error)
  });
}
execute();
//jtl.re/x/19/h191108045041.jpg
//jtl.re/x/19/h191108045041_s.jpg

