/**
 * Created by amatsegor on 5/6/17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unrtf = require('unrtf');
const himalaya = require("himalaya");
const fs = require("fs");
const Vote_1 = require("./Vote");
class Parser {
    static parse(path) {
        let parser = new Parser();
        parser.parseRtfFile(path)
            .then(result => parser.parseHtml(result))
            .then(json => parser.parseJson(json))
            .then(parsed => console.log(parsed))
            .catch(reject => console.log(reject));
    }
    static bin2String(array) {
        return String.fromCharCode.apply(String, array);
    }
    parseRtfFile(filePath) {
        return new Promise((resolve, reject) => {
            const fileContents = fs.readFileSync(filePath);
            unrtf(Parser.bin2String(fileContents), (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result.html);
                }
            });
        });
    }
    parseHtml(htmlString) {
        return himalaya.parse(htmlString);
    }
    parseJson(array) {
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
            if (array[5])
                vote += " " + array[5];
            return new Vote_1.Vote(id, name, vote);
        });
    }
}
exports.Parser = Parser;
