import syllable from 'syllable';
import _ from 'lodash';
// var wordNet = require('wordnet-magic');
// var wn = wordNet('insert path', preload);

//import {path, files, version} from 'wordnet-db';
//var wordNet = require('wordnet-magic')


export function isHaiku(msg, separator = '//') {
	let rows = msg.split(separator).map((str) => str.trim());

	var haikuLength = _.sum(rows.map(countSyllables));
  return haikuLength === 17;
}

// Sam's club
export function makeHaiku(msg) {
  while(!isHaiku(msg)) {
    var difference = haikuLength - msg.length;
    var word;
    if (difference > 0) {
      shortenToken(word, difference)
    } else {
      expandToken(word, difference)
    }

  }

  return msg;
}


// Chrys' Domain
function addExpletive(phrase, length) {
  return phrase;
}

function addAdjective(phrase, length) {
  return phrase;
}

function removeWords(phrase, length) {
  return phrase;
}

// Nicole WUZ HERE
function shortenWord(word, maxShortening) {
  return word;
}

function expandWord(word, maxExpansion) {
  // try to find a synonym with a longer syllable count
  return word;
}

let countSyllables = function(phrase) {
  let tokens = phrase.split(/\W/);
  return _.sum(tokens.map(syllable));
};

/*
steps to check if it is a haiku
 1. check syllable length of commit
 2. if longer - > check for haikus in commit..
  a) if haiku -> print done !
  b) if not -> get most of haiku and continue? choose key words and continue?
 3. if shorter -> check syllable counts?
  for what is missing -> fill in rhyme etc. to make up length ?? nonsensical ??
*/
