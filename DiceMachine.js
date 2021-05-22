console.log("Compiling...");
let Discord = require("discord.js");
let bot = new Discord.Client();
let setPath = "./settings.json";
let settings = require(setPath);

function parseCommand(command) {
    let code = command.toLowerCase();
    let finalMessage = "";
    let repeatAmount = 1;
    let modifier = 0;
    if(code.charAt(code.length-2) === 'r') {
        repeatAmount = parseInt(code.charAt(code.length-1));
        code = code.substring(0, code.length-2);
    }
    if(code.indexOf("++") !== -1) {
        modifier = parseInt(code.substring(code.indexOf("++")+2, code.length));
        code = code.substring(0, code.indexOf("++"));
    } else if (code.indexOf("--") !== -1) {
        modifier = 0 - parseInt(code.substring(code.indexOf("--")+2, code.length));
        code = code.substring(0, code.indexOf("--"));
    }
    let rolls = code.split(",");
    for(let i = 0; i < repeatAmount; i++) {
        if(repeatAmount > 1) {
            finalMessage += "---Iteration " + (i+1) + "---\n";
        }
        rolls.forEach(function callback(e) {
            finalMessage += parseRoll(e, modifier);
        })
    }
    return finalMessage;
}

function parseRoll(input, globalModifier) {
    let diceAmount = parseInt(input.substring(0, input.indexOf("d")));
    let diceSides = 0;
    let modifier = 0;
    if(input.indexOf("+") !== -1) {
        diceSides = parseInt(input.substring(input.indexOf("d")+1, input.indexOf("+")));
        modifier = parseInt(input.substring(input.indexOf("+")+1, input.length));
    } else if(input.indexOf("-") !== -1) {
        diceSides = parseInt(input.substring(input.indexOf("d")+1, input.indexOf("-")));
        modifier = 0 - parseInt(input.substring(input.indexOf("-")+1, input.length));
    } else {
        diceSides = parseInt(input.substring(input.indexOf("d")+1, input.length));
    }
    let rollText = "";
    let rollTotal = 0;
    for(let i = 0; i < diceAmount; i++) {
        let roll = rollDie(diceSides);
        rollTotal += roll;
        rollText += "d" + diceSides + "(" + roll + ") | ";
    }
    rollText += "*" + rollTotal + "*" + " | " + "**" + (rollTotal + modifier + globalModifier) + "**" + " \n";
    return rollText;
}

function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

bot.on("message", msg => {
    if(msg.author.bot) {return;}
    if(msg.channel.type !== "dm") {return;}
    msg.channel.send(parseCommand(msg.content));
});

bot.on("ready", () => {
    console.log('I am ready!');
});
bot.login(settings.key).then();