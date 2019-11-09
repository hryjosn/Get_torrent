const request = require("request");
const cheerio = require("cheerio");
let host_name = '';
let first_url = ''
let second_url = ''
let download_url = ''

const func = () => {
  request({
    url: 'http://javtorrent.re/censored/179097/',
    method: "GET"
  }, (error, response, body) => {
    first_url = get_url(body, '#content > div.single-t.sHD > a')
    host_name = first_url.split('/')[2]
    request({
      url: 'http:'+ first_url,
      method: "GET"
    }, (error, response, body) => {
      second_url = get_url(body, 'body > div.main > a');
      request({
        url: 'http://' + host_name + second_url,
        method: "GET"
      }, (error, response, body) => {
        download_url = get_url(body, 'body > div.main > a');
        console.log('download_url', download_url);

      })
    })

  })

}
const get_url = (body, rule) => {
  const $ = cheerio.load(body); // 載入 body
  const div = $(rule);
  return div[0].attribs.href
}
func();
