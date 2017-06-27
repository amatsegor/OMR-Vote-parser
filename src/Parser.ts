import {Observable} from "rxjs";
import {Deputy} from "./models/Deputy";
import {Project} from "./models/Project";
import {Voting} from "./models/Voting";
import {Session} from "./models/Session";
/**
 * Created by amatsegor on 5/6/17.
 */

let cheerio = require("cheerio");
const unrtf = require('unrtf');
const fs = require("fs");

let validVotes = ['ЗА', 'ПРОТИ', 'УТРИМАВСЯ', 'відсутній', 'НЕ'];

export class Parser {

    static parse(path: string, index?: number): Observable<Session> {
        if (!index) index = 0;
        return Observable.create(observer => {
            let parser = new Parser(index);
            parser.parseRtf(path)
                .then(result => {
                    const pathSplit = path.split("/");
                    var projectNumber = pathSplit[pathSplit.length - 1];
                    projectNumber = projectNumber.substring(projectNumber.indexOf('_p') + 2, projectNumber.indexOf('.rtf'));
                    if (projectNumber.match("\\d{1,2}\\.\\d{1,2}") == null) {
                        projectNumber = "9"
                    }
                    return parser.parseHtml([result, projectNumber]);
                })
                .then(parsed => observer.next(parsed))
                .catch(rejectReason => {
                    Observable.throw(rejectReason);
                    console.log(rejectReason)
                })
        })
    }

    private index: number;

    constructor(index: number) {
        this.index = index;
    }

    parseRtf(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.readFile(filePath)
                .then(data => {
                    unrtf(Parser.bin2String(data), (error, result) => {
                        if (error || result.html == '') {
                            reject(error ? error : "Result of file " + filePath + " for data " + data + " is empty");
                        } else {
                            resolve(result.html);
                        }
                    });
                });
        })
    }

    private parseHtml(tuple: string[]): Session {
        let $ = cheerio.load(tuple[0]);

        let sessionDate: string = $("p:nth-child(4)>strong:first-child").text().split(" ")[2];
        let sessionId = Math.floor(Parser.hashCode(sessionDate) / 10000);
        let title: string = $("p:nth-child(8)").text();
        let votingTime: string = $('p:nth-child(7)').text();
        let deputies: Deputy[] = [];
        let votingIds: number[] = [];
        let projectId = Math.floor(Parser.hashCode(title) / 10000) + this.index;
        let absentDeps = [];

        let votings: Voting[] = $('p:nth-child(12)')[0].children
            .filter(ths => ths.type == 'text')
            .map(text => text.data.trim())
            .filter(text => text != '')
            .map(string => string.split(" ").filter(string => string.length > 0))
            .map(array => {
                var deputy: Deputy;
                var name = "", surname = "", fatherName = "", vote = '';
                if (validVotes.indexOf(array[3]) > -1) {
                    surname = array[1];
                    name = array[2];
                    vote = array[3];
                } else {
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
                if (array[5]) vote += " " + array[5];
                if (vote == 'відсутній') absentDeps.push(deputy._id);

                let voting: Voting = {
                    _id: projectId + deputy._id + Math.floor(Math.random() * 10),
                    deputyId: deputy._id,
                    projectId: projectId,
                    vote: vote
                };

                votingIds.push(voting._id);

                return voting;
            });

        let project: Project = {
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

    private static bin2String(array: number[]): string {
        return String.fromCharCode.apply(String, array);
    }

    private static hashCode(str: string): number {
        if (str.length == 0) return 0;
        var hash = 0, i: number;
        for (i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
        }
        return hash > 0 ? hash : -hash;
    }
}