const fs = require("fs");
const convert = require("xml-js");
const https = require("https");

let okhttp = {}
var itemsProcessed = 0;

const xmlFile = fs.readFileSync(__dirname + "/dist/lexant/sitemap.xml", "utf8");

const jsonData = JSON.parse(
    convert.xml2json(xmlFile, {
        compact: true,
        spaces: 2
    })
);

MultiHttp(jsonData.urlset.url)



function MultiHttp(paths) {


    paths.forEach((element) => {


        if (req(element).ok === true) {
            okhttp[req(element).path] = "Success"
        } else {
            okhttp[req(element).path] = req(element).ok
        }


        itemsProcessed++;

        if (itemsProcessed === paths.length) {
            console.table(okhttp)
        }

    });


}

function req(element) {

    try {
        let options = {
            host: element.loc._text.replace("https://", "").split('/')[0],
            path: "/" + element.loc._text.replace("https://", "").split('/').slice(1).join("/"),
            method: "GET",
        };


        const req = https.request(options)


        req.end();

        return {
            path: options.host + options.path,
            ok: true
        }

    } catch (e) {
        return {
            path: element,
            ok: e
        }
    }
}