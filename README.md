Cree SRO/Syllabics
==================

![Unit test status](https://github.com/eddieantonio/cree-sro-syllabics.js/workflows/test/badge.svg)
[![codecov](https://codecov.io/gh/eddieantonio/cree-sro-syllabics.js/branch/master/graph/badge.svg)](https://codecov.io/gh/eddieantonio/cree-sro-syllabics.js)
[![npm version](https://badge.fury.io/js/cree-sro-syllabics.svg)](https://badge.fury.io/js/cree-sro-syllabics)
[![calver YYYY.MM.DD](https://img.shields.io/badge/calver-YYYY.MM.DD-22bfda.svg)](http://calver.org/)

Convert between Western Cree standard Roman orthography (SRO) and syllabics!

This is a port of the [Python library of the same
name][cree-sro-syllabics.py]. For more complete documentation, see the
[Python version's documentation][readthedocs].

[cree-sro-syllabics.py]: https://github.com/eddieantonio/cree-sro-syllabics
[readthedocs]: https://crk-orthography.readthedocs.io/en/stable/


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
work as expected.

When loaded in the browser, you can access all functions using the
`CreeSROSyllabics` global:

```html
<script src="/path/to/cree-sro-syllabics.js" charset="UTF-8"></script>
<script>
console.log(CreeSROSyllabics.sro2syllabics("tân'si")) // logs "ᑕᓂᓯ"
</script>
```

### NodeJS

Install using npm:

```shell
npm install cree-sro-syllabics --save
```

Then `require()` it into your code:

```javascript
var CreeSROSyllabics = require('cree-sro-syllabics')

console.log(CreeSROSyllabics.sro2syllabics("tân'si")) // logs ᑖᓂᓯ
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

Using a normal space character:

```javascript
CreeSROSyllabics.sro2syllabics('kâ-mahihkani-pimohtêt', { hyphens: ' ' })
```

> ᑳ ᒪᐦᐃᐦᑲᓂ ᐱᒧᐦᑌᐟ

Using the default:

```javascript
CreeSROSyllabics.sro2syllabics('kâ-mahihkani-pimohtêt')
```

> ᑳ ᒪᐦᐃᐦᑲᓂ ᐱᒧᐦᑌᐟ


#### `options.finalHK`

What character use as the word-final “hk” (e.g., in locatives and
certain conjunct mode verb forms). Use either `"x"` (default) or `"hk"`.

The default is to use the «ᕽ» syllabic:

```javascript
CreeSROSyllabics.sro2syllabics('sâwanohk')
```

> ᓵᐘᓄᕽ

This is equivalent to providing `{ finalHK: "x" }`:

```javascript
CreeSROSyllabics.sro2syllabics('sâwanohk', { finalHK: "x" })
```

> ᓵᐘᓄᕽ
    
However, some communities (like Maskwacîs) do not use the «ᕽ» syllabic,
instead using «ᐦᐠ». You can specify `{ finalHK: "hk" }` to get this
behaviour instead:

```javascript
CreeSROSyllabics.sro2syllabics('sâwanohk', { finalHK: "hk" })
```

> ᓵᐘᓄᐦᐠ


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

Whether to produce circumflexes (âêîô) or macrons (āēīō) when
transliterating long vowels.

Valid options:

 - `'circumflexes'` (default)
 - `'macrons'`


Specifying `'macrons'`:

```javascript
CreeSROSyllabics.syllabics2sro("ᑖᓂᓯ", { longAccents: 'macrons' })
```

> tānisi

Using the defaults (circumflexes):

```javascript
CreeSROSyllabics.syllabics2sro("ᑖᓂᓯ")
```

> tânisi

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
