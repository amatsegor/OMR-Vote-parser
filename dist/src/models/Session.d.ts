import {Project} from "./Project";
import {Voting} from "./Voting";
import {Deputy} from "./Deputy";
/**
 * Created by amatsegor on 6/21/17.
 */

export declare class Session {
    _id: string;
    title: string;
    date: string;
    projects: Project[];
    votings: Voting[];
    deputies: Deputy[];
}