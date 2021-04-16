const test = require('ava')

let { sro2syllabics, syllabics2sro } = require('./cree-sro-syllabics')

const COMBINING_CIRCUMFLEX = '\u0302'

/* Create automatic titles for some test cases. */
let createMacroTitle = (operator) => (comment, a, b) =>
  `“${a}” ${operator} “${b}”` + (comment ? ` (${comment})` : '')
convertSemiRoundTrip.title = createMacroTitle('↔')
convertSemiRoundTripWithMacrons.title = createMacroTitle('↔')
convertRoundTrip.title = createMacroTitle('⇔')
convertToSyllabics.title = createMacroTitle('→')
convertToSRO.title = createMacroTitle('→')

// ////////////////////////////// TEST CASES ////////////////////////////// //

/* Basic, full word tests. */
test(convertRoundTrip, 'acimosis', 'ᐊᒋᒧᓯᐢ')
test(convertRoundTrip, 'atahk', 'ᐊᑕᕽ')
test(convertRoundTrip, 'mêriy', 'ᒣᕒᐃᐩ')
test(convertRoundTrip, 'wîstihkêw', 'ᐑᐢᑎᐦᑫᐤ')
test(convertRoundTrip, 'nêhiyawêwin', 'ᓀᐦᐃᔭᐍᐏᐣ')
test(convertRoundTrip, 'tirêyl', 'ᑎᕒᐁᐩᓬ')
test(convertRoundTrip, 'mitêh', 'ᒥᑌᐦ')

/* Spelling relaxation tests. */
test(convertToSyllabics, "Tân'si", 'ᑖᓂᓯ')
test(convertToSyllabics, 'Maskekosihk', 'ᒪᐢᑫᑯᓯᕽ')

test('Unicode normalization using String#normalize()', t => {
  let water = 'nipiy'
  let leaf = 'ni' + COMBINING_CIRCUMFLEX + 'piy'

  t.not(water, leaf)
  t.not(sro2syllabics(water), sro2syllabics(leaf))
  t.is(sro2syllabics(water), 'ᓂᐱᐩ')
  t.is(sro2syllabics(leaf), 'ᓃᐱᐩ')
})

// TODO: test as if String.prototype.normalize() does not exist.
// NB: this is difficult, as cree-sro-syllabics decides which NFC to use
// AT IMPORT TIME. So you can't just delete String#normalize() in one test
// without it trying to use String#normalize() anyway.

/* Tests word matching (only match words; do not match English words). */
test(convertSemiRoundTrip, 'obviously english text', 'obviously english text')
test(convertSemiRoundTrip, 'write nêhiyawêwin', 'write ᓀᐦᐃᔭᐍᐏᐣ')
test(convertSemiRoundTrip, '\t namoya  tataspêyihtam. ', '\t ᓇᒧᔭ  ᑕᑕᐢᐯᔨᐦᑕᒼ᙮ ')

test('alternate y-final', convertToSRO, 'ᓰᐱᐝ', 'sîpiy')

test(convertSemiRoundTripWithMacrons, 'yōtinipēstāw', 'ᔫᑎᓂᐯᐢᑖᐤ')
test(convertSemiRoundTripWithMacrons, 'īkatē', 'ᐄᑲᑌ')

/* Test hyphens */
test(convertRoundTrip, 'paskwâwi-mostos', 'ᐸᐢᒁᐏ ᒧᐢᑐᐢ')
test(convertRoundTrip, 'amiskwaciy-waskahikan', 'ᐊᒥᐢᑿᒋᐩ ᐘᐢᑲᐦᐃᑲᐣ')
test(convertRoundTrip, 'kâ-mahihkani-pimohtêt isiyihkâsow', 'ᑳ ᒪᐦᐃᐦᑲᓂ ᐱᒧᐦᑌᐟ ᐃᓯᔨᐦᑳᓱᐤ')

test('supplying custom hyphens', t => {
  let customHyphen = '$'
  t.is(sro2syllabics('paskwâwi-mostos', { hyphens: customHyphen }), 'ᐸᐢᒁᐏ' + customHyphen + 'ᒧᐢᑐᐢ')
})

/* Test Sandhi */
test(convertToSyllabics, 'osk-âya', 'ᐅᐢᑳᔭ')
test(convertToSyllabics, 'miyw-âyâw', 'ᒥᔼᔮᐤ')
test(convertToSyllabics, 'pîhc-âyihk', 'ᐲᐦᒑᔨᕽ')
test(convertToSyllabics, 'wîhth-owin', 'ᐑᐦᖪᐏᐣ')

/* Test full-stop */
test('test full-stop (all Cree)', convertSemiRoundTrip, 'êtî nitisiyihkâson.', 'ᐁᑏ ᓂᑎᓯᔨᐦᑳᓱᐣ᙮')
test('test full-stop (mostly English)', convertSemiRoundTrip,
  'She told Dr. Thunder: "ninôhtêhkatân."', 'She told Dr. Thunder: "ᓂᓅᐦᑌᐦᑲᑖᐣ᙮"')
test('test full-stop (multiple)', convertSemiRoundTrip, 'tânisi. êtî nitisiyihkâson. ', 'ᑖᓂᓯ᙮ ᐁᑏ ᓂᑎᓯᔨᐦᑳᓱᐣ᙮ ')

/* Test final-middle dot. */
test('final middle-dot', convertToSRO, 'ᐋᐧᐱ ᑭᐦᐃᐤ', 'wâpi kihiw')
test('"ᐋᐧᐱ ᑭᐦᐃᐤ" → "ᐚᐱ ᑭᐦᐃᐤ"', t => {
  t.is(sro2syllabics(syllabics2sro('ᐋᐧᐱ ᑭᐦᐃᐤ')), 'ᐚᐱ ᑭᐦᐃᐤ')
})
/* Regression: https://github.com/eddieantonio/cree-sro-syllabics.js/issues/9 */
test('Regression: GH-9', convertToSRO, 'ᐃᐢᑫᐧᐤ ᐊᐱᐦᑕᐃᐧᑯᓯᓴᐣ', 'iskwêw apihtawikosisan')

/* Test lookalikes */
test('lookalike: U+1466 CANADIAN SYLLABICS T', convertLookalike, 'ᐚᐸ\u1466', 'wâpam', 'ᐚᐸᒼ')
test('lookalike: U+1541 CANADIAN SYLLABICS SAYISI YI', convertLookalike, 'ᓂᐲ\u1541', 'nipîhk', 'ᓂᐲᕽ')
// See: https://github.com/UAlbertaALTLab/nehiyawewin-syllabics/issues/2
test('lookalike: U+1429 CANADIAN SYLLABICS WEST-CREE Y', convertLookalike, 'ᓂᐱ\u1540', 'nipiy', 'ᓂᐱᐩ')

/* Test th-dialect (thV) */
test(convertSemiRoundTripWithMacrons, 'wīhthēw', 'ᐑᐦᖧᐤ')
test(convertSemiRoundTripWithMacrons, 'nampithi-sīpīhk', 'ᓇᒼᐱᖨ ᓰᐲᕽ')
test(convertSemiRoundTripWithMacrons, 'mithomon', 'ᒥᖪᒧᐣ')
test(convertSemiRoundTripWithMacrons, 'namōtha', 'ᓇᒨᖬ')
test(convertSemiRoundTripWithMacrons, 'thāhkan', 'ᖭᐦᑲᐣ')
test(convertSemiRoundTripWithMacrons, 'namēpith', 'ᓇᒣᐱᖮ')
test(convertSemiRoundTripWithMacrons, 'thē thi tho tha thī thō thā', 'ᖧ ᖨ ᖪ ᖬ ᖩ ᖫ ᖭ')

/* Test th-dialect (thwV) */
test(convertSemiRoundTripWithMacrons, 'mithwāsin', 'ᒥᙽᓯᐣ')
test(convertSemiRoundTripWithMacrons, 'thwē thwi thwo thwa thwī thwō thwā', 'ᙷ ᙸ ᙺ ᙼ ᙹ ᙻ ᙽ')

/* Test rare nwV forms */
test('rare nwV forms', convertToSyllabics, 'nwe nwa nwā', 'ᓊ ᓌ ᓎ')

/* Test adjacent "vowels" */
test('adjacent "vowels"', convertToSyllabics, "I'm", "I'm")

/* Test short-i elision: https://github.com/eddieantonio/cree-sro-syllabics.js/issues/8 */
test('Using U+0027 APOSTROPHE', convertToSyllabics, "tan'si", 'ᑕᓂᓯ')
/* iPhone's keyboard produces this by default:  */
test('Using U+2019 RIGHT SINGLE QUOTATION', convertToSyllabics, 'tan’si', 'ᑕᓂᓯ')

/* Test Vh-V sandi (https://github.com/eddieantonio/cree-sro-syllabics/issues/17) */
test(convertToSyllabics, 'âh-ayinânêw', 'ᐋᐦᐊᔨᓈᓀᐤ');
test(convertToSyllabics, 'âh-ayîtaw', 'ᐋᐦᐊᔩᑕᐤ');
test(convertToSyllabics, 'mistah-âya', 'ᒥᐢᑕᐦᐋᔭ');
// This is a fake word, but it tests an edge case:
test(convertToSyllabics, 'atihw-âya', 'ᐊᑎᐦᐚᔭ');

/* Test that the version number is consistent with the package.  */
test('version number consistency', t => {
  let moduleVersion = require('./cree-sro-syllabics').version;
  t.is(require('./package.json').version, moduleVersion);
});

/* Regression: abbreviated forms in th-dialect (thanks, Bill Cook!) */
test(convertRoundTrip, 'ikw', 'ᐃᐠᐤ')
test(convertRoundTrip, 'pokw', 'ᐳᐠᐤ')

test('hk option', t => {
  let word = "Maskwacîsihk"
  t.is(sro2syllabics(word, { finalHK: "hk" }), "ᒪᐢᑿᒌᓯᐦᐠ")
  t.is(sro2syllabics(word, { finalHK: "x" }), "ᒪᐢᑿᒌᓯᕽ")
  t.is(sro2syllabics(word), "ᒪᐢᑿᒌᓯᕽ")

  t.throws(() => sro2syllabics(word, { finalHK: "xk"}))
})

/* ***************************** Test Macros ***************************** */

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
 * Test macro that tests SRO → syllabics and syllabics → SRO. Always produces
 * macrons.
 * Inverses are not tested.
 */
function convertSemiRoundTripWithMacrons (t, sro, syllabics) {
  t.is(sro2syllabics(sro), syllabics)
  t.is(syllabics2sro(syllabics, { longAccents: 'macrons' }), sro)
}

/**
 * Test macro that tests SRO → syllabics.
 */
function convertToSyllabics (t, sro, syllabics) {
  t.is(sro2syllabics(sro), syllabics)
}

/**
 * Test macro that tests SRO → syllabics.
 */
function convertToSRO (t, syllabics, sro) {
  t.is(syllabics2sro(syllabics), sro)
}

/**
 * Test macro for testing lookalike normalization
 */
function convertLookalike (t, erroneousSyllabics, sro, correctSyllabics) {
  t.not(erroneousSyllabics, correctSyllabics)
  t.is(syllabics2sro(erroneousSyllabics), sro)
  t.is(sro2syllabics(syllabics2sro(erroneousSyllabics)), correctSyllabics)
}
