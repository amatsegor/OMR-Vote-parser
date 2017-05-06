/**
 * Created by amatsegor on 5/6/17.
 */

export class Vote{
    id: number;
    name: string;
    vote: string;


    constructor(id: number, name: string, vote: string) {
        this.id = id;
        this.name = name;
        this.vote = vote;
    }
}