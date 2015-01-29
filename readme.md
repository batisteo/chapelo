## Ĉapelo - jQuery plugin for Esperanto accents

![logo](logo.png)

Welcome Old Chap!

Let the world write Esperanto accents on the Web.
Just like [Ek](http://www.esperanto.mv.ru/Ek/)!

Browser support:
* IE 10+
* Opera 12.1+
* Latest versions of Firefox and Chrome

## Demo

- [batisteo.github.io/chapelo](https://batisteo.github.io/chapelo/)
- [JSFiddle](http://jsfiddle.net/tpxg3Loh/)

## Getting started
You need only one file: `js/jquery.chapelo.min.js`

Then you can apply Ĉapelo to any element or parent:
```javascript
$('textarea').chapelo();
```

or:
```javascript
$('.chap').chapelo();
```

Global default settings are stored in `$.chapelo`

They can be redefined during initialization:
```javascript
$('.chap').chapelo({
	suffixes: ["h", "H", "'"],
    selectors: 'textarea'
});
```

or with data-attributes with `chap-` prefix:
```html
<textarea class="chap" data-chap-suffixes="hH'"></textarea>
```
*not implemented yet*


## Controls
You can add controls to let the user choose using Ĉapelo or not. Theese controls are simple checkboxes.

#### Globally
Add this checkbox in your page with the id `chap-global-toggle`.

```html
<input type="checkbox" id="chap-global-toggle" checked />
```

This control have the priority over all controls: if this checkbox in unchecked, Ĉapelo is disabled on the whole page.

#### By Element
Add the class `chap-off` on your field to disable Ĉapelo locally.

The following checkbox helpers just add or remove `chap-off` on your fields:

##### By Class
Add a checkbox with the class `chap-field-toggle` and the attribute `data-chap-toggle="klaso"`.

```html
<input type="checkbox" class="chap-field-toggle" data-chap-toggle="klaso" checked />
<input type="text" class="chap klaso" />
<textarea class="chap klaso"></textarea>
```

##### By ID
Add a checkbox with the class `chap-field-toggle` and the attribute `data-chap-toggle-id="kampo-priskribo"`.

```html
<input type="checkbox" class="chap-field-toggle" data-chap-toggle-id="kampo-priskribo" checked />
<input type="text" class="chap" id="kampo-priskribo" />
```


## Configuration options

##### suffixes
Value type: `array`

Default:
```javascript
suffixes: ["X", "x", "H", "h", "^"]
```

Description: List of characters which will replace the previous letter by the Unicode accented one.

##### selectors
Value type: `string`

Default:
```javascript
selectors: 'textarea, input[type="text"]'
```

Description: jQuery selectors to filter the type of elements where Ĉapelo will apply.

##### alphabet
Value type: `object`

Default:
```javascript
alphabet: {
    "C": "Ĉ",
    "G": "Ĝ",
    "H": "Ĥ",
    "J": "Ĵ",
    "S": "Ŝ",
    "U": "Ŭ",
    "c": "ĉ",
    "g": "ĝ",
    "h": "ĥ",
    "j": "ĵ",
    "s": "ŝ",
    "u": "ŭ"
    }
```

Description: Dictionary of the letters that will be replaced if a suffix is typed after it.


## Known limitations

- The prefixes are not supported yet (for example: ^c -> ĉ).
- Autoreplace of au -> aŭ or eu -> eŭ not supported yet.
- ~~The user can't choose wheather the letters have to be replaced or not.~~ (Added in 1.1)


## Contribute
Feel free to create issues and send pull requests, they are highly appreciated!

Before reporting an issue, be so kind to prepare reproducible example on jsfiddle.net, please.

You can start with working demo of latest stable version of Ĉapelo: [jsfiddle.net/tpxg3Loh](http://jsfiddle.net/tpxg3Loh/)


## Authors
Baptiste Darthenay

## License
MIT License, see license.txt
