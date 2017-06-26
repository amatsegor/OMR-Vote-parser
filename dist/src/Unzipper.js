"use strict";
/**
 * Created by amatsegor on 6/20/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var unzip = require("unzip");
var Unzipper = (function () {
    function Unzipper() {
    }
    Unzipper.unzip = function (path) {
        return new Promise(function (resolve, reject) {
            if (!fs.existsSync("temp")) {
                fs.mkdir("temp", function (err) {
                    if (err)
                        console.log(err);
                    reject("Unable to create target folder");
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
                resolve(filesArray);
            });
        });
    };
    return Unzipper;
}());
exports.Unzipper = Unzipper;
//# sourceMappingURL=Unzipper.js.map