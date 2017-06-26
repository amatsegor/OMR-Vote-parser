"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
/**
 * Created by amatsegor on 6/20/17.
 */
var Download = require("node-curl-download").Download;
var Downloader = (function () {
    function Downloader() {
    }
    Downloader.get = function (url, fileName) {
        if (util_1.isNullOrUndefined(fileName)) {
            var splitUrl = url.split("/");
            fileName = splitUrl[splitUrl.length - 1];
        }
        var filePath = "./temp/" + fileName;
        return new Promise(function (resolve) {
            var dl = new Download(url, filePath);
            dl.on('end', function (code) {
                resolve(filePath);
            });
            dl.start();
        });
    };
    return Downloader;
}());
exports.Downloader = Downloader;
//# sourceMappingURL=Downloader.js.map