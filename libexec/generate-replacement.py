#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

"""
Generates a JavaScript object of decomposed characters to their NFC normalized
variants.
"""

from unicodedata import normalize
from itertools import product

vowels = 'EeIiOoAa'
accents = '\N{COMBINING CIRCUMFLEX ACCENT}', '\N{COMBINING MACRON}'

print('{')
for base, accent in product(vowels, accents):
    sequence = base + accent
    composed = normalize('NFC', sequence)
    assert len(composed) == 1
    print(f"  {sequence!a}: {composed!a},")
print('}')
