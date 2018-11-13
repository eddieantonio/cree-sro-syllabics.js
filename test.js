import test from 'ava'

let { sro2syllabics } = require('./')

function convertToSyllabics (t, sro, syllabics) {
  t.is(sro2syllabics(sro), syllabics)
}

test('"acimosis" → syllabics', convertToSyllabics, 'acimosis', 'ᐊᒋᒧᓯᐢ')
test('"atahk" → syllabics', convertToSyllabics, 'atahk', 'ᐊᑕᕽ')
test('"mêriy" → syllabics', convertToSyllabics, 'mêriy', 'ᒣᕒᐃᕀ')
test('"wîstihkêw" → syllabics', convertToSyllabics, 'wîstihkêw', 'ᐑᐢᑎᐦᑫᐤ')
test('"nêhiyawêwin" → syllabics', convertToSyllabics, 'nêhiyawêwin', 'ᓀᐦᐃᔭᐍᐏᐣ')
test('"tirêyl" → syllabics', convertToSyllabics, 'tirêyl', 'ᑎᕒᐁᕀᓬ')
