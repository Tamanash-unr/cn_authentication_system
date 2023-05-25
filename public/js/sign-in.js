{
    let forgotPassword = function(){
        let forgotPswdLink = $('#forgot-password');

        forgotPswdLink.click(function(evt){
            evt.preventDefault();
            let formData = $('#sign-in');

            $.ajax({
                type:'post',
                url: forgotPswdLink.prop('href'),
                data: formData.serialize(),
                success: function(data){
                    console.log(data);
                    createNoty(data.message.type, data.message.text);
                },
                error: function(error){
                    console.log(error.responseText);
                    let res = JSON.parse(error.responseText);

                    createNoty(res.message.type, res.message.text);
                }
            })
        })
    }

    // Method to Create Noty Message
    function createNoty(type, message){
        return new Noty({
                    theme: 'relax',
                    type: type,
                    layout: 'topRight',
                    text: message,
                    timeout: 5000,
                }).show();
    }

    forgotPassword();
}