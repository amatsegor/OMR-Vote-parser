import {Observable} from "rxjs";
import {Session} from "./models/Session";

export declare class Parser {
    private index: number;

    constructor(index: number);

    static parse(path: string, index: number): Observable<Session>;
}