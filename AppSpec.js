const fs = require("fs");
const convert = require("xml-js");
const https = require("https");

const xmlFile = fs.readFileSync(__dirname + "/dist/lexant/sitemap.xml", "utf8");

const jsonData = JSON.parse(
  convert.xml2json(xmlFile, { compact: true, spaces: 2 })
);

MultiHttp(jsonData.urlset.url)

function MultiHttp(paths) {

  paths.forEach((element) => {

    let options = {
      host: element.loc._text.replace("https://", "").split('/')[0],
      path: element.loc._text.replace("https://", "").split('/').slice(1).join("/"),
      method: "GET",
    };
    // console.log(element.loc._text.replace("https://", "").split('/')[0])
    // console.log("/"+element.loc._text.replace("https://", "").split('/').slice(1).join("/"))
    const req = https.request(options, (res) => {
        console.log(res.statusCode)

    });

    req.on("error", (error) => {
        console.log(error)
    });

    req.end();
  });

}
