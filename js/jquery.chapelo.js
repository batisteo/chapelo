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

    var selectors = 'textarea, input[type="text"]';


    /*** Utility functions ***/

    function escape(char) {
        var toEscape = ["^", "."];
        if (toEscape.indexOf(char) > -1) {
            return "\\" + char;
        }
        return char;
    }

    function getRegex(alphabet, suffixes) {
        var str = "";
        suffixes.forEach(function(suffix){
            for (var letter in alphabet) {
                str += letter + escape(suffix) + "|";
            }
        });
        str = str.slice(0, -1);
        return new RegExp('('+ str +')', 'g');
    }

    function must_replace(field) {
        var generalOff = $('#chap-general-toggle').prop('checked') === false;
        if (generalOff) {
            return false;
        }
        if ($(field).hasClass('chap-off')) {
            return false;
        }
        return true;
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


    /*** jQuery plugin ***/

    $.fn.chapelo = function(initial_options) {
        var options = $.extend({
            alphabet: alphabet,
            suffixes: suffixes,
            selectors: selectors,
            encode: encode
        }, initial_options);

        var regex = getRegex(options.alphabet, options.suffixes);

        return this.filter(options.selectors)
                   .add(this.find(options.selectors))
                   .each(function()
        {
            $(this).keyup(function(e) {
                if (must_replace(this)) {
                    options.encode.call(
                        this,
                        regex,
                        options.alphabet
                        );
                }
            });
        });
    };
})(jQuery);


$(function () {

    /*** Checkbox helpers ***/

    function chapToggleField() {
        // Add and remove class "chap-off"
        var checkbox = $(this);

        var fieldID = checkbox.data("chap-toggle-id");
        if (fieldID !== undefined) {
            field = $('#'+fieldID);
            field.toggleClass('chap-off', !checkbox.prop('checked'));
        }

        var fieldClass = checkbox.data("chap-toggle");
        if (fieldClass !== undefined) {
            fields = $('.'+fieldClass);
            fields.each(function() {
                $(this).toggleClass('chap-off', !checkbox.prop('checked'))
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
