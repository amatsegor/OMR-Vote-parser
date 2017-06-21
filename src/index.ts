import {Downloader} from "./Downloader";
import {Parser, ProjectTuple} from "./Parser";
import {Unzipper} from "./Unzipper";
import {Observable} from "rxjs";
import {Voting} from "./models/Voting";
import {Project} from "./models/Project";
/**
 * Created by amatsegor on 6/20/17.
 */

export let parseVotingsZip = function(url: string): Observable<ProjectTuple[]> {
    return Observable.create(observer => {
        Downloader.get(url, filePath => {
            Unzipper.unzip(filePath)
                .subscribe(files => {
                    let array = [];
                    files.forEach(file => {
                        Parser.parse(file).subscribe(project => {
                            array.push(project);
                            if (array.length == files.length){
                                observer.next(array);
                            }
                        })
                    });
                })
        })
    })
};