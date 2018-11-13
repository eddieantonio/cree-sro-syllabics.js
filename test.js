import test from 'ava';

let { sro2syllabics } = require('./');

function convertToSyllabics(t, sro, syllabics) {
  t.is(sro2syllabics(sro), syllabics);
}

test('"acimosis" → syllabics', convertToSyllabics, 'acimosis', 'ᐊᒋᒧᓯᐢ');
