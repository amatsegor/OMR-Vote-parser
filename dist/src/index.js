"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Downloader_1 = require("./Downloader");
const Parser_1 = require("./Parser");
const Unzipper_1 = require("./Unzipper");
const rxjs_1 = require("rxjs");
/**
 * Created by amatsegor on 6/20/17.
 */
exports.parseVotingsZip = function (url) {
    return rxjs_1.Observable.create(observer => {
        Downloader_1.Downloader.get(url, filePath => {
            Unzipper_1.Unzipper.unzip(filePath)
                .subscribe(file => {
                Parser_1.Parser.parse(file).subscribe(json => observer.next(json));
            });
        });
    });
};
//# sourceMappingURL=index.js.map