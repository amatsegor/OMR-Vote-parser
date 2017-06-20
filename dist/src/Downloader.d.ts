import {isNullOrUndefined} from "util";
/**
 * Created by amatsegor on 6/20/17.
 */

export declare class Downloader {
    static get(url: string, callback: (filePath: string) => void, fileName?: string);
}