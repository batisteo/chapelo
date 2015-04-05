/**
* @package Chapelo - jQuery Esperanto accents plugin
* @version 1.1.1
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

    var suffixes = ["X", "x", "H", "h", "^"];

    var diphthongs = {
        "AU": "AŬ",
        "EU": "EŬ",
        "Au": "Aŭ",
        "Eu": "Eŭ",
        "au": "aŭ",
        "eu": "eŭ"
    }

    var selectors = 'textarea, input[type="text"]';

    var specialRegexChars = ["^", "."];


    /*** Utility functions ***/

    escapeChar = function(char) {
        if (specialRegexChars.indexOf(char) > -1) {
            return "\\" + char;
        }
        return char;
    }


    function Chapelo(field, alphabet, suffixes, diphthongs) {

        this.field = field,
        this.alphabet = alphabet,
        this.suffixes = suffixes,
        this.diphthongs = diphthongs,
        this.caretPosition = this.field.selectionStart,
        this.switchedOff = $('#chap-general-toggle').prop('checked') === false,


        this.getRegex = function(dict, list) {
            var regex = "";
            if (list) {
                list.forEach(function(suffix){
                    for (var letter in dict) {
                        regex += letter + escapeChar(suffix) + "|";
                    }
                });
            } else {
                for (var diphthong in dict) {
                    regex += diphthong + "|";
                }
            }
            
            regex = regex.slice(0, -1);
            return new RegExp('('+ regex +')', 'g');
        },


        this.mustReplace = function(type) {
            if ($(this.field).hasClass('chap-'+ type +'-off')) {
                return false;
            }
            return true;
        },


        this.setCaret = function(text, regex, caretPosition, isDiphthong) {
            // Repositioning the caret
            var textBefore = text.slice(0, caretPosition + 1);
            var matches = textBefore.match(regex);
            var delta = 0;
            if (matches) {
                if (isDiphthong) {
                    delta = matches.length * 2;
                } else {
                    delta = matches.length;
                }
            }
            this.caretPosition = caretPosition - delta;
        },


        this.encode = function(match, a, index, string) {
            return alphabet[match[0]];
        };
        
        this.encodeDiphthong = function(match, a, index, string) {
            return diphthongs[match];
        };


        this.replaceAll = function() {
            // Replace prefixed Esperanto character with its Unicode equivalent
            if (this.switchedOff || !this.mustReplace('field')) { return }

            if (this.mustReplace('suffix')) {
                var text = this.field.value;
                var regex = this.getRegex(this.alphabet, this.suffixes);
                if (text.match(regex)) {
                    this.field.value = text.replace(regex, this.encode);
                    this.setCaret(text, regex, this.caretPosition);
                }
            }

            if (this.mustReplace('diphthong')) {
                var text = this.field.value;
                var regexDiphthong = this.getRegex(this.diphthongs);
                if (text.match(regexDiphthong)) {
                    this.field.value = text.replace(regexDiphthong, this.encodeDiphthong);
                    this.setCaret(text, regex, this.caretPosition, true);
                }
            }

            this.field.selectionStart = this.caretPosition;
            this.field.selectionEnd = this.caretPosition;
        }
    }


    /*** jQuery plugin ***/

    $.fn.chapelo = function(initial_options) {
        var options = $.extend({
            alphabet: alphabet,
            suffixes: suffixes,
            diphthongs: diphthongs,
            selectors: selectors,
            specialRegexChars: specialRegexChars
        }, initial_options);

        return this.filter(options.selectors)
                   .add(this.find(options.selectors))
                   .each(function() {
            $(this).keyup(function(e) {
                new Chapelo(this, options.alphabet, options.suffixes, options.diphthongs).replaceAll();
            });
        });
    };
})(jQuery);


$(function () {

    /*** Checkbox helpers ***/

    function chapToggleField() {
        // Add and remove class "chap-field-off"
        var checkbox = $(this);

        var fieldID = checkbox.data("chap-toggle-id");
        if (fieldID !== undefined) {
            field = $('#'+fieldID);
            field.toggleClass('chap-field-off', !checkbox.prop('checked'));
        }

        var fieldClass = checkbox.data("chap-toggle");
        if (fieldClass !== undefined) {
            fields = $('.'+fieldClass);
            fields.each(function() {
                $(this).toggleClass('chap-field-off', !checkbox.prop('checked'))
                    .trigger('chapChange', checkbox.prop('checked'));
            });
        }
    }

    $('input:checkbox').each(chapToggleField);    // On page load
    $('input:checkbox').change(chapToggleField);  // On click

    $('textarea, input[type="text"]').on('chapChange', function(e, isActive) {
        // Toggle checkbox state when the field is changed
        var checkbox = $('[data-chap-toggle-id="' + $(this).attr('id') +'"]');
        checkbox.prop('checked', isActive);
    });

    $('#chap-general-toggle').on("change switchChange.bootstrapSwitch", function() {
        // Toggle and disable all chap-field-toggle checkboxes along with general toggle
        var checked = $(this).prop('checked');
        $('.chap-field-toggle').prop("disabled", !checked);
        $('.chap-field-toggle').prop("checked", checked).change();
    });
});
