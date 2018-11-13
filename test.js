import test from 'ava'

let { sro2syllabics, syllabics2sro } = require('./')

/* Basic, full word tests. */
test('"acimosis" → syllabics', convertRoundTrip, 'acimosis', 'ᐊᒋᒧᓯᐢ')
test('"atahk" → syllabics', convertRoundTrip, 'atahk', 'ᐊᑕᕽ')
test('"mêriy" → syllabics', convertRoundTrip, 'mêriy', 'ᒣᕒᐃᕀ')
test('"wîstihkêw" → syllabics', convertRoundTrip, 'wîstihkêw', 'ᐑᐢᑎᐦᑫᐤ')
test('"nêhiyawêwin" → syllabics', convertRoundTrip, 'nêhiyawêwin', 'ᓀᐦᐃᔭᐍᐏᐣ')
test('"tirêyl" → syllabics', convertRoundTrip, 'tirêyl', 'ᑎᕒᐁᕀᓬ')

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
