function check_add(){
    var item_add = document.querySelector('#item_add').value
    var price_add = document.querySelector('#price_add').value

    if(item_add == "" || price_add == ""){
        alert("There was an error adding the item!")
    }
    else{
        alert("Item added successfully!")
    }
}
function check_rm(){
    var item_rm = document.querySelector('#item_rm').value

    if(item_rm == ""){
        alert("There was an error removing the item!")
    }
    else{
        alert("Item removed successfully!")
    }
}
$(document).ready(function(){
    $('#form-add').on("submit", function(){
        check_add()
    })
    $('#form-rm').on("submit", function(){
        check_rm()
    })
})
