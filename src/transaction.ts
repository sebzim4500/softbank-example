
export class Transaction {
    public date : Date;
    public from : string;
    public to : string;
    public amount : number;
    public narrative : string;

    constructor (date : Date, from : string, to : string, narrative : string, amount : number) {
        this.date = date;
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = amount;
    }

    public output() {
        if (isNaN(this.date.getTime())) {
            console.log(`At an unknown time, ${this.from} promised to pay £${this.amount} to ${this.to}, for ${this.narrative}.`);
        } else {
            console.log(`On ${dateToString(this.date)}, ${this.from} promised to pay £${this.amount} to ${this.to}, for ${this.narrative}.`);
        }
    }
}

function dateToString(date : Date) : string {
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
}
