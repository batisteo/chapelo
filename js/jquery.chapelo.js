/**
* @package Chapelo - jQuery Esperanto accents plugin
* @version 2.0.0
* @author Baptiste Darthenay <baptiste@darthenay.fr>
* @copyright Copyright (c) 2015, Baptiste Darthenay
* @license MIT License, see license.txt
*/

(function ($) {

    /*** Default options ***/

    var alphabet = {
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

    var eo = ["Ĉ", "Ĝ", "Ĥ", "Ĵ", "Ŝ", "Ŭ", "ĉ", "ĝ", "ĥ", "ĵ", "ŝ", "ŭ"]

    var prefixes = ["^"]

    var suffixes = ["X", "x", "H", "h", "^"]

    var diphthongs = {
        "AU": "AŬ",
        "EU": "EŬ",
        "Au": "Aŭ",
        "Eu": "Eŭ",
        "au": "aŭ",
        "eu": "eŭ"
    }

    var selectors = 'textarea, input[type="text"]'


    function Chapelo(field, alphabet, prefixes, suffixes, diphthongs) {
        this.field = field;
        this.alphabet = alphabet;
        this.prefixes = prefixes;
        this.suffixes = suffixes;
        this.diphthongs = diphthongs;
    }

    Chapelo.prototype.pair = function() {
        this.text = this.field.value;
        this.pos = this.field.selectionStart;
        return this.text.slice(this.pos -2, this.pos);
    }

    Chapelo.prototype.affix = function (pair) {
        if (this.prefixes.indexOf(pair[0]) > -1) {
            return this.alphabet[pair[1]]
        }
        if (this.suffixes.indexOf(pair[1]) > -1) {
            return this.alphabet[pair[0]]
        }
    }

    Chapelo.prototype.diphthong = function (pair) {
        return this.diphthongs[pair]
    }

    Chapelo.prototype.caret = function (delta) {
        this.field.selectionStart = this.pos - delta;
        this.field.selectionEnd = this.pos - delta;
    };

    Chapelo.prototype.replace = function(pair, replaced) {
        var beginning = this.text.slice(0, this.pos -2);
        var end = this.text.slice(this.pos);
        this.field.value = beginning + replaced + end;

        this.last = {
            "pair": pair,
            "replaced": replaced
        }

        this.caret(pair.length - replaced.length);
    }

    Chapelo.prototype.cancel = function(pair) {
        if (eo.indexOf(pair[1]) > -1) {
            this.replace(this.last["replaced"], this.last["pair"])
        }
    };

    Chapelo.prototype.keyup = function(key) {
        var pair = this.pair();
        if (key.key === 'Backspace') {
            this.cancel(pair)
        } else {
            var diphthonged = this.diphthong(pair);
            var affixed = this.affix(pair);
            if (diphthonged) {
                this.replace(pair, diphthonged)
            } else if (affixed) {
                this.replace(pair, affixed)
            }
        }
    }



    // jQuery plugin
    $.fn.chapelo = function(initial_options) {
        var options = $.extend({
            alphabet: alphabet,
            prefixes: prefixes,
            suffixes: suffixes,
            diphthongs: diphthongs,
            selectors: selectors
        }, initial_options);

        return this.filter(options.selectors)
                   .add(this.find(options.selectors))
                   .each(function() {
                       chapeligu(this, options);
                   })
    }

    var chapeligu = function(field, options) {
        var chapelo = new Chapelo(
            field,
            options.alphabet,
            options.prefixes,
            options.suffixes,
            options.diphthongs)

        $(field).keyup(function(key) {
            chapelo.keyup(key);
        });
    };

})(jQuery);
