$(document).ready(function () {
    //////////////////// Votes
    // Load votes
    $(".addingNewPlannedSessionItem").click(function (e) {
        $.fancybox(`
            <div id="sessionItemsOverlay" class="lightbox-content-holder container_24">
                <div class="lightbox-head">
                    <h2>اضافة فهرس من جدول الاعمال :</h2>
                </div>
                <div class="row">
                    <div class="grid_6">
                        <ul id="list1" class="listData-st2">
                        </ul>
                        <ul id="list2" class="listData-st2">
                        </ul>
                    </div>
                    <div class="grid_19">
                        <textarea name="elm1" class="lightbox-editor-st2"></textarea>
                        <textarea name="elm2" class="lightbox-editor-st2"></textarea>
                    </div>
                </div>
                <div class="lightbox-actions-holder fl">
                    <input type="button" value="موافق" class="approve-action" />
                </div>
                <div class="clear"></div>
            </div>`,
            {
                width: 700,
                'onComplete': function (e) {
                    // VARS
                    var $overlay = $('#sessionItemsOverlay');
                    // SHOW LOADING
                    $.fancybox.showActivity();
                    // GET LIST
                    loadSessionItems(function (response) {
                        // HIDE LOADING
                        $.fancybox.hideActivity();
                    });
                    // add procuder yes button
                    $(".approve-action", $overlay).click(function (e) {
                        // close the popup
                        $.fancybox.close();
                        e.preventDefault();
                    });
                }
            }
        );
        e.preventDefault();
    });

    function loadSessionItems(callback) {
        jQuery.ajax({
            cache: false,
            type: 'post',
            url: 'SessionItemHandler.ashx',
            data: {
                funcname: 'GetSessionItems',
                sid: $(".sessionID").val()
            },
            dataType: 'json',
            success: callback
        });
    }

    function save_temp_item() {
        jQuery.ajax({
            cache: false,
            type: 'post',
            url: 'SessionItemHandler.ashx',
            data: {
                funcname: 'AddEditAgenda',
                sid: $(".sessionID").val(),
                AgendaItemID: 0,//$(".agendaItemId").val(),
                agendaitemtext: "data from textbox --",// $(".sessionID").val(),
                AgendaSubItemID: 0,// $(".agendaSubItemId").val(),
                agendasubitemtext: "teest sun from text box subitem --",// $(".sessionID").val(),
                SessionItemID: 1,// $(".sItemId").val(),
                SessionSubItemID: 1,// $(".sSubItemId").val(),
            },
            dataType: 'json',
            success: function (response) {
                console.log(response)
            }
        });
    }
});