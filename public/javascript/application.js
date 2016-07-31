function find(id, selectedContact, callback) {
    $.getJSON('/api/contacts/'+id, function(data, err){
        if (err !== "success" || data.error ) {
            alert("Failed to get the contact detail");
        } else {
            var html = '<div class="phone-number"><hr>';
            data.phone_numbers.forEach(function(phoneNumber){
                var number = phoneNumber.number;
                var description = phoneNumber.description;
                var element = '<div class="chip">' + description + ': ' + number + '</div>';
                html += element;
            });
            html += '</div>';
            var numberBlock = $(html);
            selectedContact.find('.info-cell').append(numberBlock);
            callback();
        }
    });
}

$(document).ready(function() {

    $('#new-btn').click(function(){
        var btn = $(this);
        if (btn.hasClass('disabled'))
            return;
        btn.addClass('disabled');
        $('#new-field').slideToggle(function(){
            btn.removeClass('disabled');
        });
    });

    // Clicked Detail Button
    $('#index-field').on('click','.detail-btn',function(){
        var clickedContact = $(this).closest('.contact-cell');
        var clickedButton = $(this);

        if (clickedButton.hasClass('disabled'))
            return;

        clickedButton.addClass('disabled');

        if (clickedContact.hasClass('expanded')) {
            clickedContact.find('.phone-number').slideUp('fast',function(){
                clickedContact.find('.phone-number').remove();
                clickedContact.removeClass('expanded');
                clickedButton.removeClass('disabled');
            });
        } else {
            var id = clickedContact.data('contact-id');
            find(id, clickedContact, function(){
                clickedContact.addClass('expanded');
                clickedContact.find('.phone-number').slideDown('fast');
                clickedButton.removeClass('disabled');
            });
        }
    });

    // Clicked Delete Button
    $('#index-field').on('click', '.delete-btn', function(){
        var clickedButton = $(this);
        var clickedContact = $(this).closest('.contact-cell');

        $.ajax({
            method: 'post',
            url: '/contacts/' + clickedContact.data('contact-id'),
            data: {
                _method: 'delete'
            },
            success: function(data){
                if (data.status == 'success') {
                    clickedContact.fadeOut('fast', function(){
                        clickedContact.remove();
                    });
                }
            }
        });

    });

    // New Contact Save Triggered
    $('#new-field').on('submit','form',function(event){
        event.preventDefault();
        var form = $(this);
        $.ajax({
            method: form.attr('method'),
            url: form.attr('action'),
            data: form.serialize(),
            success: function(data) {
                $('#index-field').find('ul').prepend(data);
            }
        });
    })

});
