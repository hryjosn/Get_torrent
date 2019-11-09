const rp = require("request-promise");
const cheerio = require("cheerio");
let urlList = [];
const HD_rule = '#content > div.single-t.sHD > a'
const DL_rule = '#content > div.single-t > a'
const getFirstLink = async url => {
  urlList = []; //reset array
  let $ = await rp({
    url: url,
    method: "GET",
    transform: body => {
      return cheerio.load(body);
    }
  })
  let promiseList = []
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
    rp({
      url: url,
      method: "GET",
      transform: body => {
        return cheerio.load(body);
      }
    }).then(async $ => {
        getDownloadLink('http://0r.1be.re/' + get_url($, 'body > div.main > a'))
          .then($ => {
            urlList.push(get_url($, 'body > div.main > a'));
            resolve(urlList)
          });
      }
    )
  })


const getDownloadLink = url => {
  return rp({
    url: url,
    method: "GET",
    transform: body => {
      return cheerio.load(body);
    }
  })
}

const downloadFile = async url => {
  await getFirstLink(url)
  return urlList;
}
const verifyType = $ => {
  let result = [];
  if ($(HD_rule).length) {
    result.push('HD')
  }
  if ($(DL_rule).length) {
    result.push('DL')

  }
  return result;
}
const get_url = ($, rule) => {
  const a_tag = $(rule);
  return a_tag.attr('href')
}
export default downloadFile
