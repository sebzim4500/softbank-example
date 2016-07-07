import { Transaction } from "./transaction";
import fs = require("fs");
import cheerio = require("cheerio");

export class TransactionList {
    private transactions : Transaction[];

    constructor (fileName : string) {
        var data = fs.readFileSync(fileName).toString();
        var extension = fileName.split(".")[1].toLowerCase();
        if (extension == "csv") {
            this.fromCSV(data);
        } else if (extension == "json") {
            this.fromJSON(data);
        } else if (extension == "xml") {
            this.fromXML(data);
        } else {
            this.transactions = [];
            console.log("Unknown file extension: " + extension);
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
            var [date_str, from, to, narrative, amount] = line.split(",");
            var date = getDateForCSV(date_str);
            this.transactions.push(new Transaction(date, from, to, narrative, +amount));
        }
    }

    fromJSON (data : string) {
        var items = JSON.parse(data);
        this.transactions = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            this.transactions.push(new Transaction(new Date(item.Date), item.FromAccount, item.ToAccount, item.Narrative, item.Amount));
        }
    }

    fromXML (data : string) {
        var $ = cheerio.load(data);
        var children = $("TransactionList").children();
        this.transactions = [];
        for (var i = 0; i < children.length; i++) {
            var child = $(children[i]);
            var date = child.attr("date");
            var narrative = child.find("description").text();
            var from = child.find("From").text();
            var to = child.find("To").text();
            var amount = +child.find("Value").text();
            this.transactions.push(new Transaction(getDateForXML(date), from, to, narrative, amount));
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
                console.log(`${name} owes £${(-map[name]).toPrecision(4)} more than he/she is owed`);
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

function getDateForCSV(str : string) : Date {
    var [day, month, year] = str.split("/");
    return new Date(+year, +month-1, +day);
}

function getDateForXML(str : string) : Date {
    var epoch = new Date("1900-01-01").getTime();
    return new Date(epoch + ((+str) * 60 * 60 * 24 * 1000));
}