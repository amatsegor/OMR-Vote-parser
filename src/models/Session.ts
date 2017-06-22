import {Project} from "./Project";
import {Voting} from "./Voting";
import {Deputy} from "./Deputy";
/**
 * Created by amatsegor on 6/21/17.
 */

export class Session {
    _id: number;
    title: string;
    date: string;
    projects: Project[];
    votings: Voting[];
    deputies: Deputy[];
}