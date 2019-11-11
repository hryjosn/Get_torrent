const rp = require("request-promise");
const cheerio = require("cheerio");
let downloadUrlList = [];
const HD_rule = '#content > div.single-t.sHD > a';
const DL_rule = '#content > div.single-t > a';
const info_rule = '#content > div.t-info > a'
let tagList = [];
let time = '';
let type = '';
let large_pic = '';
const getRes = url => {
  return rp({
    url: url,
    method: "GET",
    transform: body => {
      return cheerio.load(body);
    }
  })
}
const getFirstLink = async url => {
  downloadUrlList = []; //reset array
  tagList = [];
  time = ''
  let $ = await getRes(url)
  const infoList = $(`${info_rule}`);
  large_pic = 'http:' + $('#content > img').attr('src')
  time = infoList.eq(0).text();
  type = infoList.eq(1).text();
  for (let i = 2; i <= infoList.length; i++) {
    const tag = infoList.eq(i).text();
    if (!!tag && tag !== 'New') {
      tagList.push(tag)
    }
  }
  let promiseList = [];
  for (const type of verifyType($)) {
    if (type === 'HD') {
      promiseList.push(getSecondLink('http:' + get_url($, HD_rule)))
    } else {
      promiseList.push(getSecondLink('http:' + get_url($, DL_rule)))
    }
  }
  await Promise.all(promiseList);
};
const getSecondLink = url =>
  new Promise(resolve => {
    getRes(url).then(async $ => {
        getRes('http://0r.1be.re/' + get_url($, 'body > div.main > a'))
          .then($ => {
            downloadUrlList.push(get_url($, 'body > div.main > a'));
            resolve(downloadUrlList)
          });
      }
    )
  })


export const getInfo = async url => {
  await getFirstLink(url)
  return { downloadUrlList, time, tagList, type, large_pic };
}
const verifyType = $ => {
  let result = [];
  if ($(HD_rule).text().indexOf('HD') !== -1) {
    result.push('HD')
  }
  if ($(DL_rule).text().indexOf('DL') !== -1) {
    result.push('DL')

  }
  return result;
}
const get_url = ($, rule) => {
  const a_tag = $(rule);
  return a_tag.attr('href')
}

