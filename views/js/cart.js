$(document).ready(function(){
    show_cart();
    $('#totalBill').on(calculateBill())
})
function show_cart(){
    $('#cart').empty();
    $.getJSONuncached = function(url){
        return $.ajax({
            url: url,
            type: 'GET',
            cache: false,
            success: function(html){
                $('#cart').append(html)
            }
        })
    }
    var url = document.querySelector('#urlGet').getAttribute("name")
    $.getJSONuncached(url)
}
function calculateBill(idMenuTable) {
    var fBillTotal = 0.0;
    var i = 0;
    var oTable = document.getElementById(idMenuTable);
    var oTDPrices = oTable.getElementsByClassName('prices');
    console.log(JSON.stringify(aCBTags,null," "))
    for (i = 0; i < oTDPrices.length; i++) {
            fBillTotal += parseFloat(oTDPrices[i].firstChild.data);
    };
    return Math.round(fBillTotal * 100.0) / 100.0;
};