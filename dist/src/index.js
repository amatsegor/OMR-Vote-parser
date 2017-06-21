"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Downloader_1 = require("./Downloader");
const Parser_1 = require("./Parser");
const Unzipper_1 = require("./Unzipper");
const rxjs_1 = require("rxjs");
/**
 * Created by amatsegor on 6/20/17.
 */
function parseVotingsZip(url) {
    return rxjs_1.Observable.create(observer => {
        Downloader_1.Downloader.get(url, filePath => {
            Unzipper_1.Unzipper.unzip(filePath)
                .subscribe(files => {
                let sessionObjects = [], deputies = [], votings = [], projects = [];
                files.forEach(file => {
                    Parser_1.Parser.parse(file).subscribe(session => {
                        sessionObjects.push(session);
                        deputies.push(session.deputies);
                        votings.push(session.votings);
                        projects.push(session.projects);
                        if (sessionObjects.length == files.length) {
                            const first = sessionObjects[0];
                            let finalSession = {
                                _id: first._id,
                                title: "",
                                date: first.date,
                                deputies: unique(deputies),
                                votings: votings,
                                projects: projects
                            };
                            observer.next(finalSession);
                        }
                    });
                });
            });
        });
    });
}
exports.parseVotingsZip = parseVotingsZip;
;
function unique(deputies) {
    if (!deputies || deputies.length == 0)
        return [];
    let uniqueDeps = [];
    let depIds = [];
    deputies.forEach(val => {
        if (depIds.indexOf(val._id) < 0) {
            depIds.push(val._id);
            uniqueDeps.push(val);
        }
    });
    return uniqueDeps;
}
//# sourceMappingURL=index.js.map