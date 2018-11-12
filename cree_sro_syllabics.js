// Transcrypt'ed from Python, 2018-11-12 13:29:37
var __version__ = '2018.11.08';
var DEFAULT_HYPHENS = '\u202f';
var CONSONANT = '[ptkcshmnyw]|th';
var STRICT_VOWEL = '[êioaîôâ]';
var VOWEL = `${STRICT_VOWEL}|[eēī'ōā]`;
var sro_pattern = new RegExp(`
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
`);
var sro2syllabics_lookup = {'ê': 'ᐁ', 'i': 'ᐃ', 'î': 'ᐄ', 'o': 'ᐅ', 'ô': 'ᐆ', 'a': 'ᐊ', 'â': 'ᐋ', 'wê': 'ᐍ', 'wi': 'ᐏ', 'wî': 'ᐑ', 'wo': 'ᐓ', 'wô': 'ᐕ', 'wa': 'ᐘ', 'wâ': 'ᐚ', 'w': 'ᐤ', 'p': 'ᑊ', 'pê': 'ᐯ', 'pi': 'ᐱ', 'pî': 'ᐲ', 'po': 'ᐳ', 'pô': 'ᐴ', 'pa': 'ᐸ', 'pâ': 'ᐹ', 'pwê': 'ᐻ', 'pwi': 'ᐽ', 'pwî': 'ᐿ', 'pwo': 'ᑁ', 'pwô': 'ᑃ', 'pwa': 'ᑅ', 'pwâ': 'ᑇ', 't': 'ᐟ', 'tê': 'ᑌ', 'ti': 'ᑎ', 'tî': 'ᑏ', 'to': 'ᑐ', 'tô': 'ᑑ', 'ta': 'ᑕ', 'tâ': 'ᑖ', 'twê': 'ᑘ', 'twi': 'ᑚ', 'twî': 'ᑜ', 'two': 'ᑞ', 'twô': 'ᑠ', 'twa': 'ᑢ', 'twâ': 'ᑤ', 'k': 'ᐠ', 'kê': 'ᑫ', 'ki': 'ᑭ', 'kî': 'ᑮ', 'ko': 'ᑯ', 'kô': 'ᑰ', 'ka': 'ᑲ', 'kâ': 'ᑳ', 'kwê': 'ᑵ', 'kwi': 'ᑷ', 'kwî': 'ᑹ', 'kwo': 'ᑻ', 'kwô': 'ᑽ', 'kwa': 'ᑿ', 'kwâ': 'ᒁ', 'c': 'ᐨ', 'cê': 'ᒉ', 'ci': 'ᒋ', 'cî': 'ᒌ', 'co': 'ᒍ', 'cô': 'ᒎ', 'ca': 'ᒐ', 'câ': 'ᒑ', 'cwê': 'ᒓ', 'cwi': 'ᒕ', 'cwî': 'ᒗ', 'cwo': 'ᒙ', 'cwô': 'ᒛ', 'cwa': 'ᒝ', 'cwâ': 'ᒟ', 'm': 'ᒼ', 'mê': 'ᒣ', 'mi': 'ᒥ', 'mî': 'ᒦ', 'mo': 'ᒧ', 'mô': 'ᒨ', 'ma': 'ᒪ', 'mâ': 'ᒫ', 'mwê': 'ᒭ', 'mwi': 'ᒯ', 'mwî': 'ᒱ', 'mwo': 'ᒳ', 'mwô': 'ᒵ', 'mwa': 'ᒷ', 'mwâ': 'ᒹ', 'n': 'ᐣ', 'nê': 'ᓀ', 'ni': 'ᓂ', 'nî': 'ᓃ', 'no': 'ᓄ', 'nô': 'ᓅ', 'na': 'ᓇ', 'nâ': 'ᓈ', 'nwê': 'ᓊ', 'nwa': 'ᓌ', 'nwâ': 'ᓎ', 's': 'ᐢ', 'sê': 'ᓭ', 'si': 'ᓯ', 'sî': 'ᓰ', 'so': 'ᓱ', 'sô': 'ᓲ', 'sa': 'ᓴ', 'sâ': 'ᓵ', 'swê': 'ᓷ', 'swi': 'ᓹ', 'swî': 'ᓻ', 'swo': 'ᓽ', 'swô': 'ᓿ', 'swa': 'ᔁ', 'swâ': 'ᔃ', 'y': 'ᕀ', 'yê': 'ᔦ', 'yi': 'ᔨ', 'yî': 'ᔩ', 'yo': 'ᔪ', 'yô': 'ᔫ', 'ya': 'ᔭ', 'yâ': 'ᔮ', 'ywê': 'ᔰ', 'ywi': 'ᔲ', 'ywî': 'ᔴ', 'ywo': 'ᔶ', 'ywô': 'ᔸ', 'ywa': 'ᔺ', 'ywâ': 'ᔼ', 'th': 'ᖮ', 'thê': 'ᖧ', 'thi': 'ᖨ', 'thî': 'ᖩ', 'tho': 'ᖪ', 'thô': 'ᖫ', 'tha': 'ᖬ', 'thâ': 'ᖭ', 'l': 'ᓬ', 'r': 'ᕒ', 'h': 'ᐦ', 'hk': 'ᕽ'};
var WORD_INITIAL = `
    [ptkcmnsyh]w? |
    (?:th|[rl]) |
    w |

`;
var WORD_MEDIAL = `
    (?:[hsmnwy]|th)? (?:[ptkcmnsyh]|th) w? |
    w |
    [yw]? [rl]
`;
var WORD_FINAL = `
    [hs]? (?:[ptcksmnwy]|th) |
    [yw]? [rl]
    |
`;
var CODA = 'th|[hs]?[ptkcmn]|h|s|y|w';
var MORPHEME = `
    (?:${WORD_INITIAL}) (?:${VOWEL})
        (?: (?:${WORD_MEDIAL}) (?:${VOWEL}) )*
    (?:${WORD_FINAL})
`;
var BEGIN_WORD = `
(?:
        ^  # Either the start of a string; or,
        |  # at the edge of "letters".
        (?<=[^a-zêioaîôâeēī\'ōā])
)
`;
var END_WORD = `
(?:
        (?=[^a-zêioaîôâeēī'ōā]) |
        $
)
`;
var WORD = `
    ${BEGIN_WORD} ${MORPHEME} (?: (?:${CODA})?-${MORPHEME})* ${END_WORD}
`;
var word_pattern = new RegExp(WORD, 'i');
var full_stop_pattern = new RegExp(`
    (?<=[\\u1400-\\u167f])[.] |
    \\A[.]\\Z
`);
var TRANSLATE_ALT_FORMS = _maketrans ("eē'īōā", 'êêiîôâ'); // TODO: replacement for make trans
var sro2syllabics = function (sro, hyphens, sandhi) {
	if (typeof hyphens == 'undefined' || (hyphens != null && hyphens.hasOwnProperty ("__kwargtrans__"))) {;
		var hyphens = DEFAULT_HYPHENS;
	};
	if (typeof sandhi == 'undefined' || (sandhi != null && sandhi.hasOwnProperty ("__kwargtrans__"))) {;
		var sandhi = true;
	};
	var transliterate_word = function (match) {
		return transcode_sro_word_to_syllabics (match.group (0), hyphens, sandhi);
	};
	var transliteration = word_pattern.sub (transliterate_word, nfc (sro));
	return full_stop_pattern.sub ('᙮', transliteration);
};
var transcode_sro_word_to_syllabics = function (sro_word, hyphen, sandhi) {
	var to_transcribe = sro_word.lower ().translate (TRANSLATE_ALT_FORMS);
	var lookup = ChainMap (dict ({'-': hyphen}), sro2syllabics_lookup);
	var parts = list ([]);
	var match = sro_pattern.match (to_transcribe);
	while (match) {
		var __left0__ = match.groups ();
		var onset = __left0__ [0];
		var vowel = __left0__ [1];
		if (sandhi && onset !== null) {
			var syllable = onset + vowel;
			var next_syllable_pos = match.end ();
		}
		else if (onset !== null) {
			var syllable = (onset == 'w' ? 'w' : onset.rstrip ('w'));
			var next_syllable_pos = len (syllable);
		}
		else {
			var syllable = match.group (0);
			var next_syllable_pos = match.end ();
		}
		var syllabic = lookup [syllable];
		parts.append (syllabic);
		var to_transcribe = to_transcribe.__getslice__ (next_syllable_pos, null, 1);
		var match = sro_pattern.match (to_transcribe);
	}
	if (parts.__getslice__ (-(2), null, 1) == list (['ᐦ', 'ᐠ'])) {
		parts.__setslice__ (-(2), null, null, list ([sro2syllabics_lookup ['hk']]));
	}
	return ''.join (parts);
};
var nfc = function (text) {
	return normalize ('NFC', text);
};
var syllabics2sro_lookup = (function () {
	let lookup = {};
	for (var [sro, syl] of Object.entries(sro2syllabics_lookup)) {
		lookup[syl] = sro;
	}
	return lookup;
}) ();
Object.assign(syllabics2sro_lookup, {'ᐝ': 'y', '᙮': '.', 'ᑦ': 'm', 'ᕁ': 'hk', 'ᐩ': 'y', '\u202f': '-'});
var SYLLABICS_TO_SRO = _maketrans (syllabics2sro_lookup);
var SYLLABIC_WITH_DOT = {'ᐁ': 'ᐍ', 'ᐃ': 'ᐏ', 'ᐄ': 'ᐑ', 'ᐅ': 'ᐓ', 'ᐆ': 'ᐕ', 'ᐊ': 'ᐘ', 'ᐋ': 'ᐚ', 'ᐯ': 'ᐻ', 'ᐱ': 'ᐽ', 'ᐲ': 'ᐿ', 'ᐳ': 'ᑁ', 'ᐴ': 'ᑃ', 'ᐸ': 'ᑅ', 'ᐹ': 'ᑇ', 'ᑌ': 'ᑘ', 'ᑎ': 'ᑚ', 'ᑏ': 'ᑜ', 'ᑐ': 'ᑞ', 'ᑑ': 'ᑠ', 'ᑕ': 'ᑢ', 'ᑖ': 'ᑤ', 'ᑫ': 'ᑵ', 'ᑭ': 'ᑷ', 'ᑮ': 'ᑹ', 'ᑯ': 'ᑻ', 'ᑰ': 'ᑽ', 'ᑲ': 'ᑿ', 'ᑳ': 'ᒁ', 'ᒉ': 'ᒓ', 'ᒋ': 'ᒕ', 'ᒌ': 'ᒗ', 'ᒍ': 'ᒙ', 'ᒎ': 'ᒛ', 'ᒐ': 'ᒝ', 'ᒑ': 'ᒟ', 'ᒣ': 'ᒭ', 'ᒥ': 'ᒯ', 'ᒦ': 'ᒱ', 'ᒧ': 'ᒳ', 'ᒨ': 'ᒵ', 'ᒪ': 'ᒷ', 'ᒫ': 'ᒹ', 'ᓀ': 'ᓊ', 'ᓇ': 'ᓌ', 'ᓈ': 'ᓎ', 'ᓭ': 'ᓷ', 'ᓯ': 'ᓹ', 'ᓰ': 'ᓻ', 'ᓱ': 'ᓽ', 'ᓲ': 'ᓿ', 'ᓴ': 'ᔁ', 'ᓵ': 'ᔃ', 'ᔦ': 'ᔰ', 'ᔨ': 'ᔲ', 'ᔩ': 'ᔴ', 'ᔪ': 'ᔶ', 'ᔫ': 'ᔸ', 'ᔭ': 'ᔺ', 'ᔮ': 'ᔼ'};
var final_dot_pattern = (function () {
	let without_dot = Object.keys(SYLLABIC_WITH_DOT).join('');
	return new RegExp(`([${without_dot}])ᐧ`);
}());
var circumflex_to_macrons = _maketrans ('êîôâ', 'ēīōā');
var syllabics2sro = function (syllabics, produce_macrons) {
	if (typeof produce_macrons == 'undefined' || (produce_macrons != null && produce_macrons.hasOwnProperty ("__kwargtrans__"))) {;
		var produce_macrons = false;
	};
	var fix_final_dot = function (match) {
		return SYLLABIC_WITH_DOT [match.group (1)];
	};
	var normalized = final_dot_pattern.sub (fix_final_dot, syllabics);
	var sro_string = normalized.translate (SYLLABICS_TO_SRO);
	if (produce_macrons) {
		return sro_string.translate (circumflex_to_macrons);
	}
	return sro_string;
};
function _maketrans() {
	new Error('not implemented');
}
