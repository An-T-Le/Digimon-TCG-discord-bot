var Discord = require('discord.io');
var SEARCH = "https://digimoncard.io/api/search.php?";
var LIMIT = "limit=";
var NAME = "&n=";
var COLOUR = "color=";
var SERIES = "&series=Digimon%20Card%20Game";
var SORT = "&sort=";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var CARD_LINK = 'https://digimoncard.io/card/?search=';
var SEARCH_CARD = 'https://digimoncard.io/api/search.php?card=';
var DECK_SEARCH = 'https://digimoncard.io/api/decks/getDecks.php?&cardcode=';
var DECK_LINK = 'https://digimoncard.io/deck/?deckid=';
module.exports = {

    BuildQuery: function (cmd, query, bot, channelID) {
        switch (cmd) {
            case 'search':
            case 'quick':
                query = SEARCH + LIMIT + "100" + NAME + query + SERIES + SORT + "name";
                // console.log(SEARCH + LIMIT + "100" + NAME + query + SERIES + SORT + "name");
                // HTTPRequestServer(cmd, SEARCH + LIMIT + "100" + NAME + query + SERIES + SORT + "name", bot, channelID);
                break;
            case 'card':
                query = SEARCH_CARD + query;
                break;
            case 'deck':
                query = DECK_SEARCH + query;
                break;
            default:
                return;

        }
        console.log(query);
        HTTPRequestServer(cmd, query, bot, channelID);
    }
}

function HTTPRequestServer(command, query, bot, channelID) {

    let request = new XMLHttpRequest();
    request.open("GET", query);
    request.send();
    request.onload = () => {
        if (request.status === 200) {
            //return(request.response);
            var recievedText = request.responseText;
            //console.log(request.responseText.split(','));
            //console.log(recievedText);
            console.log(JSON.parse(recievedText));
            var stringify = JSON.stringify(JSON.parse(recievedText));
            var recievedJSON = JSON.parse(recievedText);
            console.log(stringify);
            if (stringify.length > 0) {
                switch (command) {
                    case 'search':
                        bot.sendMessage({
                            to: channelID,
                            //message: 'Searching for '+query + '\n```'+JSON.parse(recievedText)[0]['name']+'```'
                            message: SearchResultParse(recievedJSON)
                        });
                        break;
                    case 'card':
                        bot.sendMessage({
                            to: channelID,
                            //message: 'Searching for '+query + '\n```'+JSON.parse(recievedText)[0]['name']+'```'
                            message: CardResultParse(recievedJSON)
                        });
                        break;
                    case 'deck':
                        bot.sendMessage({
                            to: channelID,
                            //message: 'Searching for '+query + '\n```'+JSON.parse(recievedText)[0]['name']+'```'
                            message: DeckResultParse(recievedJSON)
                        });
                        break;
                        case 'quick':
                            bot.sendMessage({
                                to: channelID,
                                //message: 'Searching for '+query + '\n```'+JSON.parse(recievedText)[0]['name']+'```'
                                message: QuickResultParse(recievedJSON)
                            });
                            break;
                }
                return stringify;
            }
            else {
                bot.sendMessage({
                    to: channelID,
                    //message: 'Searching for '+query + '\n```'+JSON.parse(recievedText)[0]['name']+'```'
                    message: '```NOT FOUND```'
                });
                return "NOT FOUND";
            }
        }
        else {
            bot.sendMessage({
                to: channelID,
                //message: 'Searching for '+query + '\n```'+JSON.parse(recievedText)[0]['name']+'```'
                message: '```NOT FOUND```'
            });
            return "NOT FOUND";
        }
    }

}

function SearchResultParse(JSONResults) {
    var text = '';

    JSONResults.forEach(element => {
        text += CARD_LINK + element['cardnumber'] + '\n```' +
            'Name:' + element['name'] + '\n' +
            'Colour:' + element['color'] + '\n' +
            'Type:' + element['type'] + '\n'
        if (element['type'] != 'Digi-Egg') {
            text += 'Cost:' + element['play_cost'] + '\n';
        }
        if (element['type'] === 'Digimon') {
            text +=
                'DP:' + element['dp'] + '\n';
        }
        text += (element['maineffect']) ? 'Main Effect:' + element['maineffect'] + '\n' : '';
        text += (element['soureeffect']) ? 'Secondary Effect:' + element['soureeffect'] + '\n' : '';

        text += '```\n';
    })

    //text+='```';
    console.log(text);
    if (text.length > 2000) {
        text = text.substring(0, 1990);
        text += '```';
    }

    return text;
}

function CardResultParse(JSONResults) {
    var text = '';

    JSONResults.forEach(element => {
        text += CARD_LINK + element['cardnumber'] + '\n```' +
            'Name:' + element['name'] + '\n' +
            'Colour:' + element['color'] + '\n' +
            'Type:' + element['type'] + '\n'
        if (element['type'] != 'Digi-Egg') {
            text += 'Cost:' + element['play_cost'] + '\n';
        }
        if (element['type'] === 'Digimon') {
            text += 'Stage:' + element['stage'] + '\n' +
                'Attribute:' + element['attribute'] + '\n' +
                'Level:' + element['level'] + '\n' +
                'Evolution Cost:' + element['evolution_cost'] + '\n' +
                'DP:' + element['dp'] + '\n';
        }
        text += (element['maineffect']) ? 'Main Effect:' + element['maineffect'] + '\n' : '';
        text += (element['soureeffect']) ? 'Secondary Effect:' + element['soureeffect'] + '\n' : '';
        text += 'Card Sets:' + element['card_sets'] + '\n' +
            '```\n';
    })

    //text+='```';
    console.log(text);
    if (text.length > 2000) {
        text = '```EXCEEDED MESSAGE LIMIT```'
    }

    return text;
}

function DeckResultParse(JSONResults) {
    var text = '';

    JSONResults.forEach(element => {
        text += DECK_LINK + element['deckNum'] + '\n```' +
            'Name:' + element['deck_name'] + '\n' +
            'Main Colour:' + element['primary_color'] + '\n' +
            '```\n';
    })

    //text+='```';
    console.log(text);
    if (text.length > 2000) {
        text = '```EXCEEDED MESSAGE LIMIT```'
    }

    return text;
}
function QuickResultParse(JSONResults) {
    var text = '';

    JSONResults.forEach(element => {
        text += CARD_LINK + element['cardnumber'] + '\n';
    })

    //text+='```';
    console.log(text);
    if (text.length > 2000) {
        text = text.substring(0, 1980);
        text += '```EXCEEDED MESSAGE LIMIT```';
    }

    return text;
}