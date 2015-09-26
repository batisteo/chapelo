/**
* @package Chapelo - jQuery Esperanto accents plugin
* @version 2.0.0
* @author Baptiste Darthenay <baptiste@darthenay.fr>
* @copyright Copyright (c) 2015, Baptiste Darthenay
* @license MIT License, see license.txt
*/

(function ($) {
    "use strict";

    // Default options
    var prefixes = "^";
    var suffixes = "xXhH^";
    var alphabet = {
        c: "ĉ", g: "ĝ", h: "ĥ", j: "ĵ", s: "ŝ", u: "ŭ",
        C: "Ĉ", G: "Ĝ", H: "Ĥ", J: "Ĵ", S: "Ŝ", U: "Ŭ" };
    var diphthongs = {
        au: "aŭ", Au: "Aŭ", AU: "AŬ",
        eu: "eŭ", Eu: "Eŭ", EU: "EŬ" };
    var selectors = 'textarea, :text, [type=search], [contenteditable=true]';

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

    var codes = {Backspace: 8, Enter: 13, h: 72, x: 88};

    function Chapelo(field, prefixes, suffixes, alphabet, diphthongs) {
        this.field = field;
        this.prefixes = prefixes.split("");
        this.suffixes = suffixes.split("");
        this.alphabet = alphabet;
        this.diphthongs = diphthongs;

        this.alfabeto = reverse(alphabet);
        this.last = {prefix: "", suffix: ""};
        this.re = new RegExp(escape(this.regex()), 'g');
        this.active = true;
    }

    Chapelo.prototype.regex = function() {
        // Build the regex string for replacing a whole field, looks like:
        // "(cx|sx|Cx|Sx|CX|SX|ch|sh|Ch|Sh|CH|SH|…)"
        var chapelo = this;
        var reDiphthong = Object.keys(this.diphthongs).join('|');

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

    Chapelo.prototype.pair = function() {
        // Get the to character just before the caret
        this.text = this.field.value;
        this.pos = this.field.selectionStart;
        return this.text.slice(this.pos - 2, this.pos);
    };

    Chapelo.prototype.affix = function(pair) {
        if (this.prefixes.indexOf(pair[0]) > -1) {
            this.last.prefix = pair[0];
            return this.alphabet[pair[1]];
        }
        if (this.suffixes.indexOf(pair[1]) > -1) {
            this.last.suffix = pair[1];
            return this.alphabet[pair[0]];
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
        var beginning = this.text.slice(0, this.pos - pair.length);
        var end = this.text.slice(this.pos);
        this.field.value = beginning + replaced + end;
        // and replace the caret
        this.caret(pair.length - replaced.length);
    };

    Chapelo.prototype.replaceAll = function() {
        // Replace from a Regex all occurences in the field
        var chapelo = this;
        this.field.value = this.field.value.replace(this.re, function(match) {
            return chapelo.encode(match);
        });
    };

    Chapelo.prototype.cancel = function(key, pair) {
        // Tries to revert the last replacement
        var letter = pair[pair.length - 1];
        if (letter in this.alfabeto) {
            if (this.last.suffix) {
                this.replace(letter, this.alfabeto[letter] + this.last.suffix);
            } else if (this.last.prefix) {
                this.replace(letter, this.last.prefix + this.alfabeto[letter]);
            } else {
                this.replace(letter, this.alfabeto[letter]);
            }
            this.last = {prefix: "", suffix: ""};
            key.preventDefault();
        }
    };

    Chapelo.prototype.isLetter = function(key) {
        // Returns true if the typed char is within A-z and affixes
        var letter = String.fromCharCode(key.keyCode);
        var prefix = this.prefixes.join("");
        var suffix = this.suffixes.join("");
        var re = new RegExp('['+ escape('a-zA-Z '+ prefix + suffix) +']');
        return re.test(letter);
    };

    Chapelo.prototype.keydown = function(key) {
        if (this.active) {
            // Backspace key cancels
            if (key.keyCode === codes.Backspace) {
                this.cancel(key, this.pair());
            }
            // Keys 'x' or 'h' can cancel
            if (key.keyCode === codes[this.last.suffix.toLowerCase()]) {
                this.cancel(key, this.pair());
                this.lock = key.keyCode;
            }

            // Alt+Enter hotkey replaces all
            if (key.keyCode === codes.Enter && key.altKey) {
                this.replaceAll();
            }
        }
    };

    Chapelo.prototype.keyup = function(key) {
        if (this.lock === key.keyCode) {
            delete this.lock;
            return;
        }
        if (this.active && this.isLetter(key)) {
            var pair = this.pair();
            var diphthonged = this.diphthong(pair);
            var affixed = this.affix(pair);
            if (diphthonged) {
                this.replace(pair, diphthonged);
            } else if (affixed) {
                this.replace(pair, affixed);
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
            options.diphthongs
        );

        $(field).keydown(function(key) {
            field.chapelo.keydown(key);
        });

        $(field).keyup(function(key) {
            field.chapelo.keyup(key);
        });
    };


    // jQuery plugin
    $.fn.chapelo = function(initial_options) {
        var options = $.extend({
            prefixes: prefixes,
            suffixes: suffixes,
            alphabet: alphabet,
            diphthongs: diphthongs,
            selectors: selectors
        }, initial_options);

        return this.filter(options.selectors)
                   .add(this.find(options.selectors))
                   .each(function() {
                       chapeligu(this, options);
                   });
    };
})(jQuery);
