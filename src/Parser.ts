/**
 * Created by amatsegor on 5/6/17.
 */

const unrtf = require('unrtf');
const himalaya = require("himalaya");
const fs = require("fs");
import {Vote} from "./Vote";

export class Parser {

    static parse(path: string) {
        let parser = new Parser();
        parser.parseRtfFile(path)
            .then(result => parser.parseHtml(result))
            .then(json => parser.parseJson(json))
            .then(parsed => console.log(parsed))
            .catch(reject => console.log(reject))
    }

    static bin2String(array: number[]) {
        return String.fromCharCode.apply(String, array);
    }

    parseRtfFile(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const fileContents = fs.readFileSync(filePath);
            unrtf(Parser.bin2String(fileContents), (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.html);
                }
            });
        })
    }

    private parseHtml(htmlString: string): any[] {
        return himalaya.parse(htmlString);
    }

    private parseJson(array: any[]) {
        let rawVoteArray = array
            .filter(obj => Array.isArray(obj.children))
            .map(obj => obj.children)
            .filter(array => array && Array.isArray(array) && array.length > 100)[0];

        return rawVoteArray
            .filter(item => item.content)
            .map(item => item.content.trim())
            .filter(string => string.length > 0)
            .map(string => string.split(" ").filter(string => string.length > 0))
            .map(array => {
                let id = array[0];
                let name = array[1] + " " + array[2] + " " + array[3];
                let vote = array[4];
                if (array[5]) vote += " " + array[5];
                return new Vote(id, name, vote);
            });
    }
}