/// <reference path="../typings/index.d.ts" />

import * as readline from 'readline';
import fs = require("fs");
import { Transaction } from "./Transaction";
import { TransactionList } from "./TransactionList";

var rl = readline.createInterface(process.stdin, process.stdout);
var fileName = process.argv[2] || "data/Transactions2014.csv";
var transactions = new TransactionList(fileName);

console.log("working");

rl.on("line", (line : string) => {
    if (line == "List All") {
        transactions.outputTotals();
    } else if (line.substr(0, 5) == "List ") {
        transactions.outputTransactionsForName(line.substr(5));
    } else {
        console.log("Invalid instruction. Please enter 'List All' or 'List <name>'");
    }
    console.log("");
});

function processData(name : string) : TransactionList {
    return new TransactionList(name);
}
