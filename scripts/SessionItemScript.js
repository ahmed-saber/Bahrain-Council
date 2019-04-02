﻿$(document).ready(function () {
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
                        <textarea id="lightboxEditor1" class="lightbox-editor-st2"></textarea>
                        <div class="mb-15"></div>
                        <textarea id="lightboxEditor2" class="lightbox-editor-st2"></textarea>
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
                    var $editors = $('.lightbox-editor-st2', $overlay);
                    var $editor1 = $('#lightboxEditor1', $overlay);
                    var $editor2 = $('#lightboxEditor2', $overlay);
                    var $list1 = $('#list1', $overlay);
                    var $list2 = $('#list2', $overlay);
                    var paramters = {
                        SessionItemID: false,
                        SessionSubItemID: false
                    };
                    // clone defaultOptions
                    var defaultOptionsClone = Object.assign(defaultOptions, {
                        height: 300,
                        paste_preprocess: function () { },
                        setup: function () { }
                    });
                    $editors.tinymce(defaultOptionsClone);
                    // SHOW LOADING
                    $.fancybox.showActivity();
                    // GET LIST
                    loadSessionItems(function (response) {
                        // LOOP
                        if (response && response.length) {
                            response.forEach(function (list) {
                                var addHTML = $('<div class="arrow" />').click(function (e) {
                                    // get caret position
                                    insertIntoSafeArea($editor1.tinymce(), list.Text);
                                    e.stopPropagation();
                                });
                                var $item = $('<li />').text(list.Text).append(addHTML).click(function () {
                                    var $this = $(this);
                                    $('li', $list1).not($this).removeClass('selected');
                                    $this.toggleClass('selected');
                                    // CHILDS
                                    $list2.html('');
                                    if ($this.hasClass('selected')) {
                                        paramters.SessionItemID = list.ID;
                                        list.SPlannedSubItems.forEach(function (child) {
                                            var addHTML = $('<div class="arrow" />').click(function (e) {
                                                // get caret position
                                                insertIntoSafeArea($editor2.tinymce(), child.Text);
                                                e.stopPropagation();
                                            });
                                            $list2.append($('<li />').text(child.Text).append(addHTML).click(function () {
                                                var $this = $(this);
                                                $('li', $list2).not($this).removeClass('selected');
                                                $this.toggleClass('selected');
                                                if ($this.hasClass('selected')) {
                                                    paramters.SessionSubItemID = child.ID;
                                                }
                                            }));
                                        });
                                    }
                                });
                                $list1.append($item);
                            });
                        }
                        // HIDE LOADING
                        $.fancybox.hideActivity();
                    });
                    // add procuder yes button
                    $(".approve-action", $overlay).click(function (e) {
                        if (paramters.SessionSubItemID && paramters.SessionItemID) {
                            // SHOW LOADING
                            $.fancybox.showActivity();
                            // SAVE
                            save_temp_item(paramters, function (response) {
                                // VARS
                                var values = response.split(',');
                                // SET VALUES
                                $('#sItemId').val(values[0]);
                                $('#sSubItemId').val(values[1]);
                                // close the popup
                                $.fancybox.close();
                                // HIDE LOADING
                                $.fancybox.hideActivity();
                            });

                        }
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

    function save_temp_item(o, callback) {
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
                SessionItemID: o.SessionItemID,
                SessionSubItemID: o.SessionSubItemID
            },
            dataType: 'json',
            success: callback
        });
    }
});