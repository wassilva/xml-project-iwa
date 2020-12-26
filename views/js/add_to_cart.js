function add_to_cart(){
    var choose = document.querySelector("#urlGet").getAttribute("name")
    if(choose == '/get/car'){
        var car = $(".car:checked").val(),
            model = $(".model:checked").val(),
            door = $(".door:checked").val()
            accessory = new Array();
        $('input[name="accessory[]"]:checked').each(function(){
            accessory.push($(this).val());
        });
        var data = {
            car: car,
            model: model,
            accessory: accessory,
            door: door
        }
    }
    else{
        var motorcycle = $(".motorcycle:checked").val(),
            grips = $(".grips:checked").val(),
            seat = $(".seat:checked").val()
            helmets = new Array();
        $('input[name="helmets[]"]:checked').each(function(){
            helmets.push($(this).val());
        });
        var data = {
            motorcycle: motorcycle,
            helmets: helmets,
            seat: seat,
            grips: grips
        }
    }
    
    $.getJSONuncached = function(url) {
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            cache: false,
            success: function(html){
                if (html != "invalid input!"){ 
                    window.location.href = "/cart"
                }
                else {
                    alert("Something went wrong when adding to cart")
                }
            }
        })
    }
    var url = document.querySelector("#cart").getAttribute("name")
    $.getJSONuncached(url)
}

$(document).ready(function(){
    $('#btn-submit-cart').on("click", function(){
        add_to_cart()
    })
})