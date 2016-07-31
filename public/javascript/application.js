function find(id, selectedContact, callback) {
    $.getJSON('/api/contact/'+id, function(data, err){
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

// Input a contact's JSON data
// Output a DOM with .contact-cell
function renderContactCell(data) {
    var DEFAULT_AVATAR = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTinxdP7P880WTMS_X8Kt8_sq0PQr7ybwjmtj_vDJgMXFIfgfOczW96VA';
    var html = `<li class="collection-item avatar contact-cell row" data-contact-id="${data.id}">
          <div class="col s12 m8 info-cell">
            <img src="${data.avatar || DEFAULT_AVATAR}" alt="avatar" class="circle responsive-img">
            <span data-key="name">Name: ${data.first_name + ' ' + data.last_name}</span><br>
            <span data-key="email">Email: ${data.email}</span><br>
            <span data-key="address">Address: ${data.address}</span>
          </div>
          <div class="col s12 m4 btn-cell right-align">
            <button class="delete-btn btn red lighten-2 waves-effect">Delete</button>
            <button class="edit-btn btn green lighten-2 waves-effect">Edit</button>
            <button class="detail-btn btn blue lighten-2 waves-effect">Detail</button>
          </div>
        </li>`;
    return html;
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

    // Clicked Index Button
    $('#index-btn').click(function(){
        $.ajax({
            method: 'get',
            url: '/api/contacts',
            beforeSend: function(){
                $('#index-field').find('li').remove();
            },
            success: function(data){
                data.forEach(function(contact){
                    var html = renderContactCell(contact);
                    $('#index-field').find('ul').append(html);
                });
            }
        });
    });

    // Search Triggered
    $('nav').on('submit','form',function(event){
        var form = $(this);
        event.preventDefault();
        $.ajax({
            method: 'get',
            url: '/api/contacts/search',
            data: {
                search: form.find('#search').val()
            },
            beforeSend: function(){
                $('#index-field').find('li').remove();
            },
            success: function(data){
                data.forEach(function(contact){
                    var html = renderContactCell(contact);
                    $('#index-field').find('ul').append(html);
                });
            }
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

                $('#index-field').find('ul').append(data);
                $('#new-field').find('input').val('');
                $('#new-field').slideUp();
            }
        });
    })

});
