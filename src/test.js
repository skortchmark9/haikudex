import {isHaiku} from './main.js';

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
