#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

# Copyright (C) 2018 Eddie Antonio Santos <easantos@ualberta.ca>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

"""
Generate RegExps for use in cree-syllabics-sro.js

Requires at least Python 3.6.
"""

import re

# Derived from
# https://github.com/eddieantonio/cree-sro-syllabics/tree/v2018.11.08
CONSONANT = "[ptkcshmnyw]|th"
STRICT_VOWEL = "[êioaîôâ]"
VOWEL = f"{STRICT_VOWEL}|[eēī'’ōā]"

# Match an SRO syllable.
sro_pattern = re.compile(
    fr"""
    # A syllable that should be joined under the sandhi rule:
    # We're setting this up so that the onset (consonant and optional w) can
    # be glued together with the vowel. The parts are joined to
    # form one syllable, even though the intervening hyphen indicates that
    # they are in separate morphemes. That's sandhi!  See the front-matter in
    # Arok Wolvengrey's dictionary for more information and examples.
    #   Wolvengrey, Arok, ed. "ᓀᐦᐃᔭᐍᐏᐣ: ᐃᑗᐏᓇ / nēhiýawēwin: itwēwina/Cree:
    #   Words". Canadian Plains Research Center, October 2001. pp. xvi–xviii.

    ((?:{CONSONANT})w?)-({STRICT_VOWEL}) |

    # Listing all of the syllables.
    # NOTE: List the longer syllable first, since
    # the regular expression will match the first alternative that will
    # work—which must be the longest match!
    thê|thi|tho|tha|thî|thô|thâ|thwê|thwi|thwo|thwa|thwî|thwô|thwâ|th|
    wê |wi |wo |wa |wî |wô |wâ                                    |w |
    pê |pi |po |pa |pî |pô |pâ |pwê |pwi |pwo |pwa |pwî |pwô |pwâ |p |
    tê |ti |to |ta |tî |tô |tâ |twê |twi |two |twa |twî |twô |twâ |t |
    kê |ki |ko |ka |kî |kô |kâ |kwê |kwi |kwo |kwa |kwî |kwô |kwâ |k |
    cê |ci |co |ca |cî |cô |câ |cwê |cwi |cwo |cwa |cwî |cwô |cwâ |c |
    mê |mi |mo |ma |mî |mô |mâ |mwê |mwi |mwo |mwa |mwî |mwô |mwâ |m |
    nê |ni |no |na |nî |nô |nâ |nwê |nwa           |nwâ           |n |
    sê |si |so |sa |sî |sô |sâ |swê |swi |swo |swa |swî |swô |swâ |s |
    yê |yi |yo |ya |yî |yô |yâ |ywê |ywi |ywo |ywa |ywî |ywô |ywâ |y |
    h|l|r|
    ê|i|î|o|ô|a|â|
    -
""",
    re.VERBOSE,
)

# These regular expressions are intended to strictly match Cree words
# We want to match *CREE* words, because we want to avoid accidentally
# transliterating words from other languages (e.g., English, French).
#
# These regular expressions are based on a HUGE simplification of Cree
# phonotactics—that is, how you glue sounds in the language together to make
# syllables and words, and what combinations sounds allowed and where.
#
# For more information, see:
# https://en.wikipedia.org/wiki/Plains_Cree#Phonotactics
WORD_INITIAL = r"""
    (?:[ptkcmnsyh]|th)w? |    # consonants that allow 'w' after
    [rl] |  # consonants that don't
    w |
    # can start with no consonant.
"""

WORD_MEDIAL = r"""
    # TODO: there should be a constraint that the constants cannot be
    # duplicated, but capturing groups won't work if these regex
    # snippets are concatenated into bigger regexes.
    (?:[hsmnwy]|th)? (?:[ptkcmnsyh]|th) w? |
    w |
    [yw]? [rl]  # for loan words
"""

WORD_FINAL = r"""
    [hs]? (?:[ptcksmnwy]|th) |
    h |
    [yw]? [rl]  # for loan word
    |  # can end with no consonant
"""

# NOTE: VOWEL is defined way near the top of the file.

CODA = "th|[hs]?[ptkcmn]|h|s|y|w"
MORPHEME = fr"""
    (?:{WORD_INITIAL}) (?:{VOWEL})
        (?: (?:{WORD_MEDIAL}) (?:{VOWEL}) )*
    (?:{WORD_FINAL})
"""

# TODO: DRY these up!
BEGIN_WORD = r"""
(?:
        ^  # Either the start of a string; or,
        |  # at the edge of "letters".
        ([^a-zêîôâēī'’ōā])
)
"""
END_WORD = r"""
(?:
        (?=[^a-zêioaîôâeēī'’ōā]) |
        $
)
"""

WORD = fr"""
    # CODA before the hyphen to account for Sandhi.
    # It's possible to accept TWO codas using this formulation, but
    # I think that loss of precision is okay.
    {BEGIN_WORD} ({MORPHEME} (?: (?:{CODA})?-{MORPHEME})*) {END_WORD}
"""
word_pattern = re.compile(WORD, re.IGNORECASE | re.VERBOSE)

# This regex prevents matching EVERY period, instead only matching periods
# after Cree words, or, as an exception, as the only item in a string.
full_stop_pattern = re.compile(
    r"""
    ([\u1400-\u167F])[.] |  # Match a full-stop after syllabics
    ^[.]$                   # or match as the only item.
""",
    re.VERBOSE,
)

# For use when converting SYLLABIC + FINAL MIDDLE DOT into the syllabic
# with a 'w'
SYLLABIC_WITH_DOT = {
    "ᐁ": "ᐍ",
    "ᐃ": "ᐏ",
    "ᐄ": "ᐑ",
    "ᐅ": "ᐓ",
    "ᐆ": "ᐕ",
    "ᐊ": "ᐘ",
    "ᐋ": "ᐚ",
    "ᐯ": "ᐻ",
    "ᐱ": "ᐽ",
    "ᐲ": "ᐿ",
    "ᐳ": "ᑁ",
    "ᐴ": "ᑃ",
    "ᐸ": "ᑅ",
    "ᐹ": "ᑇ",
    "ᑌ": "ᑘ",
    "ᑎ": "ᑚ",
    "ᑏ": "ᑜ",
    "ᑐ": "ᑞ",
    "ᑑ": "ᑠ",
    "ᑕ": "ᑢ",
    "ᑖ": "ᑤ",
    "ᑫ": "ᑵ",
    "ᑭ": "ᑷ",
    "ᑮ": "ᑹ",
    "ᑯ": "ᑻ",
    "ᑰ": "ᑽ",
    "ᑲ": "ᑿ",
    "ᑳ": "ᒁ",
    "ᒉ": "ᒓ",
    "ᒋ": "ᒕ",
    "ᒌ": "ᒗ",
    "ᒍ": "ᒙ",
    "ᒎ": "ᒛ",
    "ᒐ": "ᒝ",
    "ᒑ": "ᒟ",
    "ᒣ": "ᒭ",
    "ᒥ": "ᒯ",
    "ᒦ": "ᒱ",
    "ᒧ": "ᒳ",
    "ᒨ": "ᒵ",
    "ᒪ": "ᒷ",
    "ᒫ": "ᒹ",
    "ᓀ": "ᓊ",
    "ᓇ": "ᓌ",
    "ᓈ": "ᓎ",
    "ᓭ": "ᓷ",
    "ᓯ": "ᓹ",
    "ᓰ": "ᓻ",
    "ᓱ": "ᓽ",
    "ᓲ": "ᓿ",
    "ᓴ": "ᔁ",
    "ᓵ": "ᔃ",
    "ᔦ": "ᔰ",
    "ᔨ": "ᔲ",
    "ᔩ": "ᔴ",
    "ᔪ": "ᔶ",
    "ᔫ": "ᔸ",
    "ᔭ": "ᔺ",
    "ᔮ": "ᔼ",
}
final_dot_pattern = re.compile(
    r"([{without_dot}])ᐧ".format(without_dot="".join(SYLLABIC_WITH_DOT.keys()))
)


def print_javascript_regexp(name: str, python_regex: re.Pattern, flags=""):
    # The variable declaration first
    print("const", name, "=", end=" ")

    if python_regex.flags & re.VERBOSE:
        # Remove comments and whitespace in verbose regexps.
        parts = []
        for line in python_regex.pattern.split("\n"):
            regex, _hash, _comment = line.partition("#")
            parts.extend(regex.split())
    else:
        parts = [python_regex.pattern]

    # Figure out the JavaScript compatible flags.
    if python_regex.flags & re.IGNORECASE:
        flags += "i"

    parts = [uniescape(part) for part in parts]

    # Print the regex!
    print("/", *parts, "/", flags, sep="")


def uniescape(text: str) -> str:
    """
    Escapes all non-ASCII printable characters with JavaScript Unicode escapes.
    """

    def escape(match):
        character = match.group(0)
        assert len(character) == 1
        code_point = ord(character)
        assert code_point <= 0xFFFF
        return f"\\u{code_point:04X}"

    return re.sub("[^\u0020-\u007F]", escape, text)


if __name__ == "__main__":
    print_javascript_regexp("sroPattern", sro_pattern)
    print_javascript_regexp("wordPattern", word_pattern, flags="g")
    print_javascript_regexp("fullStopPattern", full_stop_pattern, flags="g")
    print_javascript_regexp("finalDotPattern", final_dot_pattern, flags="g")
