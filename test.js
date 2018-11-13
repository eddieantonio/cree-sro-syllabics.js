import test from 'ava'

let { sro2syllabics, syllabics2sro } = require('./')

function convertRoundTrip (t, sro, syllabics) {
  t.is(sro2syllabics(sro), syllabics)
  t.is(syllabics2sro(syllabics), sro)
}

/* Basic, full word tests. */
test('"acimosis" → syllabics', convertRoundTrip, 'acimosis', 'ᐊᒋᒧᓯᐢ')
test('"atahk" → syllabics', convertRoundTrip, 'atahk', 'ᐊᑕᕽ')
test('"mêriy" → syllabics', convertRoundTrip, 'mêriy', 'ᒣᕒᐃᕀ')
test('"wîstihkêw" → syllabics', convertRoundTrip, 'wîstihkêw', 'ᐑᐢᑎᐦᑫᐤ')
test('"nêhiyawêwin" → syllabics', convertRoundTrip, 'nêhiyawêwin', 'ᓀᐦᐃᔭᐍᐏᐣ')
test('"tirêyl" → syllabics', convertRoundTrip, 'tirêyl', 'ᑎᕒᐁᕀᓬ')
