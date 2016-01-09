import syllable from 'syllable';
import _ from 'lodash';

const HAIKU_LENGTH = 17;
const separator = '//';
const FOUL = false;

// var wordNet = require('wordnet-magic');
// var wn = wordNet('insert path', preload);

// import {path, files, version} from 'wordnet-db';
// var wordNet = require('wordnet-magic')

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

function addWords(phrase, length) {
  if (FOUL) {
    return addExpletive(phrase, length);
  } else {
    return addAdjective(phrase, length);
  }
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

function countHaikuSyllables(msg) {
  let rows = msg.split(separator).map(str => str.trim());
  return  _.sum(rows.map(countSyllables));
}

function getLines(msg) {
  return msg.split(separator).map(s => s.trim()).map(line => line.split(/\W/));
}

function adjustWord(word, adjustment) {
  if (adjustment > 0) {
    return expandWord(word, adjustment);
  } else if (adjustment < 0) {
    return shortenWord(word, adjustment);
  } else {
    return word;
  }
}

function adjustPhrase(phrase, adjustment) {
  if (adjustment > 0) {
    return addWords(phrase, adjustment);
  } else if (adjustment < 0) {
    return removeWords(phrase, adjustment);
  } else {
    return phrase;
  }
}

function adjustSyllables(msg, adjustment) {
  let lines = getLines(msg);
  let line = 0;
  let idx = 0;
  let token = lines[line][idx];

  // First loop to make small adjustments to existing words' lengths.
  while (adjustment !== 0 && line < 3) {
    let newWord = adjustWord(token, adjustment);
    lines[line][idx] = newWord;

    adjustment -= (newWord.length - token.length);
    lines[line][idx] = token;

    idx++;
    token = lines[line][idx];
    if (!token) {
      line++;
      token = lines[line][idx];
    }
  }

  var joined = lines.map(line => line.join(' '));
  line = 0;

  // Second while loop to add / remove extraneous words
  while (adjustment !== 0 && line < 3) {
    let oldPhrase = joined[line];
    let newPhrase = adjustPhrase(oldPhrase, adjustment);
    joined[line] = newPhrase;
    adjustment -= (countSyllables(newPhrase), countSyllables(oldPhrase));
    line++;
  }

  return joined.join(' ' + separator + ' ');
}

export function isHaiku(msg) {
  return countHaikuSyllables(msg, separator) === HAIKU_LENGTH;
}

export function breakIntoHaiku(msg) {
  var tokens = msg.split(/\W/);
  var rows = [];
  var row = [];
  var rowSyllables = 0;
  var line = 0;
  tokens.forEach(function(token) {
    let syllables = syllable(token);
    if (rowSyllables + syllables > (line === 1 ? 7 : 5)) {
      rows.push(row);
      rowSyllables = 0;
      row = [];
    } else {
      rowSyllables += syllables;
      row.push(token);
    }
  });
}

/**
 * steps to check if it is a haiku
 * 1. check syllable length of commit
 * 2. if longer - > check for haikus in commit..
 *  a) if haiku -> print done !
 *  b) if not -> get most of haiku and continue? choose key words and continue?
 * 3. if shorter -> check syllable counts?
 * for what is missing -> fill in rhyme etc. to make up length ?? nonsensical ??
*/
export function makeHaiku(msg) {
  let syllables = countHaikuSyllables(msg);
  let difference = HAIKU_LENGTH - syllables;

  msg = breakIntoHaiku(msg);
  return adjustSyllables(msg, difference);
}
