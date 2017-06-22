import {VotingResult} from "./VotingResult";
/**
 * Created by amatsegor on 6/21/17.
 */

export class Project {
    _id: number;
    title: string;
    votingResult: VotingResult;
    projectNumber: string;
    orderInSession: number;
    sessionDate: string;
    votingTime: string;
    votingIds: number[];
    html: string;
}