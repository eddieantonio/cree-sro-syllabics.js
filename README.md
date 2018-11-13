Cree SRO/Syllabics
==================

[![Build Status](https://travis-ci.org/eddieantonio/cree-sro-syllabics.js.svg?branch=master)](https://travis-ci.org/eddieantonio/cree-sro-syllabics.js)

Convert between Western Cree standard Roman orthography (SRO) and syllabics!

This is a port of the [Python library of the same
name][cree-sro-syllabics.py]. For more complete documentation, see the
Python version.

[cree-sro-syllabics.py]: https://github.com/eddieantonio/cree-sro-syllabics


Install
-------

### Browser

Copy `cree-sro-syllabics.js` to wherever is most convenient. Then,
include it in your HTML like this:

```html
<script src="/path/to/cree-sro-syllabics.js" charset="UTF-8"></script>
```

**Make sure to provide `charset="UTF-8"`**! The browser may attempt to
read the file in an alternate encoding, and the converter will no longer
work as expected

When loaded in the browser, you can access all functions using the
`CreeSROSyllabics` global:

```html
<script src="/path/to/cree-sro-syllabics.js" charset="UTF-8"></script>
<script>
console.log(CreeSROSyllabics.sro2syllabics("tân'si")) // logs "ᑕᓂᓯ"
</script>
```


Usage
-----

There are two primary functions: `sro2syllabics()` and
`syllabics2sro()`. There is also the `version` constant.

### `sro2syllabics()`

```typescript
sro2Syllabics(sroString: string, options = {}): string
```

Convert text in SRO to syllabics.

```javascript
CreeSROSyllabics.sro2syllabics("tân'si")
// returns "ᑕᓂᓯ"
```

`options`, if supplied, is an object containing the following options:

#### `options.hyphens`

What character to use as hyphens. Defaults to `U+202F NARROW NO-BREAK
SPACE`—a space that is narrower than a word separating space; line
breaks are not permitted at this space.

Using `-`:

```javascript
CreeSROSyllabics.sro2syllabics('kâ-mahihkani-pimohtêt', { hyphens: '-' })
```

> ᑳ-ᒪᐦᐃᐦᑲᓂ-ᐱᒧᐦᑌᐟ

Using the default:

```javascript
CreeSROSyllabics.sro2syllabics('kâ-mahihkani-pimohtêt')
```

> ᑳ ᒪᐦᐃᐦᑲᓂ ᐱᒧᐦᑌᐟ


### `syllabics2sro()`

```typescript
syllabics2sro(syllabicsString: string, options = {}): string
```

Convert text in syllabics to SRO.

```javascript
CreeSROSyllabics.syllabics2sro('ᑖᓂᓯ')
// returns "tân'si"
```

`options`, if supplied, is an object containing the following options:

#### `options.longAccents`

Whether to use circumflexes (âêîô) or macrons (āēīō) when transcribing long vowels.

Valid options:

 - `'circumflexes'` (default)
 - `'macrons'`


Specifying `'macrons'`:

```javascript
CreeSROSyllabics.syllabics2sro("ᑖᓂᓯ", { longAccents: 'macrons' })
```

Using the defaults (circumflexes):

```javascript
CreeSROSyllabics.syllabics2sro("ᑖᓂᓯ", { longAccents: 'macrons' })
```

> tānisi

### `version`

The module's current version, as a string.


License
-------

Copyright (C) 2018 Eddie Antonio Santos <easantos@ualberta.ca>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
