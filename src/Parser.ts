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

    static parse(path: string): Observable<Session> {
        return Observable.create(observer => {
            let parser = new Parser();
            parser.parseRtf(path)
                .then(result => {
                    const pathSplit = path.split("/");
                    var projectNumber = pathSplit[pathSplit.length - 1];
                    projectNumber = projectNumber.substring(projectNumber.indexOf('_p')+2, projectNumber.indexOf('.rtf'));
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

        let title: string = $("p:nth-child(8)").text();

        let votingTime: string = $('p:nth-child(7)').text();

        let sessionDate: string = $("p:nth-child(4)>strong:first-child").text().split(" ")[2];

        let deputies: Deputy[] = [];

        let votingIds: string[] = [];

        let projectId = Parser.hashCode(title).toLocaleString();

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
                    _id: Parser.hashCode(name + surname + fatherName).toLocaleString(),
                    name: name,
                    surname: surname,
                    fatherName: fatherName
                };
                deputies.push(deputy);
                if (array[5]) vote += " " + array[5];

                let voting: Voting = {
                    deputyId: deputy._id, vote: vote, _id: projectId + deputy._id
                };

                votingIds.push(voting._id);

                return voting;
            });

        let project: Project = {
            _id: projectId,
            projectNumber: tuple[1],
            orderInSession: 0,
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
        return hash;
    }
}