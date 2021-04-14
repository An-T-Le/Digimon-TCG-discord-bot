var webscrap = require('./scripts/webscrap');
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

var HELP_MESSAGE =  '```!search TEXT_TO_SEARCH  \n'+
'Returns all names containing text within 2000 character limit \n'+
'!card CARD_NUMBER \n'+
'Returns all details about The card number\n'+
'!deck CARD_NUMBER \n'+
'Shows all decks containing the card number\n'+
'!quick TEXT_TO_SEARCH \n'+
'Returns all card urls containing text within 2000 character limit \n'+
'```';
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: HELP_MESSAGE
                });
                break;
            case 'search':
            case 'card':
            case 'deck': 
            case 'quick':   
                webscrap.BuildQuery(cmd,args[0],bot,channelID);
                break;
            // Just add any case commands if you want to..
         }
     }
});