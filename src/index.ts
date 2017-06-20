import {Downloader} from "./Downloader";
import {Parser} from "./Parser";
import {Unzipper} from "./Unzipper";
import {Observable} from "rxjs";
/**
 * Created by amatsegor on 6/20/17.
 */

export let parseVotingsZip = function(url: string): Observable<string> {
    return Observable.create(observer => {
        Downloader.get(url, filePath => {
            Unzipper.unzip(filePath)
                .subscribe(file => {
                    Parser.parse(file).subscribe(json => observer.next(json))
                })
        })
    })
};