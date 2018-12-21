/*
 * Copyright (C) 2018 Eddie Antonio Santos <easantos@ualberta.ca>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import test from 'ava'

let { sro2syllabics, syllabics2sro } = require('./cree-sro-syllabics')

const COMBINING_CIRCUMFLEX = '\u0302'

/* Create automatic titles for some test cases. */
convertSemiRoundTrip.title = (providedTitle, sro, syllabics) =>
  providedTitle || `“${sro}” ↔ “${syllabics}”`
convertSemiRoundTripWithMacrons.title = (providedTitle, sro, syllabics) =>
  `“${sro}” ↔ “${syllabics}”`
convertRoundTrip.title = (_providedTitle, sro, syllabics) =>
  `“${sro}” ⇔ “${syllabics}”`
convertToSyllabics.title = (comment, sro, syllabics) =>
  `“${sro}” → “${syllabics}”` + (comment ? ` (${comment})` : '')
convertToSRO.title = (comment, syllabics, sro) =>
  `“${syllabics}” → “${sro}” (${comment})`

// ////////////////////////////// TEST CASES ////////////////////////////// //

/* Basic, full word tests. */
test(convertRoundTrip, 'acimosis', 'ᐊᒋᒧᓯᐢ')
test(convertRoundTrip, 'atahk', 'ᐊᑕᕽ')
test(convertRoundTrip, 'mêriy', 'ᒣᕒᐃᕀ')
test(convertRoundTrip, 'wîstihkêw', 'ᐑᐢᑎᐦᑫᐤ')
test(convertRoundTrip, 'nêhiyawêwin', 'ᓀᐦᐃᔭᐍᐏᐣ')
test(convertRoundTrip, 'tirêyl', 'ᑎᕒᐁᕀᓬ')

/* Spelling relaxation tests. */
test(convertToSyllabics, "Tân'si", 'ᑖᓂᓯ')
test(convertToSyllabics, 'Maskekosihk', 'ᒪᐢᑫᑯᓯᕽ')

// TODO: test as if String.prototype.normalize() does not exist.
test('Unicode normalization', t => {
  let water = 'nipiy'
  let leaf = 'ni' + COMBINING_CIRCUMFLEX + 'piy'

  t.not(water, leaf)
  t.not(sro2syllabics(water), sro2syllabics(leaf))
  t.is(sro2syllabics(water), 'ᓂᐱᕀ')
  t.is(sro2syllabics(leaf), 'ᓃᐱᕀ')
})

/* Tests word matching (only match words; do not match English words). */
test(convertSemiRoundTrip, 'obviously english text', 'obviously english text')
test(convertSemiRoundTrip, 'write nêhiyawêwin', 'write ᓀᐦᐃᔭᐍᐏᐣ')
test(convertSemiRoundTrip, '\t namoya  tataspêyihtam. ', '\t ᓇᒧᔭ  ᑕᑕᐢᐯᔨᐦᑕᒼ᙮ ')

test('alternate y-final', convertToSRO, 'ᓰᐱᐝ', 'sîpiy')

test(convertSemiRoundTripWithMacrons, 'yōtinipēstāw', 'ᔫᑎᓂᐯᐢᑖᐤ')
test(convertSemiRoundTripWithMacrons, 'īkatē', 'ᐄᑲᑌ')

/* Test hyphens */
test(convertRoundTrip, 'paskwâwi-mostos', 'ᐸᐢᒁᐏ ᒧᐢᑐᐢ')
test(convertRoundTrip, 'amiskwaciy-waskahikan', 'ᐊᒥᐢᑿᒋᕀ ᐘᐢᑲᐦᐃᑲᐣ')
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
test('lookalike: U+1429 CANADIAN SYLLABICS FINAL PLUS', convertLookalike, 'ᓂᐱ\u1429', 'nipiy', 'ᓂᐱᕀ')

/* Test th-dialect */
test(convertSemiRoundTripWithMacrons, 'wīhthēw', 'ᐑᐦᖧᐤ')
test(convertSemiRoundTripWithMacrons, 'nampithi-sīpīhk', 'ᓇᒼᐱᖨ ᓰᐲᕽ')
test(convertSemiRoundTripWithMacrons, 'mithomon', 'ᒥᖪᒧᐣ')
test(convertSemiRoundTripWithMacrons, 'namōtha', 'ᓇᒨᖬ')
test(convertSemiRoundTripWithMacrons, 'thāhkan', 'ᖭᐦᑲᐣ')
test(convertSemiRoundTripWithMacrons, 'namēpith', 'ᓇᒣᐱᖮ')
test(convertSemiRoundTripWithMacrons, 'thē thi tho tha thī thō thā', 'ᖧ ᖨ ᖪ ᖬ ᖩ ᖫ ᖭ')

/* Test rare nwV forms */
test('rare nwV forms', convertToSyllabics, 'nwe nwa nwā', 'ᓊ ᓌ ᓎ')

/* Test adjacent "vowels" */
test('adjacent "vowels"', convertToSyllabics, "I'm", "I'm")

/* Test short-i elision: https://github.com/eddieantonio/cree-sro-syllabics.js/issues/8 */
test('Using U+0027 APOSTROPHE', convertToSyllabics, "tan'si", 'ᑕᓂᓯ')
/* iPhone's keyboard produces this by default:  */
test('Using U+2019 RIGHT SINGLE QUOTATION', convertToSyllabics, 'tan’si', 'ᑕᓂᓯ')

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
