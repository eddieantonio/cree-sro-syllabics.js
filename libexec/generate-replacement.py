#!/usr/bin/env python3

"""
Generates a JavaScript object of decomposed characters to their NFC normalized
variants.
"""

from itertools import product
from unicodedata import normalize

vowels = "EeIiOoAa"
accents = "\N{COMBINING CIRCUMFLEX ACCENT}", "\N{COMBINING MACRON}"

print("{")
for base, accent in product(vowels, accents):
    sequence = base + accent
    composed = normalize("NFC", sequence)
    assert len(composed) == 1
    print(f"  {sequence!a}: {composed!a},")

for composed in "Ýý":
    sequence = normalize("NFD", composed)
    assert len(composed) == 1
    print(f"  {sequence!a}: {composed!a},")
print("}")
