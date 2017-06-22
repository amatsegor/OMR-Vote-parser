"use strict";
/**
 * Created by amatsegor on 6/20/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var unzip = require("unzip");
var rxjs_1 = require("rxjs");
var Unzipper = (function () {
    function Unzipper() {
    }
    Unzipper.unzip = function (path) {
        return rxjs_1.Observable.create(function (observer) {
            if (!fs.existsSync("temp")) {
                fs.mkdir("temp", function (err) {
                    if (err)
                        console.log(err);
                    rxjs_1.Observable.throw("Unable to create target folder");
                });
            }
            var filesArray = [];
            fs.createReadStream(path)
                .pipe(unzip.Parse())
                .on('entry', function (entry) {
                var type = entry.type;
                var fileName = entry.path;
                if (type == 'File' && fileName.match("Gol.+.rtf")) {
                    var filePath = "temp/" + fileName;
                    entry.pipe(fs.createWriteStream(filePath));
                    filesArray.push(filePath);
                }
                else {
                    entry.autodrain();
                }
            })
                .on('close', function () {
                observer.next(filesArray);
            });
        });
    };
    return Unzipper;
}());
exports.Unzipper = Unzipper;
//# sourceMappingURL=Unzipper.js.map