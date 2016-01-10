import {isHaiku, makeHaiku, shortenWord, expandWord, addAdjective, addExpletive, removeWords, adjustPhrase} from './main.js';

function all(arr) {
  return arr.reduce((a, b) => a && b, true);
}


function any(arr) {
  return arr.reduce((a, b) => a || b, false);
}

var haikus = [
  'added packages // hopefully they will not suck // oh hey i can count'
];

var notHaikus = [
  'sup // my // dude!'
];

if (all(haikus.map(isHaiku))) {
  console.log('haikus are haikus');
}

if (any(notHaikus.map(isHaiku))) {
  console.log('thought some not-haikus were haikus');
}

var almostHaikus = [
  'the car ran into a ditch and oil leaked from steaming tires'
];

