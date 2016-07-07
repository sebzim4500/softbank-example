
export class Transaction {
    public date : string;
    public from : string;
    public to : string;
    public amount : number;
    public narrative : string;

    constructor (date : string, from : string, to : string, narrative : string, amount : number) {
        this.date = date;
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = amount;
    }

    public output() {
        console.log(`On ${this.date}, ${this.from} promised to pay £${this.amount} to ${this.to}, for ${this.narrative}.`);
    }
}
