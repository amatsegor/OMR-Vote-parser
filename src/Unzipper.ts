/**
 * Created by amatsegor on 6/20/17.
 */

import fs = require("fs");
import unzip = require("unzip");
import {Observable} from "rxjs";

export class Unzipper {

    static unzip(path: string): Observable<string> {

        return Observable.create(observer => {
            if (!fs.existsSync("temp")) {
                fs.mkdir("temp", err => {
                    if (err) console.log(err);
                    Observable.throw("Unable to create target folder");
                })
            }

            fs.createReadStream(path)
                .pipe(unzip.Parse())
                .on('entry', (entry) => {
                    var type = entry.type;
                    var fileName: string = entry.path;
                    if (type == 'File' && fileName.match("Gol.+.rtf")) {
                        const filePath = "temp/" + fileName;
                        entry.pipe(fs.createWriteStream(filePath));
                        observer.next(filePath);
                        // console.log(filePath);
                    } else {
                        entry.autodrain();
                    }
                })
        });
    }
}