import { Transaction } from "./transaction";
import fs = require("fs");

export class TransactionList {
    private transactions : Transaction[];

    constructor (fileName : string) {
        var data = fs.readFileSync(fileName).toString();
        var extension = fileName.split(".")[1].toLowerCase();
        if (extension == "csv") {
            this.fromCSV(data);
        } else if (extension == "json") {
            this.fromJSON(data);
        }
    }

    fromCSV (data : string) {
        var lines = data.split("\n");
        this.transactions = [];
        for (var i = 1; i < lines.length; i++) {
            var line = lines[i];
            if (line == "") {
                continue;
            }
            var [date, from, to, narrative, amount] = line.split(",");
            this.transactions.push(new Transaction(date, from, to, narrative, +amount));
        }
    }

    fromJSON (data : string) {
        var items = JSON.parse(data);
        for (var i = 0; i < item.length; i++) {
            var item = items[i];
            this.transactions.push(new Transaction(item.Date, item.FromAccount, item.ToAccount, item.Narrative, item.Amount));
        }
    }

    public outputTotals() {
        var map : { [key : string] : number } = {};
        for (var i=0; i < this.transactions.length; i++) {
            var transaction = this.transactions[i];
            map[transaction.from] = map[transaction.from] || 0;
            map[transaction.from] -= transaction.amount;
            map[transaction.to] = map[transaction.to] || 0;
            map[transaction.to] += transaction.amount;
        }
        for (var name in map) {
            if (map[name] == 0) {
                console.log(`${name} owes exactly as much as he/she is owed`);
            } else if (map[name] > 0) {
                console.log(`${name} is owed £${map[name].toPrecision(4)} more than he/she owes`);
            } else {
                console.log(`${name} owes £${map[name].toPrecision(4)} more than he/she is owed`);
            }
        }
    }

    public outputTransactionsForName(name : string) {
        for (var i = 0; i < this.transactions.length; i++) {
            var transaction = this.transactions[i];
            if (transaction.from == name || transaction.to == name) {
                transaction.output();
            }
        }
    }
}