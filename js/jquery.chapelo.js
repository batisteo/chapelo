/**
* @package Chapelo - jQuery Esperanto accents plugin
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

    var suffixes = ["X", "x", "H", "h"];

    var selectors = 'textarea, input[type="text"]';


    /*** Utility functions ***/

    function getRegex(alphabet, suffixes) {
        var str = "";
        suffixes.forEach(function(suffix){
            for (var letter in alphabet) {
                str += letter + suffix + "|";
            }
        });
        str = str.substring(0, str.length - 1);
        return new RegExp('('+ str +')', 'g');
    }

    function encode(regex, alphabet) {
        // Replace prefixed Esperanto character with its Unicode equivalent
        var text = this.value;

        if (text.match(regex)) {
            var caretPosition = this.selectionStart;
            var textBefore = this.value.slice(0, caretPosition + 1);
            var match = textBefore.match(regex);

            this.value = text.replace(regex, function(match){
                return alphabet[match[0]];
            });

            if (match) {
                // Repositioning the caret
                this.selectionStart = caretPosition - match.length;
                this.selectionEnd = this.selectionStart;
            }
        }
    }


    $.fn.chapelo = function(settings) {
        var options = $.extend({
            alphabet: alphabet,
            suffixes: suffixes,
            selectors: selectors,
            encode: encode
        }, options);

        var regex = getRegex(options.alphabet, options.suffixes);

        return this.filter(options.selectors)
                   .add(this.find(options.selectors))
                   .each(function() {
            $(this).keyup(function(e) {
                options.encode.call(
                    this,
                    regex,
                    options.alphabet
                    );
            });
        });
    };
})(jQuery);

