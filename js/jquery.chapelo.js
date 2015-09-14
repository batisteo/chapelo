/**
* @package Chapelo - jQuery Esperanto accents plugin
* @version 2.0.0
* @author Baptiste Darthenay <baptiste@darthenay.fr>
* @copyright Copyright (c) 2015, Baptiste Darthenay
* @license MIT License, see license.txt
*/

(function ($) {
    "use strict";

    /*** Default options ***/
    var prefixes = "^";

    var suffixes = "xXhH^";

    var alphabet = {
        c: "ĉ", g: "ĝ", h: "ĥ", j: "ĵ", s: "ŝ", u: "ŭ",
        C: "Ĉ", G: "Ĝ", H: "Ĥ", J: "Ĵ", S: "Ŝ", U: "Ŭ"
    };

    var diphthongs = {
        au: "aŭ", Au: "Aŭ", AU: "AŬ",
        eu: "eŭ", Eu: "Eŭ", EU: "EŬ"
    };

    var selectors = 'textarea, input[type="text"]';

    function escape(string) {
        return string.replace(/([.*+?^=!:${}\[\]\/\\])/g, "\\$1");
    }

    function Chapelo(field, prefixes, suffixes, alphabet, diphthongs) {
        this.field = field;
        this.prefixes = prefixes.split("");
        this.suffixes = suffixes.split("");
        this.alphabet = alphabet;
        this.diphthongs = diphthongs;

        this.reversed = {};
        for (var letter in this.alphabet) {
            if (this.alphabet.hasOwnProperty(letter)) {
                this.reversed[this.alphabet[letter]] = letter;
            }
        }
        this.last = {prefix: "", suffix: ""};
        this.re = new RegExp(escape(this.regex()), 'g');
    }

    Chapelo.prototype.regex = function() {
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
        this.last = {prefix: "", suffix: ""};
        return this.diphthongs[pair];
    };

    Chapelo.prototype.caret = function(delta) {
        this.field.selectionStart = this.pos - delta;
        this.field.selectionEnd = this.pos - delta;
    };

    Chapelo.prototype.replace = function(pair, replaced) {
        var beginning = this.text.slice(0, this.pos - pair.length);
        var end = this.text.slice(this.pos);
        this.field.value = beginning + replaced + end;

        this.caret(pair.length - replaced.length);
    };

    Chapelo.prototype.replaceAll = function() {
        var chapelo = this;
        this.field.value = this.text.replace(this.re, function(match) {
            return chapelo.encode(match);
        });
    };

    Chapelo.prototype.cancel = function(key, pair) {
        var letter = pair[pair.length - 1];
        if (letter in this.reversed) {
            if (this.last.suffix) {
                this.replace(letter, this.reversed[letter] + this.last.suffix);
            } else if (this.last.prefix) {
                this.replace(letter, this.last.prefix + this.reversed[letter]);
            } else {
                this.replace(letter, this.reversed[letter]);
            }
            this.last = {prefix: "", suffix: ""};
            key.preventDefault();
        }
    };

    Chapelo.prototype.isLetter = function(key) {
        var letter = String.fromCharCode(key.keyCode);
        var pref = this.prefixes.join("");
        var suff = this.suffixes.join("");
        var re = new RegExp('['+ escape('a-zA-Z '+pref+suff) +']');

        if (re.test(letter)) {
            return true;
        } return false;
    };

    Chapelo.prototype.keydown = function(key) {
        var pair = this.pair();
        var codes = {Backspace: 8, Enter: 13};

        // Backspace key cancels
        if (key.keyCode === codes.Backspace) {
            this.cancel(key, pair);
        }

        // Ctrl+Enter replace all
        if (key.keyCode === codes.Enter && key.ctrlKey) {
            this.replaceAll();
        }
    };

    Chapelo.prototype.keyup = function(key) {
        var pair = this.pair();
        if (this.isLetter(key)) {
            var diphthonged = this.diphthong(pair);
            var affixed = this.affix(pair);
            if (diphthonged) {
                this.replace(pair, diphthonged);
            } else if (affixed) {
                this.replace(pair, affixed);
            }
        }
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

    var chapeligu = function(field, options) {
        var chapelo = new Chapelo(
            field,
            options.prefixes,
            options.suffixes,
            options.alphabet,
            options.diphthongs
        );

        $(field).keydown(function(key) {
            chapelo.keydown(key);
        });

        $(field).keyup(function(key) {
            chapelo.keyup(key);
        });
    };

})(jQuery);
