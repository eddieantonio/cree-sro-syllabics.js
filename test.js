import test from 'ava'

let { sro2syllabics, syllabics2sro } = require('./')

const COMBINING_CIRCUMFLEX = '\u0302'

/* Basic, full word tests. */
test('"acimosis" → syllabics', convertRoundTrip, 'acimosis', 'ᐊᒋᒧᓯᐢ')
test('"atahk" → syllabics', convertRoundTrip, 'atahk', 'ᐊᑕᕽ')
test('"mêriy" → syllabics', convertRoundTrip, 'mêriy', 'ᒣᕒᐃᕀ')
test('"wîstihkêw" → syllabics', convertRoundTrip, 'wîstihkêw', 'ᐑᐢᑎᐦᑫᐤ')
test('"nêhiyawêwin" → syllabics', convertRoundTrip, 'nêhiyawêwin', 'ᓀᐦᐃᔭᐍᐏᐣ')
test('"tirêyl" → syllabics', convertRoundTrip, 'tirêyl', 'ᑎᕒᐁᕀᓬ')

/* Spelling relaxation tests. */
test('"Tân\'si" → syllabics', convertToSRO, "Tân'si", 'ᑖᓂᓯ')
test('"Maskekosihk" → syllabics', convertToSRO, 'Maskekosihk', 'ᒪᐢᑫᑯᓯᕽ')

test('Unicode normalization', t => {
  let water = 'nipiy'
  let leaf = 'ni' + COMBINING_CIRCUMFLEX + 'piy'

  t.not(water, leaf)
  t.not(sro2syllabics(water), sro2syllabics(leaf))
  t.is(sro2syllabics(water), 'ᓂᐱᕀ')
  t.is(sro2syllabics(leaf), 'ᓃᐱᕀ')
})

test('word matching', convertSemiRoundTrip, 'obviously english text', 'obviously english text')
test('word matching', convertSemiRoundTrip, 'write nêhiyawêwin', 'write ᓀᐦᐃᔭᐍᐏᐣ')
test('word matching', convertSemiRoundTrip, '\t namoya  tataspêyihtam. ', '\t ᓇᒧᔭ  ᑕᑕᐢᐯᔨᐦᑕᒼ᙮ ')

/**
 * Test macro that tests SRO → syllabics, syllabics → SRO,
 * SRO → syllabics → SRO, and syllabics → SRO → syllabics.
 */
function convertRoundTrip (t, sro, syllabics) {
  // Test simple conversion first.
  t.is(sro2syllabics(sro), syllabics)
  t.is(syllabics2sro(syllabics), sro)
  // Test roundtrip/inverse
  t.is(syllabics2sro(sro2syllabics(sro)), sro)
  t.is(sro2syllabics(syllabics2sro(syllabics)), syllabics)
}

/**
 * Test macro that tests SRO → syllabics and syllabics → SRO.
 * Inverses are not tested.
 */
function convertSemiRoundTrip (t, sro, syllabics) {
  t.is(sro2syllabics(sro), syllabics)
  t.is(syllabics2sro(syllabics), sro)
}

/**
 * Test macro that tests SRO → syllabics.
 */
function convertToSRO (t, sro, syllabics) {
  t.is(sro2syllabics(sro), syllabics)
}
