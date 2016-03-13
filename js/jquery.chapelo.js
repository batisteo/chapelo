/**
* @package Chapelo - jQuery Esperanto accents plugin
* @version 2.0.0
* @author Baptiste Darthenay <baptiste@darthenay.fr>
* @copyright Copyright (c) 2016, Baptiste Darthenay
* @license MIT License, see LICENSE
*/

(function ($) {
    "use strict";

    // Default options
    var prefixes = ['^'];
    var suffixes = ['x', 'X', 'h', 'H', '^'];
    var alphabet = {
        c: 'ĉ', g: 'ĝ', h: 'ĥ', j: 'ĵ', s: 'ŝ', u: 'ŭ',
        C: 'Ĉ', G: 'Ĝ', H: 'Ĥ', J: 'Ĵ', S: 'Ŝ', U: 'Ŭ' };
    var diphthongs = {
        au: 'aŭ', Au: 'Aŭ', AU: 'AŬ',
        eu: 'eŭ', Eu: 'Eŭ', EU: 'EŬ' };
    var selectors = 'textarea, :text, [type=search], [contenteditable=true]';
    var modifier = 'alt';

    function escape(string) {
        // Protects a string used in a regular expression
        return string.replace(/([.*+?^=!:${}\[\]\/\\])/g, "\\$1");
    }

    function reverse(object) {
        // Turns {key: "value"} into {value: "key"}
        var reversed = {};
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                reversed[object[key]] = key;
            }
        }
        return reversed;
    }

    function leftExpanded(range) {
        try { range.setStart(range.startContainer, range.startOffset-1); }
        catch (IndexSizeError) {
            console.error('Chapelo: Faild to expand range on this ContentEditable field');
        }
        return range;
    }

    var codes = {Backspace: 8, Enter: 13, h: 72, x: 88};

    function Chapelo(field, prefixes, suffixes, alphabet, diphthongs, modifier) {
        this.field = field;
        this.prefixes = prefixes;
        this.suffixes = suffixes;
        this.alphabet = alphabet;
        this.diphthongs = diphthongs;
        this.modifier = modifier;

        this.alfabeto = reverse(alphabet);
        this.last = {prefix: '', suffix: ''};
        this.active = true;
        this.div = field.getAttribute('contenteditable');
    }

    Chapelo.prototype.regex = function() {
        // Build the regex string for replacing a whole field, looks like:
        // "(cx|sx|Cx|Sx|CX|SX|ch|sh|Ch|Sh|CH|SH|…)"
        var chapelo = this;
        // var reDiphthong = Object.keys(this.diphthongs).join('|');

        var reSuffix = this.suffixes.map(function(suffix) {
            return Object.keys(chapelo.alphabet).map(function(letter) {
                return letter + suffix;
            }).join('|');
        }).join('|');

        var rePrefix = this.prefixes.map(function(prefix) {
            return Object.keys(chapelo.alphabet).map(function(letter) {
                return prefix + letter;
            }).join('|');
        }).join('|');

        var subregex = [
            // reDiphthong,
            rePrefix,
            reSuffix
        ];

        return '(' + subregex.join('|') + ')';
    };

    Chapelo.prototype.encode = function(match) {
        var affixed = this.affix(match);
        if (affixed) { return affixed; }
        return this.diphthong(match);
    };

    Chapelo.prototype.pair = function(back) {
        // Get the to two characters just before the caret
        if (this.div) {
            this.field.normalize();
            this.text = this.field.textContent;
            this.sel = window.getSelection();
            this.range = this.sel.getRangeAt(0);
            this.range = leftExpanded(this.range);
            if (back) {
                return leftExpanded(this.range.cloneRange()).toString();
            }
            return this.range.toString() + this.typedChar;
        }
        this.text = this.field.value;
        this.pos = this.field.selectionEnd;
        if (back) { return this.text.slice(this.pos - 2, this.pos); }
        return this.text.slice(this.pos - 1, this.pos) + this.typedChar;
    };

    Chapelo.prototype.affix = function(pair) {
        if (this.prefixes.indexOf(pair[0]) > -1) {
            var prefixed = this.alphabet[pair[1]];
            if (prefixed) { this.last.prefix = pair[0]; }
            return prefixed;
        }
        if (this.suffixes.indexOf(pair[1]) > -1) {
            var suffixed = this.alphabet[pair[0]];
            if (suffixed) { this.last.suffix = pair[1]; }
            return suffixed;
        }
    };

    Chapelo.prototype.diphthong = function(pair) {
        // Gives the diphthong for the pair, and reset history
        this.last = {prefix: "", suffix: ""};
        return this.diphthongs[pair];
    };

    Chapelo.prototype.caret = function(delta) {
        // Reposition the caret after replacement
        this.field.selectionStart = this.pos - delta;
        this.field.selectionEnd = this.pos - delta;
    };

    Chapelo.prototype.replace = function(pair, replaced) {
        // Rewrite the field content with replaced character
        if (this.div) {
            this.range.deleteContents();
            var textNode = document.createTextNode(replaced);
            this.range.insertNode(textNode);
            this.range.setStart(textNode, replaced.length);
            this.range.setEnd(textNode, replaced.length);
            this.sel.removeAllRanges();
            this.sel.addRange(this.range);
            this.field.normalize();  // 'merge' TextNodes
        } else {
            var start = this.text.slice(0, this.pos-1);
            var end = this.text.slice(this.pos);
            this.field.value = start + replaced + end;
            // and reposition the caret
            this.caret(pair.length - replaced.length -1);
        }
    };

    Chapelo.prototype.replaceAll = function() {
        // Replace from a Regex all occurences in the field
        if (this.div) {
            console.info('Chapelo: replaceAll on ContentEditable field is not supported');
            return;
        }
        
        var chapelo = this;
        var regex = new RegExp(escape(this.regex()), 'g');
        this.field.value = this.field.value.replace(regex, function(match) {
            return chapelo.encode(match);
        });
    };

    Chapelo.prototype.cancel = function(key, pair) {
        // Tries to revert the last replacement
        var letter = pair[pair.length - 1];
        if (letter in this.alfabeto) {
            key.preventDefault();
            if (this.last.suffix) {
                this.replace(letter, this.alfabeto[letter] + this.last.suffix);
            } else if (this.last.prefix) {
                this.replace(letter, this.last.prefix + this.alfabeto[letter]);
            } else {
                this.replace(letter, this.alfabeto[letter]);
                this.caret(0);
            }
            this.last = {prefix: "", suffix: ""};
        }
    };

    Chapelo.prototype.isLetter = function() {
        // Returns true if the typed char is within A-z and affixes
        var prefix = this.prefixes.join("");
        var suffix = this.suffixes.join("");
        var re = new RegExp('['+ escape('a-zA-Z '+ prefix + suffix) +']');
        return re.test(this.typedChar);
    };


    Chapelo.prototype.keydown = function(key) {
        if (!this.active) { return; }
        var keyCode = (key.shiftKey) ? key.which : key.which + 32;
        this.typedChar = String.fromCharCode(keyCode);
        
        // Backspace key cancels
        if (key.which === codes.Backspace) {
            this.cancel(key, this.pair(true));
        }
        // Keys 'x' or 'h' can cancel
        if (this.typedChar.toLowerCase() === this.last.suffix.toLowerCase()) {
            this.cancel(key, this.pair(true));
            this.lock = key.which;
        }
        // Alt+Enter hotkey replaces all
        if (key.which === codes.Enter && key[this.modifier + 'Key']) {
            key.preventDefault();
            this.replaceAll();
        }
        if (this.lock === key.which) {
            delete this.lock;
            return;
        }
        if (this.isLetter()) {
            var pair = this.pair();
            var diphthonged = this.diphthong(pair);
            var affixed = this.affix(pair);
            if (diphthonged) {
                this.replace(pair, diphthonged);
            } else if (affixed) {
                this.replace(pair, affixed);
            }
            if (diphthonged || affixed) {
                key.preventDefault();
            }
            if (this.div) {
              this.range.collapse();
            }
        }
    };

    var chapeligu = function(field, options) {
        // Creates a Chapelo object, and attaches it to the field
        field.chapelo = new Chapelo(
            field,
            options.prefixes,
            options.suffixes,
            options.alphabet,
            options.diphthongs,
            options.modifier
        );

        $(field).keydown(function(key) {
            field.chapelo.keydown(key);
        });
    };


    // jQuery plugin
    $.fn.chapelo = function(initial_options) {
        var options = $.extend({
            prefixes: prefixes,
            suffixes: suffixes,
            alphabet: alphabet,
            diphthongs: diphthongs,
            selectors: selectors,
            modifier: modifier
        }, initial_options);

        return this.filter(options.selectors)
                   .add(this.find(options.selectors))
                   .each(function() {
                       chapeligu(this, options);
                   });
    };
})(jQuery);
