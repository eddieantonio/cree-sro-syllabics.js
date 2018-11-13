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

// Transcrypt'ed from Python, 2018-11-12 13:29:37
(function () {
  const VERSION = '2018.11.08'

  // Defaults
  const DEFAULT_SRO2SYLLABICS_OPTIONS = {
    hyphens: '\u202f' // U+202F NARROW NO-BREAK SPACE, preferred by syllabics writers
  }
  const DEFAULT_SYLLABICS2SRO_OPTIONS = {
    longAccents: 'circumflexes'
  }

  const CONSONANT = '[ptkcshmnyw]|th'
  const STRICT_VOWEL = '[êioaîôâ]'
  const VOWEL = `${STRICT_VOWEL}|[eēī'ōā]`
  const sroPattern = verboseRegExp`
      ((?:${CONSONANT})w?)-(${STRICT_VOWEL}) |
      thê|thi|tho|tha|thî|thô|thâ                            |th|
      wê |wi |wo |wa |wî |wô |wâ                             |w |
      pê |pi |po |pa |pî |pô |pâ |pwê|pwi|pwo|pwa|pwî|pwô|pwâ|p |
      tê |ti |to |ta |tî |tô |tâ |twê|twi|two|twa|twî|twô|twâ|t |
      kê |ki |ko |ka |kî |kô |kâ |kwê|kwi|kwo|kwa|kwî|kwô|kwâ|k |
      cê |ci |co |ca |cî |cô |câ |cwê|cwi|cwo|cwa|cwî|cwô|cwâ|c |
      mê |mi |mo |ma |mî |mô |mâ |mwê|mwi|mwo|mwa|mwî|mwô|mwâ|m |
      nê |ni |no |na |nî |nô |nâ |nwê|nwa        |nwâ        |n |
      sê |si |so |sa |sî |sô |sâ |swê|swi|swo|swa|swî|swô|swâ|s |
      yê |yi |yo |ya |yî |yô |yâ |ywê|ywi|ywo|ywa|ywî|ywô|ywâ|y |
      h|l|r|
      ê|i|î|o|ô|a|â|
      -
  `

  const sro2syllabicsLookup = { 'ê': 'ᐁ', 'i': 'ᐃ', 'î': 'ᐄ', 'o': 'ᐅ', 'ô': 'ᐆ', 'a': 'ᐊ', 'â': 'ᐋ', 'wê': 'ᐍ', 'wi': 'ᐏ', 'wî': 'ᐑ', 'wo': 'ᐓ', 'wô': 'ᐕ', 'wa': 'ᐘ', 'wâ': 'ᐚ', 'w': 'ᐤ', 'p': 'ᑊ', 'pê': 'ᐯ', 'pi': 'ᐱ', 'pî': 'ᐲ', 'po': 'ᐳ', 'pô': 'ᐴ', 'pa': 'ᐸ', 'pâ': 'ᐹ', 'pwê': 'ᐻ', 'pwi': 'ᐽ', 'pwî': 'ᐿ', 'pwo': 'ᑁ', 'pwô': 'ᑃ', 'pwa': 'ᑅ', 'pwâ': 'ᑇ', 't': 'ᐟ', 'tê': 'ᑌ', 'ti': 'ᑎ', 'tî': 'ᑏ', 'to': 'ᑐ', 'tô': 'ᑑ', 'ta': 'ᑕ', 'tâ': 'ᑖ', 'twê': 'ᑘ', 'twi': 'ᑚ', 'twî': 'ᑜ', 'two': 'ᑞ', 'twô': 'ᑠ', 'twa': 'ᑢ', 'twâ': 'ᑤ', 'k': 'ᐠ', 'kê': 'ᑫ', 'ki': 'ᑭ', 'kî': 'ᑮ', 'ko': 'ᑯ', 'kô': 'ᑰ', 'ka': 'ᑲ', 'kâ': 'ᑳ', 'kwê': 'ᑵ', 'kwi': 'ᑷ', 'kwî': 'ᑹ', 'kwo': 'ᑻ', 'kwô': 'ᑽ', 'kwa': 'ᑿ', 'kwâ': 'ᒁ', 'c': 'ᐨ', 'cê': 'ᒉ', 'ci': 'ᒋ', 'cî': 'ᒌ', 'co': 'ᒍ', 'cô': 'ᒎ', 'ca': 'ᒐ', 'câ': 'ᒑ', 'cwê': 'ᒓ', 'cwi': 'ᒕ', 'cwî': 'ᒗ', 'cwo': 'ᒙ', 'cwô': 'ᒛ', 'cwa': 'ᒝ', 'cwâ': 'ᒟ', 'm': 'ᒼ', 'mê': 'ᒣ', 'mi': 'ᒥ', 'mî': 'ᒦ', 'mo': 'ᒧ', 'mô': 'ᒨ', 'ma': 'ᒪ', 'mâ': 'ᒫ', 'mwê': 'ᒭ', 'mwi': 'ᒯ', 'mwî': 'ᒱ', 'mwo': 'ᒳ', 'mwô': 'ᒵ', 'mwa': 'ᒷ', 'mwâ': 'ᒹ', 'n': 'ᐣ', 'nê': 'ᓀ', 'ni': 'ᓂ', 'nî': 'ᓃ', 'no': 'ᓄ', 'nô': 'ᓅ', 'na': 'ᓇ', 'nâ': 'ᓈ', 'nwê': 'ᓊ', 'nwa': 'ᓌ', 'nwâ': 'ᓎ', 's': 'ᐢ', 'sê': 'ᓭ', 'si': 'ᓯ', 'sî': 'ᓰ', 'so': 'ᓱ', 'sô': 'ᓲ', 'sa': 'ᓴ', 'sâ': 'ᓵ', 'swê': 'ᓷ', 'swi': 'ᓹ', 'swî': 'ᓻ', 'swo': 'ᓽ', 'swô': 'ᓿ', 'swa': 'ᔁ', 'swâ': 'ᔃ', 'y': 'ᕀ', 'yê': 'ᔦ', 'yi': 'ᔨ', 'yî': 'ᔩ', 'yo': 'ᔪ', 'yô': 'ᔫ', 'ya': 'ᔭ', 'yâ': 'ᔮ', 'ywê': 'ᔰ', 'ywi': 'ᔲ', 'ywî': 'ᔴ', 'ywo': 'ᔶ', 'ywô': 'ᔸ', 'ywa': 'ᔺ', 'ywâ': 'ᔼ', 'th': 'ᖮ', 'thê': 'ᖧ', 'thi': 'ᖨ', 'thî': 'ᖩ', 'tho': 'ᖪ', 'thô': 'ᖫ', 'tha': 'ᖬ', 'thâ': 'ᖭ', 'l': 'ᓬ', 'r': 'ᕒ', 'h': 'ᐦ', 'hk': 'ᕽ' }
  const WORD_INITIAL = `
      [ptkcmnsyh]w? |
      (?:th|[rl]) |
      w |

  `
  const WORD_MEDIAL = `
      (?:[hsmnwy]|th)? (?:[ptkcmnsyh]|th) w? |
      w |
      [yw]? [rl]
  `
  const WORD_FINAL = `
      [hs]? (?:[ptcksmnwy]|th) |
      [yw]? [rl]
      |
  `
  const CODA = 'th|[hs]?[ptkcmn]|h|s|y|w'
  const MORPHEME = `
      (?:${WORD_INITIAL}) (?:${VOWEL})
          (?: (?:${WORD_MEDIAL}) (?:${VOWEL}) )*
      (?:${WORD_FINAL})
  `
  const BEGIN_WORD = `
  (?:
          ^
          |
          (?<=[^a-zêioaîôâeēī'ōā])
  )
  `
  const END_WORD = `
  (?:
          (?=[^a-zêioaîôâeēī'ōā]) |
          $
  )
  `
  const WORD = verboseRegExp`
      ${BEGIN_WORD} ${MORPHEME} (?: (?:${CODA})?-${MORPHEME})* ${END_WORD}
  `
  const wordPattern = new RegExp(WORD, 'gi')
  const fullStopPattern = verboseRegExp`
      (?<=[\\u1400-\\u167f])[.] |
      ^.$
  `
  const translateAltForms = makeTranslation("eē'īōā", 'êêiîôâ')

  function sro2syllabics (sro, options = {}) {
    let hyphens = options.hyphens || DEFAULT_SRO2SYLLABICS_OPTIONS.hyphens

    let transliteration = nfc(sro).replace(wordPattern, transliterateWord)
    return transliteration.replace(fullStopPattern, '᙮')

    function transliterateWord (match) {
      return transcodeSROWordToSyllabics(match)
    }

    function transcodeSROWordToSyllabics (sroWord) {
      let toTranscribe = translateAltForms(sroWord.toLowerCase())

      let lookup = Object.create(sro2syllabicsLookup)
      Object.assign(lookup, { '-': hyphens })

      let parts = []
      let match = toTranscribe.match(sroPattern)

      while (match) {
        let [syllable, onset, vowel] = match
        let nextSyllablePos

        if (onset !== undefined) {
          // When the onset matched, apply sandhi for Cw?-V → Cw?V
          syllable = onset + vowel
        }
        nextSyllablePos = match[0].length

        let syllabic = lookup[syllable]
        parts.push(syllabic)
        toTranscribe = toTranscribe.slice(nextSyllablePos)

        match = toTranscribe.match(sroPattern)
      }

      if (endsWithHK(parts)) {
        // Replace last two charcters with 'hk' syllabic
        parts = parts.slice(0, parts.length - 2).concat('ᕽ')
      }

      return parts.join('')
    }
  }

  function nfc (text) {
    return text.normalize('NFC')
  }

  function endsWithHK (parts) {
    let n = parts.length
    return parts[n - 1] === 'ᐠ' && parts[n - 2] === 'ᐦ'
  }

  const syllabics2sroLookup = (function () {
    let lookup = {}
    for (var [sro, syl] of Object.entries(sro2syllabicsLookup)) {
      lookup[syl] = sro
    }
    Object.assign(lookup, {
      'ᐝ': 'y', '᙮': '.', 'ᑦ': 'm', 'ᕁ': 'hk', 'ᐩ': 'y', '\u202f': '-'
    })
    return lookup
  })()

  const syllabicToSRO = makeTranslation(Object.keys(syllabics2sroLookup), Object.values(syllabics2sroLookup))
  const SYLLABIC_WITH_DOT = { 'ᐁ': 'ᐍ', 'ᐃ': 'ᐏ', 'ᐄ': 'ᐑ', 'ᐅ': 'ᐓ', 'ᐆ': 'ᐕ', 'ᐊ': 'ᐘ', 'ᐋ': 'ᐚ', 'ᐯ': 'ᐻ', 'ᐱ': 'ᐽ', 'ᐲ': 'ᐿ', 'ᐳ': 'ᑁ', 'ᐴ': 'ᑃ', 'ᐸ': 'ᑅ', 'ᐹ': 'ᑇ', 'ᑌ': 'ᑘ', 'ᑎ': 'ᑚ', 'ᑏ': 'ᑜ', 'ᑐ': 'ᑞ', 'ᑑ': 'ᑠ', 'ᑕ': 'ᑢ', 'ᑖ': 'ᑤ', 'ᑫ': 'ᑵ', 'ᑭ': 'ᑷ', 'ᑮ': 'ᑹ', 'ᑯ': 'ᑻ', 'ᑰ': 'ᑽ', 'ᑲ': 'ᑿ', 'ᑳ': 'ᒁ', 'ᒉ': 'ᒓ', 'ᒋ': 'ᒕ', 'ᒌ': 'ᒗ', 'ᒍ': 'ᒙ', 'ᒎ': 'ᒛ', 'ᒐ': 'ᒝ', 'ᒑ': 'ᒟ', 'ᒣ': 'ᒭ', 'ᒥ': 'ᒯ', 'ᒦ': 'ᒱ', 'ᒧ': 'ᒳ', 'ᒨ': 'ᒵ', 'ᒪ': 'ᒷ', 'ᒫ': 'ᒹ', 'ᓀ': 'ᓊ', 'ᓇ': 'ᓌ', 'ᓈ': 'ᓎ', 'ᓭ': 'ᓷ', 'ᓯ': 'ᓹ', 'ᓰ': 'ᓻ', 'ᓱ': 'ᓽ', 'ᓲ': 'ᓿ', 'ᓴ': 'ᔁ', 'ᓵ': 'ᔃ', 'ᔦ': 'ᔰ', 'ᔨ': 'ᔲ', 'ᔩ': 'ᔴ', 'ᔪ': 'ᔶ', 'ᔫ': 'ᔸ', 'ᔭ': 'ᔺ', 'ᔮ': 'ᔼ' }
  const finalDotPattern = (function () {
    let withoutDot = Object.keys(SYLLABIC_WITH_DOT).join('')
    return new RegExp(`([${withoutDot}])ᐧ`)
  }())
  const circumflexToMacrons = makeTranslation('êîôâ', 'ēīōā')

  function syllabics2sro (syllabics, options = {}) {
    let longAccents = options.longAccents || DEFAULT_SYLLABICS2SRO_OPTIONS.longAccents

    var normalized = syllabics.replace(finalDotPattern, fixFinalDot)
    var sroString = syllabicToSRO(normalized)

    if (longAccents === 'macrons') {
      return circumflexToMacrons(sroString)
    }
    return sroString

    function fixFinalDot (match) {
      return SYLLABIC_WITH_DOT[match[0]]
    }
  }

  /**
   * Returns a function that translates cooresponding code units from string 1
   * to string 2.
   * Like Unix tr(1).
   */
  function makeTranslation (original, replacement) {
    let translation = new Map()
    for (let [index, source] of Array.from(original).entries()) {
      translation.set(source, replacement[index] || '')
    }

    return function (string) {
      return Array.from(string).map(ch =>
        translation.has(ch) ? translation.get(ch) : ch
      ).join('')
    }
  }

  function verboseRegExp (strings, ...placeholders) {
    let normalizedStrings = strings.map(removeWhitespace)
    let normalizedPlaceholders = placeholders.map(removeWhitespace)
    let regexpParts = []

    // there are always strings.length + 1 placeholders
    // the first string is either '' or the prefix
    regexpParts.push(normalizedStrings[0])
    // the last string is either '' or the suffix
    for (let [index, placeholder] of normalizedPlaceholders.entries()) {
      regexpParts.push(placeholder)
      regexpParts.push(normalizedStrings[index + 1])
    }

    return new RegExp(regexpParts.join(''))

    function removeWhitespace (string) {
      return string.replace(/\s/g, '')
    }
  }

  let exports = {
    sro2syllabics,
    syllabics2sro,
    version: VERSION
  }

  if (typeof module !== 'undefined') {
    /* Export for Node/CommonJS */
    module.exports = exports
  } else if (typeof window !== 'undefined') {
    /* Export for browsers */
    window.CreeSROSyllabics = exports
  }
}())
