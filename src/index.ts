import {Downloader} from "./Downloader";
import {Parser} from "./Parser";
import {Unzipper} from "./Unzipper";
import {Observable} from "rxjs";
import {Session} from "./models/Session";
import {Deputy} from "./models/Deputy";
/**
 * Created by amatsegor on 6/20/17.
 */

export function parseVotingsZip(url: string): Observable<Session> {
    return Observable.create(observer => {
        Downloader.get(url)
            .then(filePath => Unzipper.unzip(filePath))
            .then(files => {
                let sessionObjects = [], deputies = [], votings = [], projects = [];
                let absents = [];
                files.forEach((file, index) => {
                    Parser.parse(file, index).subscribe(session => {
                        session.projects[0].absentDeps
                            .forEach(val => {
                                let absentRecord = absents[val];
                                if (absentRecord) {
                                    absents[val]++;
                                } else {
                                    absents[val] = 1
                                }
                            });
                        sessionObjects.push(session);
                        deputies.push.apply(deputies, session.deputies);
                        votings.push.apply(votings, session.votings);
                        projects.push.apply(projects, session.projects);
                        if (sessionObjects.length == files.length) {

                            let absentIds = [];
                            absents.map((value, index) => {
                                if (value == projects.length) {
                                    absentIds.push(index)
                                }
                            });

                            const first = sessionObjects[0];
                            let finalSession: Session = {
                                _id: first._id,
                                title: "",
                                date: first.date,
                                deputies: unique(deputies),
                                votings: votings,
                                projects: projects,
                                absentDeputies: absentIds
                            };
                            observer.next(finalSession);
                        }
                    })
                });
            })
    })
}


function unique(deputies: Deputy[]): Deputy[] {
    if (!deputies || deputies.length == 0) return [];
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