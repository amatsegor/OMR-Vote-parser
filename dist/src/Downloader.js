"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
/**
 * Created by amatsegor on 6/20/17.
 */
let Download = require("node-curl-download").Download;
class Downloader {
    static get(url, callback, fileName) {
        if (util_1.isNullOrUndefined(fileName)) {
            const splitUrl = url.split("/");
            fileName = splitUrl[splitUrl.length - 1];
        }
        let filePath = "./temp/" + fileName;
        let dl = new Download(url, filePath);
        dl.on('end', (code) => {
            callback(filePath);
        });
        dl.start();
    }
}
exports.Downloader = Downloader;
//# sourceMappingURL=Downloader.js.map