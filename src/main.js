

export function isHaiku(msg, separator = '//') {
	let [l1, l2, l3] = msg.split(separator).map((str) => str.trim());
	console.log(l1, l2, l3);
	return true;
};

export function makeHaiku(msg) {
	return msg + ' is a haiku';
}