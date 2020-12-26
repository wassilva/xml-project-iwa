function check_add(){
    var sec_add = document.querySelector("#sec_add").value,
        item_add = document.querySelector("#item_add").value,
        price_add = document.querySelector("#price_add").value
    $.getJSONuncached = function(url) {
        $.ajax({
            url: url,
            type: 'POST',
            data:{
                sec_add: sec_add,
                item_add: item_add,
                price_add: price_add
            },
            cache: false,
            success: function(html){
                if (html != "invalid input!"){ 
                    alert("Item added successfully!")
                }
                else {
                    alert("There was an error adding the item!")
                }
            }
        })
    }
    var url = document.querySelector("#add").getAttribute("name")
    $.getJSONuncached(url)
}
function check_rm(){
    var sec_rm = document.querySelector("#sec_rm").value,
        item_rm = document.querySelector("#item_rm").value
    $.getJSONuncached = function(url) {
        $.ajax({
            url: url,
            type: 'POST',
            data:{
                sec_rm: sec_rm,
                item_rm: item_rm
            },
            cache: false,
            success: function(html){
                if (html != "invalid input!"){ 
                    alert("Item removed successfully!")
                }
                else {
                    alert("There was an error removing the item!")
                }
            }
        })
    }
    var url = document.querySelector("#rm").getAttribute("name")
    $.getJSONuncached(url)
}

$(document).ready(function(){
    
    $('#form-add').on("submit", function(e){
        e.preventDefault()
        check_add()
        draw_table()
    })
    $('#form-rm').on("submit", function(e){
        e.preventDefault()
        check_rm()
        draw_table()
    })
})
