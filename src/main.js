import syllable from 'syllable';
import _ from 'lodash';
import wordnet from 'wordnet';
var $ = require('jquery-deferred');
import stopwords from './data/stopwords.js';
import descriptors from './data/descriptors.js';
import cusseth from './data/cusseth.js';
import nouns from './data/nouns.js';
import thesaurus from './data/thesaurus.js';




let adjectives = descriptors.map(word => [word, syllable(word)]);
let curses = cusseth.map(word => [word, syllable(word)]);

const HAIKU_LENGTH = 17;
const separator = '//';
const FOUL = false;

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
  var curse = _.sample(curses.filter(tuple => tuple[1] === length));
  if (!curse) {
    return addExpletive(addExpletive(phrase, length - 1), 1);
  }

  return addModifier(phrase, length, curse[0]);
}

export function addAdjective(phrase, length) {
  var adj = _.sample(adjectives.filter(tuple => tuple[1] === length));
  if (!adj) {
    return addAdjective(addAdjective(phrase, length - 1), 1);
  }

  return addModifier(phrase, length, adj[0]);
}







export function removeWords(phrase, length) {
  length *= -1;
  let tokens = phrase.split(/\W/);
  let newTokens = [];
  tokens.forEach(function(token) {
    if (length && _.contains(stopwords, token)) {
      length -= syllable(token);
    } else {
      newTokens.push(token);
    }
  });

  return newTokens.join(' ');
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
  let possibleNewWord = [];
  let theNewWord;
  let newWordSyllables;
  let adjustedList;
  let otheradjustednotasgoodList;
  let currentWordSyllables = syllable(word);

  adjustment = -adjustment;

  let list = []

  var response = possibleSynonymArray(word);

  if (!_.isEmpty(response)) {
    for (let x=0; x<response.length; x++) {
      list[x] = [response[x], syllable(response[x])]
    }

    adjustedList = list.filter(synonym => synonym[1] - currentWordSyllables === adjustment);
    
    if (!_.isEmpty(adjustedList)) {
      return adjustedList[0][0];
    }

    else {
      otheradjustednotasgoodList = list.filter(synonym => (synonym[1] - currentWordSyllables > adjustment) && (synonym[1] < currentWordSyllables)).sort(function(a, b) {return a[1]-b[1]});
    }

    if (!_.isEmpty(otheradjustednotasgoodList)) {
      return otheradjustednotasgoodList[0][0]
    } else {
      return word;
    }
  } else {
    return word;
  }

}



function possibleSynonymArray(word) {
  if (thesaurus[word]) {
    return thesaurus[word];
  }
}

function possibleSynonymArrayAsync(word) {
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
        });
      });
    }
    promise.resolve(possibleNewWords);
  });
  return promise;
}




export function expandWord(word, adjustment) {
  let possibleNewWord = [];
  let theNewWord;
  let newWordSyllables;
  let adjustedList;
  let otheradjustednotasgoodList;
  let currentWordSyllables = syllable(word);
  let list = []

  var response = possibleSynonymArray(word);

  if (!_.isEmpty(response)){
    for (let x=0; x<response.length; x++) {
      list[x] = [response[x], syllable(response[x])]
    }

    adjustedList = list.filter(synonym => synonym[1] - currentWordSyllables === adjustment);
    if (!_.isEmpty(adjustedList)) {
      return adjustedList[0][0];
    } else {
      otheradjustednotasgoodList = list.filter(synonym => (synonym[1] - currentWordSyllables < adjustment) && (synonym[1] > currentWordSyllables)).sort(function(a, b) {return b[1]-a[1]});
    } 

    if (!_.isEmpty(otheradjustednotasgoodList)) {
      return otheradjustednotasgoodList[0][0]
    } else {
      return word;
    }
  } else {
    return word;
  }
}

let countSyllables = function(phrase) {
  let tokens = phrase.split(/\W/);
  return _.sum(tokens.map(syllable));
};

function adjustWord(word, adjustment) {
  if (adjustment > 0) {
    return expandWord(word, adjustment);
  } else if (adjustment < 0) {
    return shortenWord(word, adjustment);
  } else {
    return word;
  }
}

export function adjustPhrase(phrase, adjustment) {
  if (adjustment > 0) {
    return addWords(phrase, adjustment);
  } else if (adjustment < 0) {
    return removeWords(phrase, adjustment);
  } else {
    return phrase;
  }
}

function adjustSyllables(lines, adjustment) {
  let line = 0;
  let idx = 0;
  let token = lines[line][idx];

  // First loop to make small adjustments to existing words' lengths.
  while (adjustment !== 0 && line < 3) {
    let newWord = adjustWord(token, adjustment);
    console.log(newWord);

    if (newWord) {
      lines[line][idx] = newWord;
      adjustment -= (syllable(newWord) - syllable(token));
    }

    idx++;
    token = lines[line][idx];
    if (!token) {
      line++;
      idx = 0;
      if (line > 2) {
        break;
      }
      token = lines[line][idx];

    }
  }




  var joined = lines.map(line => line.join(' '));
  line = 0;
  console.log(adjustment);

  // Second while loop to add / remove extraneous words
  while (adjustment !== 0 && line < 3) {
    let oldPhrase = joined[line];
    let lineCount = countSyllables(oldPhrase);

    if (lineCount === (line === 1 ? 7 : 5)) {
      line++;
    } else {
      var newPhrase;
      var maxLineAdjustment = (line === 1) ? 7 : 5;
      var lineAdjustment;

      if (adjustment < 0) {
        maxLineAdjustment *= -1;
        lineAdjustment = adjustment < maxLineAdjustment ?  maxLineAdjustment : adjustment;
        // lineAdjustment += lineCount;
      } else if (adjustment > 0) {
        lineAdjustment = adjustment > maxLineAdjustment ? maxLineAdjustment : adjustment;
        lineAdjustment -= lineCount;
        console.log('line', oldPhrase, lineCount, lineAdjustment);
      }


      newPhrase = adjustPhrase(oldPhrase, lineAdjustment);

      joined[line] = newPhrase;
      adjustment -= (countSyllables(newPhrase) - countSyllables(oldPhrase));
      line++;
    }

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