"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Downloader_1 = require("./Downloader");
var Parser_1 = require("./Parser");
var Unzipper_1 = require("./Unzipper");
var rxjs_1 = require("rxjs");
/**
 * Created by amatsegor on 6/20/17.
 */
function parseVotingsZip(url) {
    return rxjs_1.Observable.create(function (observer) {
        Downloader_1.Downloader.get(url, function (filePath) {
            Unzipper_1.Unzipper.unzip(filePath)
                .subscribe(function (files) {
                var sessionObjects = [], deputies = [], votings = [], projects = [];
                files.forEach(function (file, index) {
                    Parser_1.Parser.parse(file, index).subscribe(function (session) {
                        sessionObjects.push(session);
                        deputies.push.apply(deputies, session.deputies);
                        votings.push.apply(votings, session.votings);
                        projects.push.apply(projects, session.projects);
                        if (sessionObjects.length == files.length) {
                            var first = sessionObjects[0];
                            var finalSession = {
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
function unique(deputies) {
    if (!deputies || deputies.length == 0)
        return [];
    var uniqueDeps = [];
    var depIds = [];
    deputies.forEach(function (val) {
        if (depIds.indexOf(val._id) < 0) {
            depIds.push(val._id);
            uniqueDeps.push(val);
        }
    });
    return uniqueDeps;
}
//# sourceMappingURL=index.js.map