import {isNullOrUndefined} from "util";
/**
 * Created by amatsegor on 6/20/17.
 */

let Download = require("node-curl-download").Download;

export class Downloader {
    static get(url: string, callback: (filePath: string) => void, fileName?: string): void {
        if (isNullOrUndefined(fileName)){
            const splitUrl = url.split("/");
            fileName = splitUrl[splitUrl.length-1];
        }
        let filePath = "./temp/" + fileName;
        let dl = new Download(url, filePath);

        dl.on('end', (code) => {
            console.log("Code: " + code);
            callback(filePath);
        });

        dl.start();
    }
}