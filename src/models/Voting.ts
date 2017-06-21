import {Deputy} from "./Deputy";
/**
 * Created by amatsegor on 5/6/17.
 */

export class Voting {
    deputy: Deputy;
    vote: string;

    constructor(deputy: Deputy, vote: string) {
        this.deputy = deputy;
        this.vote = vote;
    }
}