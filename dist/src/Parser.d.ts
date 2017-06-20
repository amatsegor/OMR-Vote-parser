import {Vote} from "../../src/Vote";
import {Observable} from "rxjs";
/**
 * Created by amatsegor on 5/6/17.
 */

export declare class Parser {

    static parse(path: string): Observable<string>;

    parseRtfFile(filePath: string): Promise<string>;

    private readFile(filePath: string): Promise<number[]>;

    private parseJson(array: any[]): Vote[];

    private bin2String(array: number[]): string;
}