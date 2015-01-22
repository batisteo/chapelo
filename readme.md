## Ĉapelo - jQuery Esperanto accents plugin

Welcome Old Chap!

Let the world write Esperanto accents on the Web.
Just like (Ek!)[http://www.esperanto.mv.ru/Ek/]

Author - Baptiste Darthenay

Browser support:
* IE 10+
* Opera 12.1+
* Latest versions of Firefox and Chrome

## [Demo](http://batisteo.github.io/Chapelo)

## Getting started
You need only one file: `js/jquery.chapelo.min.js`

Then you can apply Ĉapelo to any element:
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


## Configuration options

##### suffixes
Value: `array`

Default:
```javascript
suffixes: ["X", "x", "H", "h"]
```

Description: List of characters which will replace the previous letter by the Unicode accented one.

##### selectors
Value: `string`

Default:
```javascript
selectors: 'textarea, input[type="text"]'
```

Description: jQuery selectors to filter the type of elements where Ĉapelo will apply.

##### alphabet
Value: `object`

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

## Contribution 
Feel free to create issues and send pull requests, they are highly appreciated!

Before reporting an issue, be so kind to prepare reproducible example on jsfiddle.net, please.

You can start with working demo of latest stable version of Ĉapelo: [jsfiddle.net/owuzg3qt](http://jsfiddle.net/owuzg3qt/)

## License
MIT License, see license.txt
