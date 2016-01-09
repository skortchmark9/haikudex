import syllable from 'syllable';
//var wordNet = require('wordnet-magic');
// var wn = wordNet('insert path', preload);

import {path, files, version} from 'wordnet-db';
var wordNet = require('wordnet-magic')

export function isHaiku(msg, separator = '//') {
	let [l1, l2, l3] = msg.split(separator).map((str) => str.trim());
	let phraseVar = '';

	console.log(l1, l2, l3);
	console.log(countSyllables(l1));
	console.log(countSyllables(l2));
	console.log(countSyllables(l3));

	let wn = wnm(path, false);
	wn.isNoun("callback", function(err, data) {
		console.log(data);
	})

});

	if (countSyllables( phraseVar ) > 17) {
		// what to do if commit is longer than a haiku
	} else if (countSyllables ( phraseVar ) === 17 ){
		//just print the haiku ??
		console.log(phraseVar);
	} else {
		// what to do if commit is shorter than a haiku
	}

	return true;
};

let countSyllables = function ( phrase ) {
	return syllable(phrase);
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

