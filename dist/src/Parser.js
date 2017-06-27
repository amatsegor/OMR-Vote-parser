"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
/**
 * Created by amatsegor on 5/6/17.
 */
var cheerio = require("cheerio");
var unrtf = require('unrtf');
var fs = require("fs");
var validVotes = ['ЗА', 'ПРОТИ', 'УТРИМАВСЯ', 'відсутній', 'НЕ'];
var Parser = (function () {
    function Parser(index) {
        this.index = index;
    }
    Parser.parse = function (path, index) {
        if (!index)
            index = 0;
        return rxjs_1.Observable.create(function (observer) {
            var parser = new Parser(index);
            parser.parseRtf(path)
                .then(function (result) {
                var pathSplit = path.split("/");
                var projectNumber = pathSplit[pathSplit.length - 1];
                projectNumber = projectNumber.substring(projectNumber.indexOf('_p') + 2, projectNumber.indexOf('.rtf'));
                if (projectNumber.match("\\d{1,2}\\.\\d{1,2}") == null) {
                    projectNumber = "9";
                }
                return parser.parseHtml([result, projectNumber]);
            })
                .then(function (parsed) { return observer.next(parsed); })
                .catch(function (rejectReason) {
                rxjs_1.Observable.throw(rejectReason);
                console.log(rejectReason);
            });
        });
    };
    Parser.prototype.parseRtf = function (filePath) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.readFile(filePath)
                .then(function (data) {
                unrtf(Parser.bin2String(data), function (error, result) {
                    if (error || result.html == '') {
                        reject(error ? error : "Result of file " + filePath + " for data " + data + " is empty");
                    }
                    else {
                        resolve(result.html);
                    }
                });
            });
        });
    };
    Parser.prototype.parseHtml = function (tuple) {
        var $ = cheerio.load(tuple[0]);
        var sessionDate = $("p:nth-child(4)>strong:first-child").text().split(" ")[2];
        var sessionId = Math.floor(Parser.hashCode(sessionDate) / 10000);
        var title = $("p:nth-child(8)").text();
        var votingTime = $('p:nth-child(7)').text();
        var deputies = [];
        var votingIds = [];
        var projectId = Math.floor(Parser.hashCode(title) / 10000) + this.index;
        var absentDeps = [];
        var votings = $('p:nth-child(12)')[0].children
            .filter(function (ths) { return ths.type == 'text'; })
            .map(function (text) { return text.data.trim(); })
            .filter(function (text) { return text != ''; })
            .map(function (string) { return string.split(" ").filter(function (string) { return string.length > 0; }); })
            .map(function (array) {
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
                _id: Math.floor(Parser.hashCode(name + surname + fatherName) / 10000),
                name: name,
                surname: surname,
                fatherName: fatherName
            };
            deputies.push(deputy);
            if (array[5])
                vote += " " + array[5];
            if (vote == 'відсутній')
                absentDeps.push(deputy._id);
            var voting = {
                _id: projectId + deputy._id + Math.floor(Math.random() * 10),
                deputyId: deputy._id,
                projectId: projectId,
                vote: vote
            };
            votingIds.push(voting._id);
            return voting;
        });
        var project = {
            _id: projectId,
            sessionId: sessionId,
            projectNumber: tuple[1],
            orderInSession: this.index,
            sessionDate: sessionDate,
            votingTime: votingTime,
            title: title,
            votingIds: votingIds,
            html: tuple[0],
            absentDeps: absentDeps,
            votingResult: {
                _for: parseInt($("p:nth-child(16)> strong").text().replace('\t', '').split(" ")[2]),
                _against: parseInt($("p:nth-child(17)> strong").text().replace('\t', '').split(" ")[2]),
                _neutral: parseInt($("p:nth-child(18)> strong").text().replace('\t', '').split(" ")[1]),
                _didntvote: parseInt($("p:nth-child(19)> strong").text().replace('\t', '').split(" ")[3]),
                _absent: absentDeps.length
            }
        };
        return {
            _id: sessionId,
            title: "",
            date: sessionDate,
            projects: [project],
            deputies: deputies,
            votings: votings,
            absentDeputies: []
        };
    };
    Parser.prototype.readFile = function (filePath) {
        return new Promise(function (resolve, reject) {
            fs.readFile(filePath, function (error, data) {
                var path = filePath;
                if (error) {
                    reject(error);
                }
                else {
                    resolve(data);
                }
            });
        });
    };
    Parser.bin2String = function (array) {
        return String.fromCharCode.apply(String, array);
    };
    Parser.hashCode = function (str) {
        if (str.length == 0)
            return 0;
        var hash = 0, i;
        for (i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
        }
        return hash > 0 ? hash : -hash;
    };
    return Parser;
}());
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map