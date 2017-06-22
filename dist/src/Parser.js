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
class Parser {
    static parse(path, index = 0) {
        return rxjs_1.Observable.create(observer => {
            let parser = new Parser(index);
            parser.parseRtf(path)
                .then(result => {
                const pathSplit = path.split("/");
                var projectNumber = pathSplit[pathSplit.length - 1];
                projectNumber = projectNumber.substring(projectNumber.indexOf('_p') + 2, projectNumber.indexOf('.rtf'));
                if (projectNumber.match("\\d{1,2}\\.\\d{1,2}") == null) {
                    projectNumber = "9";
                }
                return parser.parseHtml([result, projectNumber]);
            })
                .then(parsed => observer.next(parsed))
                .catch(rejectReason => {
                rxjs_1.Observable.throw(rejectReason);
                console.log(rejectReason);
            });
        });
    }
    constructor(index) {
        this.index = index;
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
        let projectId = Parser.hashCode(title).toString().substring(0, 6) + this.index;
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
                _id: Parser.hashCode(name + surname + fatherName).toString().substring(0, 6),
                name: name,
                surname: surname,
                fatherName: fatherName
            };
            deputies.push(deputy);
            if (array[5])
                vote += " " + array[5];
            let voting = {
                deputyId: deputy._id, vote: vote, _id: projectId + deputy._id
            };
            votingIds.push(voting._id);
            return voting;
        });
        let project = {
            _id: projectId,
            projectNumber: tuple[1],
            orderInSession: this.index,
            sessionDate: sessionDate,
            votingTime: votingTime,
            title: title,
            votingIds: votingIds,
            html: tuple[0]
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
        return hash > 0 ? hash : -hash;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map