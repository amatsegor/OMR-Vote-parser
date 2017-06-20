"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Downloader_1 = require("./Downloader");
const Parser_1 = require("./Parser");
const Unzipper_1 = require("./Unzipper");
const rxjs_1 = require("rxjs");
/**
 * Created by amatsegor on 6/20/17.
 */
exports.doDaFuckingJob = function (url) {
    return rxjs_1.Observable.create(observer => {
        Downloader_1.Downloader.get(url, filePath => {
            Unzipper_1.Unzipper.unzip(filePath)
                .subscribe(file => {
                Parser_1.Parser.parse(file).subscribe(json => observer.next(json));
            });
        });
    });
};
var Downloader_2 = require("./Downloader");
exports.Downloader = Downloader_2.Downloader;
var Parser_2 = require("./Parser");
exports.Parser = Parser_2.Parser;
var Unzipper_2 = require("./Unzipper");
exports.Unzipper = Unzipper_2.Unzipper;
//# sourceMappingURL=index.js.map