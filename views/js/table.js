function draw_table(){
    $("#results").empty();
    $.getJSONuncached = function(url) {
        return $.ajax({
            url: url,
            type: 'GET',
            cache: false,
            success: function(html) {
                $("#results").append(html);
            }
        });
    };
    var url = document.querySelector("#urlGet").getAttribute("name")
    $.getJSONuncached(url)
}
$(document).ready(function(){
    draw_table();
})