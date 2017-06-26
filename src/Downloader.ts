import {isNullOrUndefined} from "util";
/**
 * Created by amatsegor on 6/20/17.
 */

let Download = require("node-curl-download").Download;

export class Downloader {
    static get(url: string, fileName?: string): Promise<string> {
        if (isNullOrUndefined(fileName)) {
            const splitUrl = url.split("/");
            fileName = splitUrl[splitUrl.length - 1];
        }
        let filePath = "./temp/" + fileName;

        return new Promise(resolve => {
            let dl = new Download(url, filePath);

            dl.on('end', (code) => {
                resolve(filePath);
            });

            dl.start();
        });
    }
}