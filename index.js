import cheerio from "cheerio";
import rp from "request-promise";
import { getInfo } from "./Util/util";
import dayjs from "dayjs";
import Video from "./Video";
// return;
let execute = (page, endPage) => {
  rp({
    method: 'GET',
    url: `http://javtorrent.re/page/${page}/`,
    transform: body => {
      return cheerio.load(body);
    }
  }).then(async ($) => {
    console.log(`Page ${page}`)
    if ($(`#content > div.base > div`).length !== 50) {
      return
    }
    for (let i = 1; i <= 50; i++) {
      const a_tag = $(`#content > div.base > div:nth-child(${i}) > a:first-child`);
      const page_url = 'http://javtorrent.re' + a_tag.attr('href');
      const name = a_tag.find('span.base-t').text();
      const small_pic = 'http:' + $(`#content > div.base > div:nth-child(${i}) > a:nth-child(1) > img`).attr('src');
      const { downloadUrlList, time, tagList, type, large_pic } = await getInfo(page_url);
      const formattedTime = time.split(' - ').join(' ');
      const transformedTime = formattedTime ? dayjs(formattedTime) : '';
      let newVideo = new Video({
        large_pic,
        page_url,
        name,
        downloadUrlList,
        time: transformedTime,
        tagList,
        type,
        small_pic
      });
      newVideo.save().catch(err => {
        console.log(err)
      })
    }
    if (page < endPage) {
      execute(++page);
    }
  }).catch(error => {
    console.log(error)
  });
}
for (let i = 0; i <= 10; i++) {
  let startFrom = 1;
  execute(startFrom + i * 10, startFrom + i * 10);
}

