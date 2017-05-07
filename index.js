'use strict';
var Alexa = require('alexa-sdk');
var request = require('request');
var cheerio = require('cheerio');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var $, titles, contents, responseSpeech, repromptSpeech, index, numberOfStories;

var handlers = {
    'LaunchRequest': function () {
        index = 0;
        this.emit('Start');
    }, 
    
    'Start': function () {
        scrape(this);     
     },
     
    'Stories': function() {
        makeResponse(this, numberOfStories);
    },
    
    'Unhandled': function() {
        this.emit(':tell', 'HELP!');
    }
};

function scrape(caller) {  
    var url = 'https://westerntoday.wwu.edu/news';
    
    request(url, function (error, response, body) {  	    
  	    $ = cheerio.load(body);
  	    titles = [ 
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-1 > .views-field-title > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-2 > .views-field-title > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-3 > .views-field-title > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-4 > .views-field-title > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-5 > .views-field-title > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-6 > .views-field-title > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-7 > .views-field-title > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-8 > .views-field-title > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-9 > .views-field-title > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-10 > .views-field-title > .field-content').text()
  	    ];  	   
  	    
  	    contents = [ 
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-1 > .views-field-body > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-2 > .views-field-body > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-3 > .views-field-body > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-4 > .views-field-body > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-5 > .views-field-body > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-6 > .views-field-body > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-7 > .views-field-body > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-8 > .views-field-body > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-9 > .views-field-body > .field-content').text(),
  	    $('.view-display-id-panel_pane_2').find('.view-content > .views-row-10 > .views-field-body > .field-content').text()
  	    ];  
  	    numberOfStories = Math.min(titles.length, contents.length);	    	      	      
  	    caller.emit('Stories');
  	});	
}

function makeResponse(caller, numberOfStories) {
    responseSpeech = '';
    repromptSpeech = 'Please say that again?';   
  	    	    
  	if (numberOfStories > 0) {
  	    responseSpeech = 'Ok, here are the most recent news stories from Western Today. . ';
  	    for (var i = 0; i < numberOfStories; i++) {
  	        responseSpeech += titles[i] + ' ' + contents[i] + ' '; 	        
  	    }	     
  	    responseSpeech += 'Thanks for listening. There are more stories available at Western Todays website.';
  	    caller.emit(':tell', responseSpeech);   
  	} else {
  	    responseSpeech = 'There are no news stories to tell you at the moment.';
  	    caller.emit(':tell', responseSpeech);
  	} 	
}



