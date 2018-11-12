// Transcrypt'ed from Python, 2018-11-12 13:29:37
var __version__ = '2018.11.08';
var DEFAULT_HYPHENS = '\u202f';
var CONSONANT = '[ptkcshmnyw]|th';
var STRICT_VOWEL = '[êioaîôâ]';
var VOWEL = "{STRICT_VOWEL}|[eēī'ōā]".format_map (__all__);
var sro_pattern = re.compile ('\n    # A syllable that should be joined under the sandhi rule:\n    # We\'re setting this up so that the onset (consonant and optional w) can\n    # be glued together with the vowel. The parts are joined to\n    # form one syllable, even though the intervening hyphen indicates that\n    # they are in separate morphemes. That\'s sandhi!  See the front-matter in\n    # Arok Wolvengrey\'s dictionary for more information and examples.\n    #   Wolvengrey, Arok, ed. "ᓀᐦᐃᔭᐍᐏᐣ: ᐃᑗᐏᓇ / nēhiýawēwin: itwēwina/Cree:\n    #   Words". Canadian Plains Research Center, October 2001. pp. xvi–xviii.\n\n    ((?:{CONSONANT})w?)-({STRICT_VOWEL}) |\n\n    # Listing all of the syllables.\n    # NOTE: List the longer syllable first, since\n    # the regular expression will match the first alternative that will\n    # work—which must be the longest match!\n    thê|thi|tho|tha|thî|thô|thâ                            |th|\n    wê |wi |wo |wa |wî |wô |wâ                             |w |\n    pê |pi |po |pa |pî |pô |pâ |pwê|pwi|pwo|pwa|pwî|pwô|pwâ|p |\n    tê |ti |to |ta |tî |tô |tâ |twê|twi|two|twa|twî|twô|twâ|t |\n    kê |ki |ko |ka |kî |kô |kâ |kwê|kwi|kwo|kwa|kwî|kwô|kwâ|k |\n    cê |ci |co |ca |cî |cô |câ |cwê|cwi|cwo|cwa|cwî|cwô|cwâ|c |\n    mê |mi |mo |ma |mî |mô |mâ |mwê|mwi|mwo|mwa|mwî|mwô|mwâ|m |\n    nê |ni |no |na |nî |nô |nâ |nwê|nwa        |nwâ        |n |\n    sê |si |so |sa |sî |sô |sâ |swê|swi|swo|swa|swî|swô|swâ|s |\n    yê |yi |yo |ya |yî |yô |yâ |ywê|ywi|ywo|ywa|ywî|ywô|ywâ|y |\n    h|l|r|\n    ê|i|î|o|ô|a|â|\n    -\n'.format_map (__all__), re.VERBOSE);
var sro2syllabics_lookup = dict ({'ê': 'ᐁ', 'i': 'ᐃ', 'î': 'ᐄ', 'o': 'ᐅ', 'ô': 'ᐆ', 'a': 'ᐊ', 'â': 'ᐋ', 'wê': 'ᐍ', 'wi': 'ᐏ', 'wî': 'ᐑ', 'wo': 'ᐓ', 'wô': 'ᐕ', 'wa': 'ᐘ', 'wâ': 'ᐚ', 'w': 'ᐤ', 'p': 'ᑊ', 'pê': 'ᐯ', 'pi': 'ᐱ', 'pî': 'ᐲ', 'po': 'ᐳ', 'pô': 'ᐴ', 'pa': 'ᐸ', 'pâ': 'ᐹ', 'pwê': 'ᐻ', 'pwi': 'ᐽ', 'pwî': 'ᐿ', 'pwo': 'ᑁ', 'pwô': 'ᑃ', 'pwa': 'ᑅ', 'pwâ': 'ᑇ', 't': 'ᐟ', 'tê': 'ᑌ', 'ti': 'ᑎ', 'tî': 'ᑏ', 'to': 'ᑐ', 'tô': 'ᑑ', 'ta': 'ᑕ', 'tâ': 'ᑖ', 'twê': 'ᑘ', 'twi': 'ᑚ', 'twî': 'ᑜ', 'two': 'ᑞ', 'twô': 'ᑠ', 'twa': 'ᑢ', 'twâ': 'ᑤ', 'k': 'ᐠ', 'kê': 'ᑫ', 'ki': 'ᑭ', 'kî': 'ᑮ', 'ko': 'ᑯ', 'kô': 'ᑰ', 'ka': 'ᑲ', 'kâ': 'ᑳ', 'kwê': 'ᑵ', 'kwi': 'ᑷ', 'kwî': 'ᑹ', 'kwo': 'ᑻ', 'kwô': 'ᑽ', 'kwa': 'ᑿ', 'kwâ': 'ᒁ', 'c': 'ᐨ', 'cê': 'ᒉ', 'ci': 'ᒋ', 'cî': 'ᒌ', 'co': 'ᒍ', 'cô': 'ᒎ', 'ca': 'ᒐ', 'câ': 'ᒑ', 'cwê': 'ᒓ', 'cwi': 'ᒕ', 'cwî': 'ᒗ', 'cwo': 'ᒙ', 'cwô': 'ᒛ', 'cwa': 'ᒝ', 'cwâ': 'ᒟ', 'm': 'ᒼ', 'mê': 'ᒣ', 'mi': 'ᒥ', 'mî': 'ᒦ', 'mo': 'ᒧ', 'mô': 'ᒨ', 'ma': 'ᒪ', 'mâ': 'ᒫ', 'mwê': 'ᒭ', 'mwi': 'ᒯ', 'mwî': 'ᒱ', 'mwo': 'ᒳ', 'mwô': 'ᒵ', 'mwa': 'ᒷ', 'mwâ': 'ᒹ', 'n': 'ᐣ', 'nê': 'ᓀ', 'ni': 'ᓂ', 'nî': 'ᓃ', 'no': 'ᓄ', 'nô': 'ᓅ', 'na': 'ᓇ', 'nâ': 'ᓈ', 'nwê': 'ᓊ', 'nwa': 'ᓌ', 'nwâ': 'ᓎ', 's': 'ᐢ', 'sê': 'ᓭ', 'si': 'ᓯ', 'sî': 'ᓰ', 'so': 'ᓱ', 'sô': 'ᓲ', 'sa': 'ᓴ', 'sâ': 'ᓵ', 'swê': 'ᓷ', 'swi': 'ᓹ', 'swî': 'ᓻ', 'swo': 'ᓽ', 'swô': 'ᓿ', 'swa': 'ᔁ', 'swâ': 'ᔃ', 'y': 'ᕀ', 'yê': 'ᔦ', 'yi': 'ᔨ', 'yî': 'ᔩ', 'yo': 'ᔪ', 'yô': 'ᔫ', 'ya': 'ᔭ', 'yâ': 'ᔮ', 'ywê': 'ᔰ', 'ywi': 'ᔲ', 'ywî': 'ᔴ', 'ywo': 'ᔶ', 'ywô': 'ᔸ', 'ywa': 'ᔺ', 'ywâ': 'ᔼ', 'th': 'ᖮ', 'thê': 'ᖧ', 'thi': 'ᖨ', 'thî': 'ᖩ', 'tho': 'ᖪ', 'thô': 'ᖫ', 'tha': 'ᖬ', 'thâ': 'ᖭ', 'l': 'ᓬ', 'r': 'ᕒ', 'h': 'ᐦ', 'hk': 'ᕽ'});
var WORD_INITIAL = "\n    [ptkcmnsyh]w? |    # consonants that allow 'w' after\n    (?:th|[rl]) |  # consonants that don't\n    w |\n    # can start with no consonant.\n";
var WORD_MEDIAL = "\n    # TODO: there should be a constraint that the constants cannot be\n    # duplicated, but capturing groups won't work if these regex\n    # snippets are concatenated into bigger regexes.\n    (?:[hsmnwy]|th)? (?:[ptkcmnsyh]|th) w? |\n    w |\n    [yw]? [rl]  # for loan words\n";
var WORD_FINAL = '\n    [hs]? (?:[ptcksmnwy]|th) |\n    [yw]? [rl]  # for loan word\n    |  # can end with no consonant\n';
var CODA = 'th|[hs]?[ptkcmn]|h|s|y|w';
var MORPHEME = '\n    (?:{WORD_INITIAL}) (?:{VOWEL})\n        (?: (?:{WORD_MEDIAL}) (?:{VOWEL}) )*\n    (?:{WORD_FINAL})\n'.format_map (__all__);
var BEGIN_WORD = '\n(?:\n        ^  # Either the start of a string; or,\n        |  # at the edge of "letters".\n        (?<=[^a-zêioaîôâeēī\'ōā])\n)\n';
var END_WORD = "\n(?:\n        (?=[^a-zêioaîôâeēī'ōā]) |\n        $\n)\n";
var WORD = "\n    # CODA before the hyphen to account for Sandhi.\n    # It's possible to accept TWO codas using this formulation, but\n    # I think that loss of precision is okay.\n    {BEGIN_WORD} {MORPHEME} (?: (?:{CODA})?-{MORPHEME})* {END_WORD}\n".format_map (__all__);
var word_pattern = re.compile (WORD, re.IGNORECASE | re.VERBOSE);
var full_stop_pattern = re.compile ('\n    (?<=[\\u1400-\\u167f])[.] |   # Match a full-stop after syllabics\n    \\A[.]\\Z                     # or match as the only item.\n', re.VERBOSE);
var TRANSLATE_ALT_FORMS = str.maketrans ("eē'īōā", 'êêiîôâ');
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
	var __accu0__ = [];
	for (var [sro, syl] of sro2syllabics_lookup.py_items ()) {
		__accu0__.append (list ([syl, sro]));
	}
	return dict (__accu0__);
}) ();
syllabics2sro_lookup.py_update (dict ({'ᐝ': 'y', '᙮': '.', 'ᑦ': 'm', 'ᕁ': 'hk', 'ᐩ': 'y', '\u202f': '-'}));
var SYLLABICS_TO_SRO = str.maketrans (syllabics2sro_lookup);
var SYLLABIC_WITH_DOT = dict ({'ᐁ': 'ᐍ', 'ᐃ': 'ᐏ', 'ᐄ': 'ᐑ', 'ᐅ': 'ᐓ', 'ᐆ': 'ᐕ', 'ᐊ': 'ᐘ', 'ᐋ': 'ᐚ', 'ᐯ': 'ᐻ', 'ᐱ': 'ᐽ', 'ᐲ': 'ᐿ', 'ᐳ': 'ᑁ', 'ᐴ': 'ᑃ', 'ᐸ': 'ᑅ', 'ᐹ': 'ᑇ', 'ᑌ': 'ᑘ', 'ᑎ': 'ᑚ', 'ᑏ': 'ᑜ', 'ᑐ': 'ᑞ', 'ᑑ': 'ᑠ', 'ᑕ': 'ᑢ', 'ᑖ': 'ᑤ', 'ᑫ': 'ᑵ', 'ᑭ': 'ᑷ', 'ᑮ': 'ᑹ', 'ᑯ': 'ᑻ', 'ᑰ': 'ᑽ', 'ᑲ': 'ᑿ', 'ᑳ': 'ᒁ', 'ᒉ': 'ᒓ', 'ᒋ': 'ᒕ', 'ᒌ': 'ᒗ', 'ᒍ': 'ᒙ', 'ᒎ': 'ᒛ', 'ᒐ': 'ᒝ', 'ᒑ': 'ᒟ', 'ᒣ': 'ᒭ', 'ᒥ': 'ᒯ', 'ᒦ': 'ᒱ', 'ᒧ': 'ᒳ', 'ᒨ': 'ᒵ', 'ᒪ': 'ᒷ', 'ᒫ': 'ᒹ', 'ᓀ': 'ᓊ', 'ᓇ': 'ᓌ', 'ᓈ': 'ᓎ', 'ᓭ': 'ᓷ', 'ᓯ': 'ᓹ', 'ᓰ': 'ᓻ', 'ᓱ': 'ᓽ', 'ᓲ': 'ᓿ', 'ᓴ': 'ᔁ', 'ᓵ': 'ᔃ', 'ᔦ': 'ᔰ', 'ᔨ': 'ᔲ', 'ᔩ': 'ᔴ', 'ᔪ': 'ᔶ', 'ᔫ': 'ᔸ', 'ᔭ': 'ᔺ', 'ᔮ': 'ᔼ'});
var final_dot_pattern = re.compile ('([{without_dot}])ᐧ'.format (__kwargtrans__ ({without_dot: ''.join (SYLLABIC_WITH_DOT.py_keys ())})));
var circumflex_to_macrons = str.maketrans ('êîôâ', 'ēīōā');
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
