/*!
 * Copyright (c) 2018-2021 National Research Council Canada
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function () {
  'use strict'

  // EXPORT: version
  const VERSION = '2021.4.16'

  // What functions and constants to export:
  let exports = {
    sro2syllabics: sro2syllabics,
    syllabics2sro: syllabics2sro,
    version: VERSION
  }

  // ============================ Constants ============================ \\

  // Default options for sro2syllabics() and syllabics2sro
  const DEFAULT_SRO2SYLLABICS_OPTIONS = {
    hyphens: '\u202f', // U+202F NARROW NO-BREAK SPACE, preferred by syllabics writers
    finalHK: 'x', // by default use ᕽ as the word-final hk. Maskwacîs uses ᐦᐠ instead.
  }
  const DEFAULT_SYLLABICS2SRO_OPTIONS = {
    longAccents: 'circumflexes'
  }

  // Word and syllable matching regular expressions.
  // NOTE: autogenerated by ./libexec/generate-regexp.py
  const sroPattern = /((?:[ptkcshmnyw]|th)w?)-([\u00EAioa\u00EE\u00F4\u00E2])|th\u00EA|thi|tho|tha|th\u00EE|th\u00F4|th\u00E2|thw\u00EA|thwi|thwo|thwa|thw\u00EE|thw\u00F4|thw\u00E2|th|w\u00EA|wi|wo|wa|w\u00EE|w\u00F4|w\u00E2|w|p\u00EA|pi|po|pa|p\u00EE|p\u00F4|p\u00E2|pw\u00EA|pwi|pwo|pwa|pw\u00EE|pw\u00F4|pw\u00E2|p|t\u00EA|ti|to|ta|t\u00EE|t\u00F4|t\u00E2|tw\u00EA|twi|two|twa|tw\u00EE|tw\u00F4|tw\u00E2|t|k\u00EA|ki|ko|ka|k\u00EE|k\u00F4|k\u00E2|kw\u00EA|kwi|kwo|kwa|kw\u00EE|kw\u00F4|kw\u00E2|k|c\u00EA|ci|co|ca|c\u00EE|c\u00F4|c\u00E2|cw\u00EA|cwi|cwo|cwa|cw\u00EE|cw\u00F4|cw\u00E2|c|m\u00EA|mi|mo|ma|m\u00EE|m\u00F4|m\u00E2|mw\u00EA|mwi|mwo|mwa|mw\u00EE|mw\u00F4|mw\u00E2|m|n\u00EA|ni|no|na|n\u00EE|n\u00F4|n\u00E2|nw\u00EA|nwa|nw\u00E2|n|s\u00EA|si|so|sa|s\u00EE|s\u00F4|s\u00E2|sw\u00EA|swi|swo|swa|sw\u00EE|sw\u00F4|sw\u00E2|s|y\u00EA|yi|yo|ya|y\u00EE|y\u00F4|y\u00E2|yw\u00EA|ywi|ywo|ywa|yw\u00EE|yw\u00F4|yw\u00E2|y|h|l|r|\u00EA|i|\u00EE|o|\u00F4|a|\u00E2|-/
  // Since JavaScript engines I want to support (e.g., Safari, IE11) don't
  // support negative lookbehind, I caputre the "lookbehind" in the word
  // pattern, only to glue it together again later.
  const wordPattern = /(?:^|([^a-z\u00EA\u00EE\u00F4\u00E2\u0113\u012B'\u2019\u014D\u0101]))((?:(?:[ptkcmnsyh]|th)w?|[rl]|w|)(?:[\u00EAioa\u00EE\u00F4\u00E2]|[e\u0113\u012B'\u2019\u014D\u0101])(?:(?:(?:[hsmnwy]|th)?(?:[ptkcmnsyh]|th)w?|w|[yw]?[rl])(?:[\u00EAioa\u00EE\u00F4\u00E2]|[e\u0113\u012B'\u2019\u014D\u0101]))*(?:[hs]?(?:[ptcksmnwy]|th)|h|kw|[yw]?[rl]|)(?:(?:th|[hs]?[ptkcmn]|h|s|y|w)?-(?:(?:[ptkcmnsyh]|th)w?|[rl]|w|)(?:[\u00EAioa\u00EE\u00F4\u00E2]|[e\u0113\u012B'\u2019\u014D\u0101])(?:(?:(?:[hsmnwy]|th)?(?:[ptkcmnsyh]|th)w?|w|[yw]?[rl])(?:[\u00EAioa\u00EE\u00F4\u00E2]|[e\u0113\u012B'\u2019\u014D\u0101]))*(?:[hs]?(?:[ptcksmnwy]|th)|h|kw|[yw]?[rl]|))*)(?:(?=[^a-z\u00EAioa\u00EE\u00F4\u00E2e\u0113\u012B'\u2019\u014D\u0101])|$)/gi
  const fullStopPattern = /([\u1400-\u167F])[.]|^[.]$/g
  const finalDotPattern = /([\u1401\u1403\u1404\u1405\u1406\u140A\u140B\u142F\u1431\u1432\u1433\u1434\u1438\u1439\u144C\u144E\u144F\u1450\u1451\u1455\u1456\u146B\u146D\u146E\u146F\u1470\u1472\u1473\u1489\u148B\u148C\u148D\u148E\u1490\u1491\u14A3\u14A5\u14A6\u14A7\u14A8\u14AA\u14AB\u14C0\u14C7\u14C8\u14ED\u14EF\u14F0\u14F1\u14F2\u14F4\u14F5\u1526\u1528\u1529\u152A\u152B\u152D\u152E])\u1427/g

  // Lookup tables:
  const sro2syllabicsLookup = { 'ê': 'ᐁ', 'i': 'ᐃ', 'î': 'ᐄ', 'o': 'ᐅ', 'ô': 'ᐆ', 'a': 'ᐊ', 'â': 'ᐋ', 'wê': 'ᐍ', 'wi': 'ᐏ', 'wî': 'ᐑ', 'wo': 'ᐓ', 'wô': 'ᐕ', 'wa': 'ᐘ', 'wâ': 'ᐚ', 'w': 'ᐤ', 'p': 'ᑊ', 'pê': 'ᐯ', 'pi': 'ᐱ', 'pî': 'ᐲ', 'po': 'ᐳ', 'pô': 'ᐴ', 'pa': 'ᐸ', 'pâ': 'ᐹ', 'pwê': 'ᐻ', 'pwi': 'ᐽ', 'pwî': 'ᐿ', 'pwo': 'ᑁ', 'pwô': 'ᑃ', 'pwa': 'ᑅ', 'pwâ': 'ᑇ', 't': 'ᐟ', 'tê': 'ᑌ', 'ti': 'ᑎ', 'tî': 'ᑏ', 'to': 'ᑐ', 'tô': 'ᑑ', 'ta': 'ᑕ', 'tâ': 'ᑖ', 'twê': 'ᑘ', 'twi': 'ᑚ', 'twî': 'ᑜ', 'two': 'ᑞ', 'twô': 'ᑠ', 'twa': 'ᑢ', 'twâ': 'ᑤ', 'k': 'ᐠ', 'kê': 'ᑫ', 'ki': 'ᑭ', 'kî': 'ᑮ', 'ko': 'ᑯ', 'kô': 'ᑰ', 'ka': 'ᑲ', 'kâ': 'ᑳ', 'kwê': 'ᑵ', 'kwi': 'ᑷ', 'kwî': 'ᑹ', 'kwo': 'ᑻ', 'kwô': 'ᑽ', 'kwa': 'ᑿ', 'kwâ': 'ᒁ', 'c': 'ᐨ', 'cê': 'ᒉ', 'ci': 'ᒋ', 'cî': 'ᒌ', 'co': 'ᒍ', 'cô': 'ᒎ', 'ca': 'ᒐ', 'câ': 'ᒑ', 'cwê': 'ᒓ', 'cwi': 'ᒕ', 'cwî': 'ᒗ', 'cwo': 'ᒙ', 'cwô': 'ᒛ', 'cwa': 'ᒝ', 'cwâ': 'ᒟ', 'm': 'ᒼ', 'mê': 'ᒣ', 'mi': 'ᒥ', 'mî': 'ᒦ', 'mo': 'ᒧ', 'mô': 'ᒨ', 'ma': 'ᒪ', 'mâ': 'ᒫ', 'mwê': 'ᒭ', 'mwi': 'ᒯ', 'mwî': 'ᒱ', 'mwo': 'ᒳ', 'mwô': 'ᒵ', 'mwa': 'ᒷ', 'mwâ': 'ᒹ', 'n': 'ᐣ', 'nê': 'ᓀ', 'ni': 'ᓂ', 'nî': 'ᓃ', 'no': 'ᓄ', 'nô': 'ᓅ', 'na': 'ᓇ', 'nâ': 'ᓈ', 'nwê': 'ᓊ', 'nwa': 'ᓌ', 'nwâ': 'ᓎ', 's': 'ᐢ', 'sê': 'ᓭ', 'si': 'ᓯ', 'sî': 'ᓰ', 'so': 'ᓱ', 'sô': 'ᓲ', 'sa': 'ᓴ', 'sâ': 'ᓵ', 'swê': 'ᓷ', 'swi': 'ᓹ', 'swî': 'ᓻ', 'swo': 'ᓽ', 'swô': 'ᓿ', 'swa': 'ᔁ', 'swâ': 'ᔃ', 'y': 'ᐩ', 'yê': 'ᔦ', 'yi': 'ᔨ', 'yî': 'ᔩ', 'yo': 'ᔪ', 'yô': 'ᔫ', 'ya': 'ᔭ', 'yâ': 'ᔮ', 'ywê': 'ᔰ', 'ywi': 'ᔲ', 'ywî': 'ᔴ', 'ywo': 'ᔶ', 'ywô': 'ᔸ', 'ywa': 'ᔺ', 'ywâ': 'ᔼ', 'th': 'ᖮ', 'thê': 'ᖧ', 'thi': 'ᖨ', 'thî': 'ᖩ', 'tho': 'ᖪ', 'thô': 'ᖫ', 'tha': 'ᖬ', 'thâ': 'ᖭ', 'thwê': '\u1677', 'thwi': '\u1678', 'thwî': '\u1679', 'thwo': '\u167A', 'thwô': '\u167B', 'thwa': '\u167C', 'thwâ': '\u167D', 'l': 'ᓬ', 'r': 'ᕒ', 'h': 'ᐦ', 'hk': 'ᕽ' }
  // Create the syllabics2sroLookup as the inverse of sro2syllabicsLookup
  const syllabics2sroLookup = (function () {
    var syl // IE11 doesn't handle `let` in for-loops properly :(
    let lookup = {}
    // IE11 also doesn't do for-of, so I need for-in, with the
    // ritual .hasOwnProperty() check :C
    for (var sro in sro2syllabicsLookup) {
      /* istanbul ignore if */
      if (!sro2syllabicsLookup.hasOwnProperty(sro)) {
        continue
      }
      syl = sro2syllabicsLookup[sro]

      lookup[syl] = sro
    }
    // Add a few alternate and lookalike characters to the lookup, as well as
    // the syllabics "hyphen".
    let alternates = {
      'ᐝ': 'y', '᙮': '.', 'ᑦ': 'm', 'ᕁ': 'hk', 'ᕀ': 'y', '\u202f': '-'
    }
    // Use for-in and .hasOwnProperty() check for IE11 compatibility 😡
    for (syl in alternates) {
      /* istanbul ignore else */
      if (alternates.hasOwnProperty(syl)) {
        lookup[syl] = alternates[syl]
      }
    }
    return lookup
  })()
  // Convert SYLLABIC + FINAL DOT into SYLLABIC WITH DOT
  const SYLLABIC_WITH_DOT = { 'ᐁ': 'ᐍ', 'ᐃ': 'ᐏ', 'ᐄ': 'ᐑ', 'ᐅ': 'ᐓ', 'ᐆ': 'ᐕ', 'ᐊ': 'ᐘ', 'ᐋ': 'ᐚ', 'ᐯ': 'ᐻ', 'ᐱ': 'ᐽ', 'ᐲ': 'ᐿ', 'ᐳ': 'ᑁ', 'ᐴ': 'ᑃ', 'ᐸ': 'ᑅ', 'ᐹ': 'ᑇ', 'ᑌ': 'ᑘ', 'ᑎ': 'ᑚ', 'ᑏ': 'ᑜ', 'ᑐ': 'ᑞ', 'ᑑ': 'ᑠ', 'ᑕ': 'ᑢ', 'ᑖ': 'ᑤ', 'ᑫ': 'ᑵ', 'ᑭ': 'ᑷ', 'ᑮ': 'ᑹ', 'ᑯ': 'ᑻ', 'ᑰ': 'ᑽ', 'ᑲ': 'ᑿ', 'ᑳ': 'ᒁ', 'ᒉ': 'ᒓ', 'ᒋ': 'ᒕ', 'ᒌ': 'ᒗ', 'ᒍ': 'ᒙ', 'ᒎ': 'ᒛ', 'ᒐ': 'ᒝ', 'ᒑ': 'ᒟ', 'ᒣ': 'ᒭ', 'ᒥ': 'ᒯ', 'ᒦ': 'ᒱ', 'ᒧ': 'ᒳ', 'ᒨ': 'ᒵ', 'ᒪ': 'ᒷ', 'ᒫ': 'ᒹ', 'ᓀ': 'ᓊ', 'ᓇ': 'ᓌ', 'ᓈ': 'ᓎ', 'ᓭ': 'ᓷ', 'ᓯ': 'ᓹ', 'ᓰ': 'ᓻ', 'ᓱ': 'ᓽ', 'ᓲ': 'ᓿ', 'ᓴ': 'ᔁ', 'ᓵ': 'ᔃ', 'ᔦ': 'ᔰ', 'ᔨ': 'ᔲ', 'ᔩ': 'ᔴ', 'ᔪ': 'ᔶ', 'ᔫ': 'ᔸ', 'ᔭ': 'ᔺ', 'ᔮ': 'ᔼ' }

  // A few character translation functions.
  const circumflexToMacrons = makeTranslation('êîôâ', 'ēīōā')
  const translateAltForms = makeTranslation("eē'’īōā", 'êêiiîôâ')
  const syllabicToSRO = makeTranslation(Object.keys(syllabics2sroLookup), (function values () {
    // Work around for lack of Object.values() on some platforms.
    var a = []
    var syl
    for (syl in syllabics2sroLookup) {
      if (syllabics2sroLookup.hasOwnProperty(syl)) {
        a.push(syllabics2sroLookup[syl])
      }
    }
    return a
  }()))

  // ========================= Primary Exports ========================= \\

  // EXPORT: Convert SRO to syllabics:
  function sro2syllabics (sro, options) {
    options = options || {}
    let hyphens = options.hyphens || DEFAULT_SRO2SYLLABICS_OPTIONS.hyphens

    let hk;
    switch (options.finalHK) {
      case "hk":
        hk = "ᐦᐠ"
        break

      case "x":
      case undefined:
        hk = "ᕽ"
        break

      default:
        throw new Error('final hk must be either "hk" or "x"')
    }

    // Instead of using sro2syllabicsLookup directly, create a customizable
    // lookup here that fallsback to sro2syllabicsLookup.
    let lookup = Object.create(sro2syllabicsLookup)
    // The customization is what the hyphen should be converted to:
    lookup['-'] = hyphens

    let transliteration = nfc(sro).replace(wordPattern, transliterateWord)
    return transliteration.replace(fullStopPattern, function (_, syllabic) {
      // The pattern may yank the last syllabic before the full stop,
      // so add it back here:
      return (syllabic || '') + '\u166E' // ᙮ U+166E CANADIAN SYLLABICS FULL STOP
    })

    function transliterateWord (_match, preamble, word) {
      // The pattern matches zero or more non-word characters before the word
      // (preamble), so glue that before the word.
      return (preamble || '') + transcodeSROWordToSyllabics(word)
    }

    function transcodeSROWordToSyllabics (sroWord) {
      let toTranscribe = translateAltForms(sroWord.toLowerCase())

      let parts = []
      let match = toTranscribe.match(sroPattern)

      while (match) {
        let syllable = match[0]
        let onset = match[1]
        let vowel = match[2]
        let nextSyllablePos

        if (onset !== undefined) {
          // When the onset matched, apply sandhi for Cw?-V → Cw?V
          syllable = onset + vowel
          // Special case for sandhi hw?-V cases: Just transcribe
          // the 'h'/ᐦ part first, then run pretend that this
          // syllable is just the (optional w and) vowel.
          if (onset[0] === 'h') {
            parts.push('ᐦ');
            syllable = syllable.substr(1);
          }
        }
        nextSyllablePos = match[0].length

        let syllabic = lookup[syllable]
        parts.push(syllabic)
        toTranscribe = toTranscribe.slice(nextSyllablePos)

        match = toTranscribe.match(sroPattern)
      }

      if (endsWithHK(parts)) {
        // Replace last two charcters with 'hk' syllabic
        parts = parts.slice(0, parts.length - 2).concat(hk)
      }

      return parts.join('')
    }
  }

  // EXPORT: Convert syllabics to SRO:
  function syllabics2sro (syllabics, options) {
    options = options || {}
    let longAccents = options.longAccents || DEFAULT_SYLLABICS2SRO_OPTIONS.longAccents

    var normalized = syllabics.replace(finalDotPattern, fixFinalDot)
    var sroString = syllabicToSRO(normalized)

    if (longAccents === 'macrons') {
      return circumflexToMacrons(sroString)
    }
    return sroString
  }

  // ========================= Helper functions ========================= \\

  /**
   * Returns the string in NFC Unicode normalization form.
   * This means latin characters with accents will always be precomposed, if
   * possible.
   */
  let nfc
  if (String.prototype.normalize instanceof Function) {
    // Use ES2015 String.prototype.normalize, if available.
    nfc = function nfcUsingNormalize (string) {
      return string.normalize('NFC')
    }
  } else {
    // Otherwise, ONLY decompose some selected decomposed characters
    // Table generated by: libexec/generate-replacement.py
    const decomposed2nfc = { 'E\u0302': '\xca', 'E\u0304': '\u0112', 'e\u0302': '\xea', 'e\u0304': '\u0113', 'I\u0302': '\xce', 'I\u0304': '\u012a', 'i\u0302': '\xee', 'i\u0304': '\u012b', 'O\u0302': '\xd4', 'O\u0304': '\u014c', 'o\u0302': '\xf4', 'o\u0304': '\u014d', 'A\u0302': '\xc2', 'A\u0304': '\u0100', 'a\u0302': '\xe2', 'a\u0304': '\u0101' }
    nfc = function selectiveNFC (string) {
      return string.replace(/[aeio][\u0302\u0304]/gi, function (sequence) {
        return decomposed2nfc[sequence]
      })
    }
  }

  /**
   * Returns whether the array ends with ᐦᐠ
   */
  function endsWithHK (parts) {
    let n = parts.length
    return parts[n - 1] === 'ᐠ' && parts[n - 2] === 'ᐦ'
  }

  /**
   * Converts a syllabic into its w-dotted equivilent.
   */
  function fixFinalDot (match) {
    return SYLLABIC_WITH_DOT[match[0]]
  }

  /**
   * Returns a function that translates cooresponding code units from string 1
   * to string 2.
   * Like Unix tr(1).
   */
  function makeTranslation (original, replacement) {
    let translation = new Map()
    Array.prototype.forEach.call(original, function setMap (source, index) {
      translation.set(source, replacement[index] || '')
    })

    return function (string) {
      return Array.prototype.map.call(string, function replace (ch) {
        return translation.has(ch) ? translation.get(ch) : ch
      }).join('')
    }
  }

  /* istanbul ignore next */
  if (typeof module !== 'undefined') {
    /* Export for Node/CommonJS */
    module.exports = exports
  } else if (typeof window !== 'undefined') {
    /* Export for browsers */
    window.CreeSROSyllabics = exports
  }
}())
