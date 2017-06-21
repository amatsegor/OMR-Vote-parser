"use strict";
/**
 * Created by amatsegor on 6/20/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const unzip = require("unzip");
const rxjs_1 = require("rxjs");
class Unzipper {
    static unzip(path) {
        return rxjs_1.Observable.create(observer => {
            if (!fs.existsSync("temp")) {
                fs.mkdir("temp", err => {
                    if (err)
                        console.log(err);
                    rxjs_1.Observable.throw("Unable to create target folder");
                });
            }
            let filesArray = [];
            fs.createReadStream(path)
                .pipe(unzip.Parse())
                .on('entry', (entry) => {
                var type = entry.type;
                var fileName = entry.path;
                if (type == 'File' && fileName.match("Gol.+.rtf")) {
                    const filePath = "temp/" + fileName;
                    entry.pipe(fs.createWriteStream(filePath));
                    filesArray.push(filePath);
                }
                else {
                    entry.autodrain();
                }
            })
                .on('close', () => {
                observer.next(filesArray);
            });
        });
    }
}
exports.Unzipper = Unzipper;
//# sourceMappingURL=Unzipper.js.map