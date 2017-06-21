import {Voting} from "../../src/models/Voting";
import {Observable} from "rxjs";
import {Project} from "../../src/models/Project";
import {Deputy} from "./models/Deputy";
/**
 * Created by amatsegor on 5/6/17.
 */

export declare class ProjectTuple {
    project: Project;
    deputies: Deputy[];
}

export declare class Parser {
    static parse(path: string): Observable<ProjectTuple>;
}