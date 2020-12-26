$(document).ready(function(){
    $('#button_confirm').on("click", function(){
        $.ajax(
        {
            url: "/post/json/confirm",
            type: "POST",
            cache: false,
        })
        window.location.href = "/"
    })
})