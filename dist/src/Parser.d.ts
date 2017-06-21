import {Observable} from "rxjs";
import {Session} from "./models/Session";

export declare class Parser {
    static parse(path: string): Observable<Session>;
}