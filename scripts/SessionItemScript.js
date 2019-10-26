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
            AgendaItemID: o.AgendaItemID,
            agendaitemtext: o.agendaitemtext,
            AgendaSubItemID: o.AgendaSubItemID,
            agendasubitemtext: o.agendasubitemtext,
            SessionItemID: o.SessionItemID,
            SessionSubItemID: o.SessionSubItemID
        },
        dataType: 'json',
        success: callback
    });
}

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
                        AgendaItemID: $(".agendaItemId").val(),
                        AgendaSubItemID: $(".agendaSubItemId").val(),
                        agendaitemtext: '',
                        agendasubitemtext: '',
                        SessionItemID: '',
                        SessionSubItemID: ''

                    };
                    // clone defaultOptions
                    var defaultOptionsClone = Object.assign({}, defaultOptions);
                    defaultOptionsClone.height = 620;
                    defaultOptionsClone.paste_preprocess = function () { };
                    defaultOptionsClone.setup = function () { };
                    $editors.tinymce(defaultOptionsClone);
                    // SHOW LOADING
                    $.fancybox.showActivity();
                    // GET LIST
                    loadSessionItems(function (response) {
                        // LOOP
                        if (response && response.length) {
                            // SET VALUES
                            var SessionItemID = $('.sItemId').val();
                            var SessionSubItemID = $('.sSubItemId').val();
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
                                            var arrow = $('<div class="arrow" />').click(function (e) {
                                                // get caret position
                                                insertIntoSafeArea($editor2.tinymce(), child.Text);
                                                e.stopPropagation();
                                            });
                                            var $subitem = $('<li />').text(child.Text).append(arrow).click(function () {
                                                var $this = $(this);
                                                $('li', $list2).not($this).removeClass('selected');
                                                $this.toggleClass('selected');
                                                if ($this.hasClass('selected')) {
                                                    paramters.SessionSubItemID = child.ID;
                                                }
                                            });
                                            $list2.append($subitem);
                                            // SELECTION
                                            if (child.ID == SessionSubItemID) {
                                                $subitem.trigger('click');
                                                $editor2.tinymce().execCommand('mceInsertRawHTML', false, $('.agendaSubItemTxt').html());
                                            }
                                        });
                                    }
                                });
                                // SELECTION
                                if (SessionItemID || SessionSubItemID) {
                                    if (list.ID == SessionItemID) {
                                        $item.trigger('click');
                                        $editor1.tinymce().execCommand('mceInsertRawHTML', false, $('.agendaItemTxt').html());
                                    }
                                }
                                $list1.append($item);
                            });
                        }
                        // HIDE LOADING
                        $.fancybox.hideActivity();
                    });
                    // add procuder yes button
                    $(".approve-action", $overlay).click(function (e) {
                        // SAVE THE TEXT
                        paramters.agendaitemtext = $editor1.val();
                        paramters.agendasubitemtext = $editor2.val();
                        // SHOW LOADING
                        $.fancybox.showActivity();
                        // SAVE
                        save_temp_item(paramters, function (response) {
                            // VARS
                            var values = response.split(',');
                            // SET VALUES
                            $('.sItemId').val(paramters.SessionItemID);
                            $('.sSubItemId').val(paramters.SessionSubItemID);
                            $(".agendaItemId").val($(".unAssignedAgendaId").val());
                            $(".agendaSubItemId").val(values[1]);
                            $('.agendaItemTxt').html(paramters.agendaitemtext);
                            if (values[0] != 0) {
                                $(".agendaItemId").val(values[0]);
                                $(".divAgenda").show();
                            }
                            $('.agendaSubItemTxt').html(paramters.agendasubitemtext);
                            if (values[1] != 0) {
                                $(".divSubAgenda").show();
                            }
                            // close the popup
                            $.fancybox.close();
                            // HIDE LOADING
                            $.fancybox.hideActivity();
                        });

                        e.preventDefault();
                    });
                }
            }
        );
        e.preventDefault();
    });

    // Insert text
    $(".btn_insertTextIn").click(function (e) {
        $.fancybox(`
            <div id="insertTextInOverlay" class ="lightbox-content-holder container_24">
                <div class="lightbox-head">
                    <h2>إدراج بند الى النص: </h2>
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
                    var $overlay = $('#insertTextInOverlay');
                    var $editor = $('#lightboxEditor1', $overlay);
                    var $list1 = $('#list1', $overlay);
                    var $list2 = $('#list2', $overlay);
                    // clone defaultOptions
                    var defaultOptionsClone = Object.assign({}, defaultOptions);
                    defaultOptionsClone.height = 620;
                    defaultOptionsClone.paste_preprocess = function () { };
                    defaultOptionsClone.setup = function () { };
                    // CLONE THE HTML FROM THE MAIN EDITOR
                    var mainEditor = getMainEditor();
                    var cleanHTML = htmlClean(mainEditor.getContent());
                    $editor.val(cleanHTML).tinymce(defaultOptionsClone);
                    // SHOW LOADING
                    $.fancybox.showActivity();
                    // GET LIST
                    loadSessionItems(function (response) {
                        // LOOP
                        if (response && response.length) {
                            // SET VALUES
                            var SessionItemID = $('.sItemId').val();
                            var SessionSubItemID = $('.sSubItemId').val();
                            response.forEach(function (list) {
                                var addHTML = $('<div class="arrow" />').click(function (e) {
                                    // get caret position
                                    var clone = $('<p/>').append(list.Text).css({
                                        "text-align": "right",
                                        "font-weight": "bold"
                                    });
                                    var cloneHTML = clone[0].outerHTML;
                                    insertIntoSafeArea($editor.tinymce(), cloneHTML);
                                    e.stopPropagation();
                                });
                                var $item = $('<li />').text(list.Text).append(addHTML).click(function () {
                                    var $this = $(this);
                                    $('li', $list1).not($this).removeClass('selected');
                                    $this.toggleClass('selected');
                                    // CHILDS
                                    $list2.html('');
                                    if ($this.hasClass('selected')) {
                                        list.SPlannedSubItems.forEach(function (child) {
                                            var arrow = $('<div class="arrow" />').click(function (e) {
                                                var clone = $('<p/>').append(child.Text).css({
                                                    "text-align": "right",
                                                    "font-weight": "bold"
                                                });
                                                var cloneHTML = clone[0].outerHTML;
                                                // get caret position
                                                insertIntoSafeArea($editor.tinymce(), cloneHTML);
                                                e.stopPropagation();
                                            });
                                            var $subitem = $('<li />').text(child.Text).append(arrow).click(function () {
                                                var $this = $(this);
                                                $('li', $list2).not($this).removeClass('selected');
                                                $this.toggleClass('selected');
                                            });
                                            $list2.append($subitem);
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
                        // bind the new value
                        mainEditor.execCommand('mceSetContent', false, $editor.val());
                        // close the popup
                        $.fancybox.close();
                        e.preventDefault();
                    });
                }
            }
        );
        e.preventDefault();
    });
});