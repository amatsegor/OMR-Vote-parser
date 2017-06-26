/**
 * Created by amatsegor on 6/20/17.
 */

import fs = require("fs");
import unzip = require("unzip");

export class Unzipper {

    static unzip(path: string): Promise<string[]> {

        return new Promise((resolve, reject) => {
            if (!fs.existsSync("temp")) {
                fs.mkdir("temp", err => {
                    if (err) console.log(err);
                    reject("Unable to create target folder");
                })
            }

            let filesArray: string[] = [];

            fs.createReadStream(path)
                .pipe(unzip.Parse())
                .on('entry', (entry) => {
                    var type = entry.type;
                    var fileName: string = entry.path;
                    if (type == 'File' && fileName.match("Gol.+.rtf")) {
                        const filePath = "temp/" + fileName;
                        entry.pipe(fs.createWriteStream(filePath));
                        filesArray.push(filePath);
                    } else {
                        entry.autodrain();
                    }
                })
                .on('close', () => {
                    resolve(filesArray);
                })
        });
    }
}