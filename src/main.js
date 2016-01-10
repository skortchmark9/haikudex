import syllable from 'syllable';
import _ from 'lodash';
import wordnet from 'wordnet';
var $ = require('jquery-deferred');
import stopwords from './data/stopwords.js';
import descriptors from './data/descriptors.js';
import cusseth from './data/cusseth.js';
import nouns from './data/nouns.js';

let adjectives = descriptors.map(word => [word, syllable(word)]);
let curses = cusseth.map(word => [word, syllable(word)]);

const HAIKU_LENGTH = 17;
const separator = '//';
const FOUL = true;

// var wordNet = require('wordnet-magic');
// var wn = wordNet('insert path', preload);

// import {path, files, version} from 'wordnet-db';

// Chrys' Domain

function addModifier(phrase, length, mod) {
  let tokens = phrase.split(/\W/);
  let nounList = tokens.map(word => _.contains(nouns, word));

  for (var i in nounList) {
    if (nounList[i]) {
      tokens.splice(i, 0, mod);
      return tokens.join(' ');
    }
  }

  return mod + ' ' + phrase;
}

export function addExpletive(phrase, length) {
  var curse = _.sample(curses.filter(tuple => tuple[1] === length))[0];
  return addModifier(phrase, length, curse);
}

export function addAdjective(phrase, length) {
  var adj = _.sample(adjectives.filter(tuple => tuple[1] === length))[0];
  return addModifier(phrase, length, adj);
}

export function removeWords(phrase, length) {
  let tokens = phrase.split(/\W/);
  let newTokens = [];
  tokens.forEach(function(token) {
    if (length && _.contains(stopwords, token)) {
      length -= syllable(token);
    } else {
      newTokens.push(token);
    }
  });

  return newTokens;
}

function addWords(phrase, length) {
  if (FOUL) {
    return addExpletive(phrase, length);
  } else {
    return addAdjective(phrase, length);
  }
}

// Nicole WUZ HERE
export function shortenWord(word, adjustment) {
  console.log(word);
  let possibleNewWord = [];
  let theNewWord;
  let newWordSyllables;
  let adjustedList;
  let otheradjustednotasgoodList;
  let currentWordSyllables = countSyllables(word);

  adjustment = -adjustment;

  let list = []

  //abstract this 
  possibleSynonymArray(word).then(
    function(response) {

      response.forEach(function(possNewWord) {
        newWordSyllables = countSyllables(possNewWord);
        list.push([possNewWord, newWordSyllables]);
      });

      adjustedList = list.filter(synonym => synonym[1] - currentWordSyllables === adjustment);
      console.log(adjustedList[0][0]);
      if (!_.isEmpty(adjustedList)) {
        return adjustedList[0][0];
      }

      else {
        otheradjustednotasgoodList = list.filter(synonym => (synonym[1] - currentWordSyllables > adjustment) && (synonym[1] < currentWordSyllables));
      }

      if (!_.isEmpty(otheradjustednotasgoodList)) {
        return otheradjustednotasgoodList[0][0]
      } else {
        console.log(word);
        return word;
      }

    });
}


/*
      mappedmapmap._pick(mappedmapmap, function(value, key, object) {
        return 
      }
        return (if mappedmapmap[] - currentWorldSyllables === adjustment) })

/*
        if (newWordSyllables - currentWorldSyllables === adjustment) {
          theNewWord = possNewWord;
          return theNewWord;
        } 


          ///else if gone through that's not happening then

          if ((newWordSyllables - currentWorldSyllables) > adjustment && (newWordSyllables < currentWorldSyllables)) {
            theNewWord = possNewWord;
            return theNewWord;
          }

          return currentWorldSyllables
          */
 //       });


function possibleSynonymArray(word) {
  var promise = $.Deferred();

  var possibleNewWords = [];
  wordnet.lookup(word, function(err, definitions) {
    if (definitions) {
      definitions.forEach(function(definition) {
        var words = definition.meta.words;
        words.forEach(function(word) {
          if (!_.includes(possibleNewWords, word.word)) { 
            possibleNewWords.push(word.word);
          }
        })
      });
    }
    promise.resolve(possibleNewWords);
  })
  return promise;
}

function expandWord(word, maxExpansion) {
  return word;
}

let countSyllables = function(phrase) {
  let tokens = phrase.split(/\W/);
  return _.sum(tokens.map(syllable));
};

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
  return countSyllables(msg, separator) === HAIKU_LENGTH;
}

export function breakIntoHaiku(msg) {
  var tokens = msg.trim().split(/\W/);
  var rows = [[], [], []];
  var rowSyllables = 0;
  var line = 0;
  while (tokens.length) {
    let token = tokens.shift();
    let tokenLength = syllable(token);

    if (line === 0) {
      var diff = (rowSyllables + tokenLength) - 5;
      if (diff > 0) {
        line += 1;
        rowSyllables = 0;
      }

    } else if (line === 1) {

      var diff = (rowSyllables + tokenLength) - 7;
      if (diff > 0) {
        line += 1;
        rowSyllables = 0;
      }

    }

    rowSyllables += tokenLength;
    rows[line].push(token);

  }

  return rows;
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
  let syllables = countSyllables(msg);
  let difference = HAIKU_LENGTH - syllables;

  msg = breakIntoHaiku(msg);
  return adjustSyllables(msg, difference);
}