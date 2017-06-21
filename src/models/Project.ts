import {Voting} from "./Voting";
/**
 * Created by amatsegor on 6/21/17.
 */

export class Project {
    _id: number;
    title: string;
    sessionDate: string;
    votingTime: string;
    votings: Voting[];
}