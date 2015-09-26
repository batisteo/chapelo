
$(function () {
    function toggle() {
        var checkbox = $(this);
        var field = $('#' + checkbox.data('chap-field-id'));
        if (field[0]) {
            field[0].chapelo.active = checkbox.prop('checked');
        }
    }

    $('input:checkbox').each(toggle).change(toggle);
    
    $('textarea, :text, [type=search]').on('chapChange', function(e, isActive) {
        // Toggle checkbox state when the field is changed
        var checkbox = $('[data-chap-field-id="' + $(this).attr('id') +'"]');
        checkbox.prop('checked', isActive);
    });

    $('#chap-general-toggle').on("change switchChange.bootstrapSwitch", function() {
        // Toggle and disable all chap-field-toggle checkboxes along with general toggle
        var checked = $(this).prop('checked');
        $('textarea, :text, [type=search]').each(function() {
            if (this.chapelo !== undefined) {
                this.chapelo.active = checked;
            }
        })
        $('.chap-field-toggle').prop("disabled", !checked);
        $('.chap-field-toggle').prop("checked", checked).change();
    });
});
