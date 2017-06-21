import {Observable} from "rxjs";
import {Voting} from "./models/Voting";
import {Deputy} from "./models/Deputy";
import {Project} from "./models/Project";
/**
 * Created by amatsegor on 5/6/17.
 */

let cheerio = require("cheerio");
const unrtf = require('unrtf');
const fs = require("fs");

let validVotes = ['ЗА', 'ПРОТИ', 'УТРИМАВСЯ', 'відсутній', 'НЕ'];

export class Parser {

    static parse(path: string): Observable<Voting[]> {
        return Observable.create(observer => {
            let parser = new Parser();
            parser.parseRtf(path)
                .then(result => parser.parseHtml(result))
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

    private parseHtml(html: string): Project {
        let $ = cheerio.load(html);

        let title: string = $("p:nth-child(8)").text();

        let votingTime: string = $('p:nth-child(7)').text();

        let sessionDate: string = $("p:nth-child(4)>strong:first-child").text().split(" ")[2];

        let votings = $('p:nth-child(12)')[0].children
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
                    id: Parser.hashCode(name + surname + fatherName),
                    name: name,
                    surname: surname,
                    fatherName: fatherName
                };
                if (array[5]) vote += " " + array[5];
                return new Voting(deputy, vote);
            });

        let project: Project = {
            id: Parser.hashCode(votingTime),
            sessionDate: sessionDate,
            votingTime: votingTime,
            title: title,
            votings: votings
        };

        console.log(project);

        return project;
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