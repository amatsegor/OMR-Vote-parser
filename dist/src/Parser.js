"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
/**
 * Created by amatsegor on 5/6/17.
 */
let cheerio = require("cheerio");
const unrtf = require('unrtf');
const fs = require("fs");
let validVotes = ['ЗА', 'ПРОТИ', 'УТРИМАВСЯ', 'відсутній', 'НЕ'];
var counter = 0;
class Parser {
    static parse(path) {
        return rxjs_1.Observable.create(observer => {
            let parser = new Parser();
            parser.parseRtf(path)
                .then(result => {
                counter++;
                return parser.parseHtml([result, counter]);
            })
                .then(parsed => observer.next(parsed))
                .catch(rejectReason => {
                rxjs_1.Observable.throw(rejectReason);
                console.log(rejectReason);
            });
        });
    }
    parseRtf(filePath) {
        return new Promise((resolve, reject) => {
            this.readFile(filePath)
                .then(data => {
                unrtf(Parser.bin2String(data), (error, result) => {
                    if (error || result.html == '') {
                        reject(error ? error : "Result of file " + filePath + " for data " + data + " is empty");
                    }
                    else {
                        resolve(result.html);
                    }
                });
            });
        });
    }
    parseHtml(tuple) {
        let $ = cheerio.load(tuple[0]);
        let title = $("p:nth-child(8)").text();
        let votingTime = $('p:nth-child(7)').text();
        let sessionDate = $("p:nth-child(4)>strong:first-child").text().split(" ")[2];
        let deputies = [];
        let votingIds = [];
        let votings = $('p:nth-child(12)')[0].children
            .filter(ths => ths.type == 'text')
            .map(text => text.data.trim())
            .filter(text => text != '')
            .map(string => string.split(" ").filter(string => string.length > 0))
            .map(array => {
            var deputy;
            var name = "", surname = "", fatherName = "", vote = '';
            if (validVotes.indexOf(array[3]) > -1) {
                surname = array[1];
                name = array[2];
                vote = array[3];
            }
            else {
                surname = array[1];
                name = array[2];
                fatherName = array[3];
                vote = array[4];
            }
            deputy = {
                _id: Parser.hashCode(name + surname + fatherName).toLocaleString(),
                name: name,
                surname: surname,
                fatherName: fatherName
            };
            deputies.push(deputy);
            if (array[5])
                vote += " " + array[5];
            return { deputyId: deputy._id, vote: vote };
        });
        let project = {
            _id: Parser.hashCode(title).toLocaleString(),
            orderInSession: tuple[1],
            sessionDate: sessionDate,
            votingTime: votingTime,
            title: title,
            votingIds: votingIds
        };
        return {
            _id: sessionDate,
            title: "",
            date: sessionDate,
            projects: [project],
            deputies: deputies,
            votings: votings
        };
    }
    readFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (error, data) => {
                let path = filePath;
                if (error) {
                    reject(error);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
    static bin2String(array) {
        return String.fromCharCode.apply(String, array);
    }
    static hashCode(str) {
        if (str.length == 0)
            return 0;
        var hash = 0, i;
        for (i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
        }
        return hash;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map