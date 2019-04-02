

$(document).ready(function () {

    //////////////////// Votes
    // Load votes
    $(".addingNewPlannedSessionItem").click(function (e) {
       
        loadSessionItems();
       
        e.preventDefault();
    });

  

    function loadSessionItems() {
   
        jQuery.ajax({
            cache: false,
            type: 'post',
            url: 'SessionItemHandler.ashx',
            data: {
                funcname: 'GetSessionItems',
                sid: $(".sessionID").val()
            },
            dataType: 'json',
            success: function (response) {
                var option;
                var label;
                var div;
               
               /* for (i = 0; i < response.length; i++) {
                    option = $('<div>').attr({
                        html: response[i].text
                    });
                    //console.log(response[i].text)
                   
                }*/

            }
        });
    }

    function save_temp_item()
    {
        jQuery.ajax({
            cache: false,
            type: 'post',
            url: 'SessionItemHandler.ashx',
            data: {
                funcname: 'AddEditAgenda',
                sid: $(".sessionID").val(),
                AgendaItemID: 0,//$(".agendaItemId").val(),
                agendaitemtext: "data from textbox --",// $(".sessionID").val(),
                AgendaSubItemID:0,// $(".agendaSubItemId").val(),
                agendasubitemtext:"teest sun from text box subitem --",// $(".sessionID").val(),
                SessionItemID: 1,// $(".sItemId").val(),
                SessionSubItemID:1,// $(".sSubItemId").val(),
            },
            dataType: 'json',
            success: function (response) {
               console.log(response)

            }
        });
    }

});