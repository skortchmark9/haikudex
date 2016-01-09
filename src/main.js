import syllable from 'syllable';
 var wordNet = require('wordnet-magic');
// var wn = wordNet('insert path', preload);

//import {path, files, version} from 'wordnet-db';
var wordNet = require('wordnet-magic')


export function isHaiku(msg, separator = '//') {
	let rows = msg.split(separator).map((str) => str.trim());

	var haikuLength = rows.map(countSyllables).sum();
	if (haikuLength > 17) {
		// what to do if commit is longer than a haiku
	} else if ( haikuLength === 17 ) {
		//just print the haiku ??
	} else {
		// what to do if commit is shorter than a haiku
	}
/*
	var wn = wordNet(null, false);

	console.log(wn instanceof wordNet)

	var white = new wn.Word("white");

	white.getAntonyms().then(function(synsetArray){
		console.log(synsetArray);
	});

	var high = new wn.Word("high");
	high.getAntonyms().then(function(antonymArray){
		console.log(antonymArray);
	})

*/
	return haikuLength === 17;
}

Array.prototype.sum = function() {
  return this.reduce((a, b) => a + b);
};

let countSyllables = function(phrase) {
  let tokens = phrase.split(/\W/);
  return tokens.map(syllable).sum();
};

export function makeHaiku(msg) {
	return msg + ' is a haiku';
}

/*
steps to check if it is a haiku
 1. check syllable length of commit
 2. if longer - > check for haikus in commit..
  a) if haiku -> print done !
  b) if not -> get most of haiku and continue? choose key words and continue?
 3. if shorter -> check syllable counts?
  for what is missing -> fill in rhyme etc. to make up length ?? nonsensical ??
*/
