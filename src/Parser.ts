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
            .then(result => himalaya.parse(result))
            .then(json => parser.parseJson(json))
            .then(parsed => {
                console.log(path);
                const jsonString = JSON.stringify(parsed);
                console.log(jsonString);
                let filename = path.substring(0, path.indexOf(".rtf")) + ".json";
                fs.writeFileSync(filename, jsonString)
            })
            .catch(rejectReason => {
                console.log(rejectReason)
            })
    }

    parseRtfFile(filePath: string) {
        return new Promise((resolve, reject) => {
            this.readFile(filePath)
                .then(data => {
                    unrtf(this.bin2String(data), null, (error, result) => {
                        if (error || result.html == '') {
                            reject(error ? error : "Result of file " + filePath + " is empty");
                        } else {
                            resolve(result.html);
                        }
                    });
                });
        })
    }

    private readFile(filePath: string): Promise<number[]> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (error, data) => {
                let path = filePath;
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    private parseJson(array: any[]): Vote[] {
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

    private bin2String(array: number[]): string {
        return String.fromCharCode.apply(String, array);
    }
}