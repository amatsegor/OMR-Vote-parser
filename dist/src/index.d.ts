import {Observable} from "rxjs";
import {Project} from "./models/";
/**
 * Created by amatsegor on 6/20/17.
 */

export let parseVotingsZip = function (url: string): Observable<Project[]>;