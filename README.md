# [Ĉapelo]("img/chapelo.svg")


## La ŝika jQuery kromaĵo por la Esperantaj supersignoj

Permesu la uzantojn de via retpaĝo skribi ĵustan Esperanton en viaj formularoj!  
Similas al [Ek](http://www.esperanto.mv.ru/Ek/) por retpaĝoj.


### Kiaj uzi Ĉapelon?

- Anstataŭas sufiksojn (`x`, `h`, `^`), prefiksojn (`^`), kaj diftongojn (`au` → `aŭ`) apriore
- Funkcias sur la tekstkampoj `<input type="text">` kaj aliaj similaj HTML5 kampoj, tekstareoj `<textarea>` kaj *sufiĉe bone* eĉ sur la riĉaj tekstkampoj `<div contenteditable="true">`!
- Eblas anstataŭigi tutan kampon per <kbd>Alt</kbd> + <kbd>Enter</kbd> (sur multaj kroziloj eblas malfari per <kbd>Ctrl</kbd> + <kbd>Z</kbd>)
- Tre agordema, vidu la [opciojn](#agordoj)


## Provu!

- [batisteo.github.io/chapelo](https://batisteo.github.io/chapelo/)
- [JSFiddle](http://jsfiddle.net/L1xuc3aq/)


## Rapida uzo

Nur unu dosiero estas bezonata: [`js/jquery.chapelo.min.js`](https://github.com/batisteo/chapelo/blob/master/js/jquery.chapelo.min.js) (4,2kB)
```javascript
<script src='/js/jquery.chapelo.min.js'></script>
```

Tiel vi povas aktivigi Ĉapelon sur kampon:
```javascript
$('.chap').chapelo();
```

Aŭ sur ajna gepatra elemento, laŭ plaĉo:
```javascript
$('body').chapelo();
```

### Agordoj

Eblas ŝanĝi la agordojn dum inicio. Jen la aprioraj opcioj:
```javascript
$('.chap').chapelo({
    prefixes: ['^'],
    suffixes: ['x', 'X', 'h', 'H', '^'],
    alphabet: {
        c: 'ĉ', g: 'ĝ', h: 'ĥ', j: 'ĵ', s: 'ŝ', u: 'ŭ',
        C: 'Ĉ', G: 'Ĝ', H: 'Ĥ', J: 'Ĵ', S: 'Ŝ', U: 'Ŭ'},
    diphthongs: {
        au: 'aŭ', Au: 'Aŭ', AU: 'AŬ',
        eu: 'eŭ', Eu: 'Eŭ', EU: 'EŬ'},
    selectors: 'textarea, :text, [type=search], [contenteditable=true]',
    modifier: 'alt'
});
```

##### prefixes
Valuto tipo: `array`

Aprioraj: `prefixes: ['^']`

Klarigo: Listo de karakteroj kiu anstataŭigas la antaŭan literon per la Unicode accented unu.

##### suffixes
Valuto tipo: `array`

Aprioraj: `suffixes: ['x', 'X', 'h', 'H', '^']`

Klarigo: Listo de karakteroj kiu anstataŭigas la antaŭan literon per la Unicode accented unu.

##### alphabet
Valuto tipo: `object`

Aprioraj:
```javascript
alphabet: {
    c: 'ĉ', g: 'ĝ', h: 'ĥ', j: 'ĵ', s: 'ŝ', u: 'ŭ',
    C: 'Ĉ', G: 'Ĝ', H: 'Ĥ', J: 'Ĵ', S: 'Ŝ', U: 'Ŭ'}
```

Klarigo: La listo de literoj kiun Ĉapelo anstataŭigos. Jes, vi povas uzi Ĉapelon por ion ajn fakte ;-)

##### diphthongs
Valuto tipo: `object`

Aprioraj:
```javascript
diphthongs: {
    au: 'aŭ', Au: 'Aŭ', AU: 'AŬ',
    eu: 'eŭ', Eu: 'Eŭ', EU: 'EŬ'}
```

Klarigo: La listo de diftongoj kiun Ĉapelo anstataŭigos sen prefikso nek sufikso. Malaktiveblas per `{}`.

##### selectors
Valuto tipo: `string`

Aprioraj: `selectors: 'textarea, :text, [type=search], [contenteditable=true]'`

Klarigo: jQuery selectors to filter the type of elements where Ĉapelo will apply.

##### modifier
Valuto tipo: `string`

Aprioraj: `modifier: 'alt'`

Validaj elektoj: `'alt'`, `'ctrl'`, `'shift'` aŭ  `''` por malaktivigi

Klarigo: La uzanto povas anstataŭigi ĉiujn ĉapelindaj literojn premante <kbd>Alt</kbd> + <kbd>Enter</kdb>


## Kontroli Ĉapelon

Vi povas agi sur la `chapelo` objekto kiu estas ligita al la DOM kampo, ekzemple aktivigi/ŝalti:
```javascript
$(':checkbox#sxaltilo').change(function() {
    $('#chapelita')[0].chapelo.active = $(this).prop('checked');
});
```

Anstataŭigi la tutan kampon:
```javascript
$('button#anstatauigu').click(function() {
    $('#chapelita')[0].chapelo.replaceAll();
});
```

Aŭ ŝanĝu ajnan opciojn:
```javascript
$('input#sufiksoj').keyup(function() {
    $('#chapelita')[0].chapelo.suffixes = $(this).val().split('');
});
```


## Subtenitaj kroziloj

- Firefox
- Chrome

Ne testitaj, sed espereble ankaŭ sub:
- IE 9
- Safari
- Opera 12.1+


## Kontribui

Bonvolu testi kaj testadi!

Ne hezitu aldoni [novan cimon](https://github.com/batisteo/chapelo/issues/new) aŭ krei [tirpeton](https://github.com/batisteo/chapelo/pulls)!


## Alternativoj

- **x2eo** de la [Studio GAUS](http://www.studiogaus.com), trovebla sur [vortaro.net](http://vortaro.net/js/3/common.js), GPL


## Aŭtoroj

- Baptiste Darthenay


## Licenco

MIT licenco, vidu [LICENSE](https://github.com/batisteo/chapelo/blob/master/LICENSE)
