// Transcrypt'ed from Python, 2018-11-12 13:29:37
(function () {
  const __version__ = '2018.11.08'
  const DEFAULT_HYPHENS = '\u202f'
  const CONSONANT = '[ptkcshmnyw]|th'
  const STRICT_VOWEL = '[êioaîôâ]'
  const VOWEL = `${STRICT_VOWEL}|[eēī'ōā]`
  const sroPattern = new RegExp(`
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
  `)
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
          ^  # Either the start of a string; or,
          |  # at the edge of "letters".
          (?<=[^a-zêioaîôâeēī'ōā])
  )
  `
  const END_WORD = `
  (?:
          (?=[^a-zêioaîôâeēī'ōā]) |
          $
  )
  `
  const WORD = `
      ${BEGIN_WORD} ${MORPHEME} (?: (?:${CODA})?-${MORPHEME})* ${END_WORD}
  `
  const wordPattern = new RegExp(WORD, 'i')
  const fullStopPattern = new RegExp(`
      (?<=[\\u1400-\\u167f])[.] |
      \\A[.]\\Z
  `)
  const TRANSLATE_ALT_FORMS = _maketrans("eē'īōā", 'êêiîôâ') // TODO: replacement for make trans

  function sro2syllabics (sro, hyphens, sandhi) { // TODO: convert to options Object
    if (typeof hyphens === 'undefined' || (hyphens != null && hyphens.hasOwnProperty('__kwargtrans__'))) {
      hyphens = DEFAULT_HYPHENS
    }
    if (typeof sandhi === 'undefined' || (sandhi != null && sandhi.hasOwnProperty('__kwargtrans__'))) {
      sandhi = true
    }
    var transliterateWord = function (match) {
      return transcodeSROWordToSyllabics(match.group(0), hyphens, sandhi)
    }
    var transliteration = wordPattern.sub(transliterateWord, nfc(sro))
    return fullStopPattern.sub('᙮', transliteration)
  }

  function transcodeSROWordToSyllabics (sroWord, hyphen, sandhi) {
    var toTranscribe = sroWord.lower().translate(TRANSLATE_ALT_FORMS)
    var lookup = Object.new(sro2syllabicsLookup)
    Object.assign(lookup, { '-': hyphen })
    var parts = []
    var match = sroPattern.match(toTranscribe)
    while (match) {
      var __left0__ = match.groups()
      var onset = __left0__[0]
      var vowel = __left0__[1]
      if (sandhi && onset !== null) {
        var syllable = onset + vowel
        var nextSyllablePos = match.end()
      } else if (onset !== null) {
        syllable = (onset === 'w' ? 'w' : onset.rstrip('w'))
        nextSyllablePos = syllable.length
      } else {
        syllable = match.group(0)
        nextSyllablePos = match.end()
      }
      let syllabic = lookup[syllable]
      parts.append(syllabic)
      toTranscribe = toTranscribe.__getslice__(nextSyllablePos, null, 1)
      match = sroPattern.match(toTranscribe)
    }
    if (parts.__getslice__(-(2), null, 1) === ['ᐦ', 'ᐠ']) {
      parts.__setslice__(-(2), null, null, [sro2syllabicsLookup['hk']])
    }
    return ''.join(parts)
  }

  function nfc (text) {
    return text.normalize('NFC')
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

  const SYLLABICS_TO_SRO = _maketrans(syllabics2sroLookup)
  const SYLLABIC_WITH_DOT = { 'ᐁ': 'ᐍ', 'ᐃ': 'ᐏ', 'ᐄ': 'ᐑ', 'ᐅ': 'ᐓ', 'ᐆ': 'ᐕ', 'ᐊ': 'ᐘ', 'ᐋ': 'ᐚ', 'ᐯ': 'ᐻ', 'ᐱ': 'ᐽ', 'ᐲ': 'ᐿ', 'ᐳ': 'ᑁ', 'ᐴ': 'ᑃ', 'ᐸ': 'ᑅ', 'ᐹ': 'ᑇ', 'ᑌ': 'ᑘ', 'ᑎ': 'ᑚ', 'ᑏ': 'ᑜ', 'ᑐ': 'ᑞ', 'ᑑ': 'ᑠ', 'ᑕ': 'ᑢ', 'ᑖ': 'ᑤ', 'ᑫ': 'ᑵ', 'ᑭ': 'ᑷ', 'ᑮ': 'ᑹ', 'ᑯ': 'ᑻ', 'ᑰ': 'ᑽ', 'ᑲ': 'ᑿ', 'ᑳ': 'ᒁ', 'ᒉ': 'ᒓ', 'ᒋ': 'ᒕ', 'ᒌ': 'ᒗ', 'ᒍ': 'ᒙ', 'ᒎ': 'ᒛ', 'ᒐ': 'ᒝ', 'ᒑ': 'ᒟ', 'ᒣ': 'ᒭ', 'ᒥ': 'ᒯ', 'ᒦ': 'ᒱ', 'ᒧ': 'ᒳ', 'ᒨ': 'ᒵ', 'ᒪ': 'ᒷ', 'ᒫ': 'ᒹ', 'ᓀ': 'ᓊ', 'ᓇ': 'ᓌ', 'ᓈ': 'ᓎ', 'ᓭ': 'ᓷ', 'ᓯ': 'ᓹ', 'ᓰ': 'ᓻ', 'ᓱ': 'ᓽ', 'ᓲ': 'ᓿ', 'ᓴ': 'ᔁ', 'ᓵ': 'ᔃ', 'ᔦ': 'ᔰ', 'ᔨ': 'ᔲ', 'ᔩ': 'ᔴ', 'ᔪ': 'ᔶ', 'ᔫ': 'ᔸ', 'ᔭ': 'ᔺ', 'ᔮ': 'ᔼ' }
  const finalDotPattern = (function () {
    let withoutDot = Object.keys(SYLLABIC_WITH_DOT).join('')
    return new RegExp(`([${withoutDot}])ᐧ`)
  }())
  const circumflexToMacrons = _maketrans('êîôâ', 'ēīōā')
  function syllabics2sro (syllabics, produceMacrons) {
    if (typeof produceMacrons === 'undefined' || (produceMacrons != null && produceMacrons.hasOwnProperty('__kwargtrans__'))) {
      produceMacrons = false
    }
    var fixFinalDot = function (match) {
      return SYLLABIC_WITH_DOT[match.group(1)]
    }
    var normalized = finalDotPattern.sub(fixFinalDot, syllabics)
    var sroString = normalized.translate(SYLLABICS_TO_SRO)
    if (produceMacrons) {
      return sroString.translate(circumflexToMacrons)
    }
    return sroString
  }

  function _maketrans () {
    throw Error('not implemented')
  }

  /* Node exports. */
  if (typeof module !== 'undefined') {
    module.exports = {
      sro2syllabics,
      syllabics2sro,
      version: __version__
    }
  }
}())
