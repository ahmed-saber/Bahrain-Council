﻿// clean html
function cleanHTML(value) {
    var emptyTagsBr = /<[\w]*(?=\s|>)(?!(?:[^>=]|=(['"])(?:(?!\1).)*\1)*?\sdata-mce-type=['"])[^>]*>\s*<\/[\w]*>/g;
    //var emptyTagsBr = /<[\w]*(?=\s|>)(?!(?:[^>=]|=(['"])(?:(?!\1).)*\1)*?\sdata-mce-type=['"])[^>]*>\s*(<br\s*[\/]?>)?\s*<\/[\w]*>/g;
    var cleaned = value.replace(emptyTagsBr, '');
    return value;
}

function typeableChars(e) {
    var keycode = e.keyCode;

    var valid =
        (keycode > 47 && keycode < 58) || // number keys
        keycode == 32 || // spacebar
        (e.keyCode == 8) || // backSpace
        (e.keyCode == 46) || //delete
        (keycode > 64 && keycode < 91) || // letter keys
        (keycode > 95 && keycode < 112) || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223);   // [\]' (in order)

    return valid;
}
// function for key press
function editorEvents(ed) {
    var color = 'red';
    // on keydown
    ed.onKeyDown.add(function (ed, e) {
        // to disable the merge of p tag with span tags
        var backSpaceKey = (e.keyCode == 8);
        var deleteKey = (e.keyCode == 46);
        // backspace
        if (backSpaceKey || deleteKey) {
            ed.undoManager.add();
            // get where the cursor position
            if (getCursorPosition(ed, function (OB) {
                if (backSpaceKey) {
                    if (OB.markAcPreviousSibling && OB.markAcPreviousSibling.nodeName == 'BR') {
                        OB.markAcPreviousSibling.remove();
                        return true;
                    } else if (OB.target && OB.previousSibling) {
                        if (
                            (OB.target.nodeName == 'P' && OB.previousSibling.nodeName == 'SPAN') ||
                            (OB.target.nodeName == 'SPAN' && OB.previousSibling.nodeName == 'P')
                        ) {
                            if (!(OB.markAcPreviousSibling && OB.markAcPreviousSibling.nodeName) || OB.markAcPreviousSibling.data == '') {
                                return true;
                            }
                        } else if (OB.target.nodeName == 'BODY') {
                            if (
                                (OB.markNextSibling.nodeName == 'P' && OB.markPreviousSibling.nodeName == 'SPAN') ||
                                OB.markNextSibling.nodeName == 'SPAN' && OB.markPreviousSibling.nodeName == 'P'
                            ) {
                                if (OB.markAcNextSibling.nodeName == '#text' && (OB.markAcPreviousSibling.nodeName == 'P' || OB.markAcPreviousSibling.data == '')) {
                                    return true;
                                }
                            }
                        }
                    }
                } else {
                    if (OB.target && OB.nextSibling) {
                        if (OB.markNextSibling && OB.markNextSibling.nodeName == 'BR') {
                            OB.markNextSibling.remove();
                            return true;
                        } else if (
                            (OB.target.nodeName == 'P' && OB.nextSibling.nodeName == 'SPAN') ||
                            (OB.target.nodeName == 'SPAN' && OB.nextSibling.nodeName == 'P')
                        ) {
                            if (!(OB.markAcNextSibling && OB.markAcNextSibling.nodeName) || OB.markAcNextSibling.data == '') {
                                return true;
                            }
                        } else if (OB.target.nodeName == 'BODY') {
                            if (
                                (OB.markNextSibling.nodeName == 'P' && OB.markPreviousSibling.nodeName == 'SPAN') ||
                                OB.markNextSibling.nodeName == 'SPAN' && OB.markPreviousSibling.nodeName == 'P'
                            ) {
                                if (OB.markAcPreviousSibling.nodeName == '#text' && (OB.markAcNextSibling.nodeName == 'P' || OB.markAcNextSibling.data == '')) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            })) {
                ed.undoManager.add();
                e.preventDefault();
            }
        }
        // clean up
        ed.execCommand('mceCleanup');
    });

    // check if the user writes on no where
    ed.onKeyPress.add(function (ed, e) {
        getCursorPosition(ed, function (OB) {
            var currentNode = OB.target;
            if (currentNode.nodeName == 'BODY' && e.charCode != 13) {
                // select the nearest tag
                var nextElement = OB.nextSibling;
                if (nextElement) {
                    var char = (e.keyCode == 32) ? '&nbsp;' : String.fromCharCode(e.keyCode);
                    var mark = $('<i>' + char + '</i>');
                    $(nextElement).prepend(mark);
                    ed.selection.select(mark[0]);
                    $(currentNode).find('[data-mce-type]').remove();
                    ed.execCommand('mceCleanup');
                    ed.selection.collapse(false);
                    ed.undoManager.add();
                    e.preventDefault();
                }
            }
        });
    });

    // onKeyUp on text tinyMCE editor
    ed.onKeyUp.add(function (ed, e) {
        var selectedTag = ed.selection.getEnd();
        // check if the backspace
        if (e.keyCode == 8 || e.keyCode == 46) {
            // to merge the spans together
            if (selectedTag.nodeName == 'SPAN' && selectedTag.nextSibling && selectedTag.nextSibling.nodeName == 'SPAN') {
                // VARS
                var $selectedTag = $(selectedTag);
                var nextSibling = selectedTag.nextSibling;
                var $nextSibling = $(nextSibling);
                // add the text to the selected tag
                $selectedTag.append($nextSibling.text());
                // remove the old on
                $nextSibling.remove();
                // clean up
                ed.execCommand('mceCleanup');
            };
            // convert all the spans in the p tags
            var $allChildSpans = $(ed.getBody()).find('p span');
            if ($allChildSpans.length) {
                $allChildSpans.each(function () {
                    // VARS
                    var $this = $(this);
                    // REPLACE the spans with text only
                    $this.replaceWith($this.text());
                });
            }
        }
        if (typeableChars(e)) {
            getCursorPosition(ed, function (OB) {
                if (
                    OB.target.nodeName == 'P' || OB.target.nodeName == 'SPAN'
                ) {
                    OB.target.style.background = color;
                } else if (OB.nextSibling.nodeName == 'SPAN' || OB.nextSibling.nodeName == 'P') {
                    OB.nextSibling.style.background = color;
                }
            });
        }
        ed.undoManager.add();
    });
}

// get where the cursor position
function getCursorPosition(ed, callBack, mv) {
    // vars
    var objects = {};
    // Stores a bookmark of the current selection
    var bm = ed.selection.getBookmark();
    // get the mark
    objects.bm = bm;
    objects.$mark = $(ed.getBody()).find('#' + bm.id + '_start');
    objects.mark = objects.$mark[0];
    if (mv) {
        objects.markNextSibling = (objects.mark.nextElementSibling) ? $.clone(objects.mark.nextElementSibling) : objects.mark.nextElementSibling;
        objects.markPreviousSibling = (objects.mark.previousElementSibling) ? $.clone(objects.mark.previousElementSibling) : objects.mark.previousElementSibling;
        objects.markAcNextSibling = (objects.mark.nextSibling) ? $.clone(objects.mark.nextSibling) : objects.mark.nextSibling;
        objects.markAcPreviousSibling = (objects.mark.previousSibling) ? $.clone(objects.mark.previousSibling) : objects.mark.previousSibling;
    } else {
        objects.markNextSibling = (objects.mark.nextElementSibling);
        objects.markPreviousSibling = (objects.mark.previousElementSibling);
        objects.markAcNextSibling = (objects.mark.nextSibling);
        objects.markAcPreviousSibling = (objects.mark.previousSibling);
    }
    // define the real parent target
    objects.$target = objects.$mark.parentsUntil('body').last();
    // if there is parent
    if (objects.$target[0]) {
        objects.target = objects.$target[0];
        // get next and prev sibling
        objects.nextSibling = (objects.target.nextElementSibling) ? objects.target.nextElementSibling : false;
        objects.previousSibling = (objects.target.previousElementSibling) ? objects.target.previousElementSibling : false;
    } else {
        objects.$target = $(ed.getBody());
        objects.target = ed.getBody();
        // get next and prev sibling
        objects.nextSibling = (objects.markNextSibling) ? objects.markNextSibling : false;
        objects.previousSibling = (objects.markPreviousSibling) ? objects.markPreviousSibling : false;
    }
    // get accurate next and prev sibling
    objects.acNextSibling = (objects.target.nextSibling) ? $.clone(objects.target.nextSibling) : objects.nextSibling;
    objects.acPreviousSibling = (objects.target.previousSibling) ? $.clone(objects.target.previousSibling) : objects.previousSibling;
    // add more info
    objects.collapsed = ed.selection.getRng().collapsed;
    objects.startOffset = ed.selection.getRng().startOffset;
    objects.endOffset = ed.selection.getRng().endOffset;
    // move bookmark
    if (mv) {
        // Restore the selection bookmark
        ed.selection.moveToBookmark(bm);
    }
    // check callback
    if (callBack) {
        // call the function
        var callBackData = callBack(objects);
        // move bookmark
        if (!mv) {
            // Restore the selection bookmark
            ed.selection.moveToBookmark(bm);
        }
        // return
        return callBackData;
    }
    // return
    return objects;
}

function changeButtonsForSessionStatus() {
    var hdisCurrentUserFileRev = $('.isCurrentUserFileRev');
    if (hdisCurrentUserFileRev && hdisCurrentUserFileRev.val() != null) {
        if (hdisCurrentUserFileRev.val() == "true") {
            $('.btnApproveSession').css("display", "none");
            $('.btnFinalApproveSession').css("display", "none");
            return;
        }
    }

    jQuery.ajax({
        cache: false,
        type: 'post',
        url: 'ReviewerHandler.ashx',
        data: {
            funcname: 'GetSessionStatus',
            sid: $('#MainContent_SessionIDHidden').val()
        },
        success: function (response) {
            if (response == "-1") {
                return -1;
            } else {


                //new = 1
                //InProg = 2
                //completed = 3
                //Approv = 4
                //finalApprove = 5
                var sessionStatus = parseInt(response);

                if (sessionStatus == 1 || sessionStatus == 2 || sessionStatus == 5) {
                    $('.btnApproveSession').css("display", "none");
                    $('.btnFinalApproveSession').css("display", "none");
                } else if (sessionStatus == 3) {


                    $('.btnApproveSession').css("display", "inline");
                    $('.btnFinalApproveSession').css("display", "none");
                } else if (sessionStatus == 4) {
                    $('.btnApproveSession').css("display", "none");
                    $('.btnFinalApproveSession').css("display", "inline");
                }
                //    return parseInt(response);
            }
        },
        error: function () {
            //return -1;
        }
    });
}

$(document).ready(function () {
    //
    $('.Edititem').hoverIntent(function (e) {
        var $this = $(this);

        $('#spnToolTipFileName').html($this.attr('data-filename'));
        $('#spnToolTipUserName').html($this.attr('data-username'));
        $('#spnToolTipFileRevName').html($this.attr('data-filerevname'));
        $('#spnToolTipRevName').html($this.attr('data-revname'));

        $('#divToolTip').css({
            top: e.pageY - 50,
            left: $this.parent().offset().left + 10
        }).fadeIn();
    }, function () {
        $('#divToolTip').fadeOut();
    });

    // tinymce end
    var lastEditedDiv;
    $(".openeditem .Edititem").click(function () {
        lastEditedDiv = $(this);
        if ($(this).attr('data-isSessionStart') == "1") {
            document.location = '/SessionStart.aspx?sid=' + getParameterByName('sid') + '&reviewmode=1';
            return;
        }
        var id = $(this).attr('data-scid');
        var currentUserID = $('.currentUserID').val();
        var sessionFileID = $(this).attr('data-sfid');
        var segRevID = $(this).attr('data-filerevid');
        var ed = $('#SessionContentItemIDHidden');
        var note = $(this).attr('data-revnote');
        ed.val(id);

        var isCurrentUserFileRev = $('.isCurrentUserFileRev').val();

        if (isCurrentUserFileRev == 'true' && currentUserID != segRevID) {
            jQuery.ajax({
                cache: false,
                type: 'post',
                url: 'ReviewerHandler.ashx',
                data: {
                    funcname: 'IsSessionFileLockedByFileRev',
                    scid: id
                },
                success: function (response) {
                    // alert(response)
                    if (response == "true") {
                        //alert("yes locked");
                    } else {

                        //alert("no");
                        var approve = confirm("لم يتم تخصيص الملف الخاص بهذا المقطع لمراجع ملف ... هل ترغب بأن تكون مراجع هذا الملف؟");

                        if (approve) {
                            //alert('sfid ' + sessionFileID + ' currentuserid ' + currentUserID);

                            jQuery.ajax({
                                cache: false,
                                type: 'post',
                                url: 'AdminHandler.ashx',
                                data: {
                                    funcname: 'AssignSessionFileReviewer',
                                    sfid: sessionFileID,
                                    uid: currentUserID,
                                    semail: 'false'
                                },
                                success: function (response) {
                                    // alert(response)
                                    if (response == "true") {
                                        //alert("yes assigned");
                                        // location.reload();
                                    } else {
                                        return false;
                                    }
                                },
                                error: function () {
                                    //return -1;
                                }
                            });
                        } else {

                            return false;
                        }
                    }
                },
                error: function () {
                    //return -1;
                }
            });

        } //end if rev
        else {
            var parent = $(this).parents('.openeditem');
            var MP3FilePath = parent.find('.MP3FilePath').val()
            var MP3FileStartTime = Math.floor(parent.find('.MP3FileStartTime').val())
            var MP3FileEndTime = Math.floor(parent.find('.MP3FileEndTime').val())
            var AudioPlayer = $("#jquery_jplayer_1");
            // jplayer
            AudioPlayer.jPlayer('destroy').jPlayer({
                swfPath: "/scripts/jPlayer/",
                wmode: "window",
                solution: 'html, flash',
                supplied: "mp3",
                preload: 'metadata',
                volume: 1,
                cssSelectorAncestor: '#jp_container_1',
                errorAlerts: false,
                warningAlerts: false,
                ready: function () {
                    // play the jplayer
                    $(this).jPlayer("setMedia", {
                        mp3: MP3FilePath // mp3 file path
                    }).jPlayer("play", MP3FileStartTime);
                },
                timeupdate: function (event) {
                    if (!$(this).data("jPlayer").status.paused) {
                        ed = $('textarea.tinymce').tinymce()
                        // all span segments
                        var all_spans_segments = $('span.segment', ed.contentDocument);
                        // remove all classes
                        all_spans_segments.removeClass('highlight editable');
                        // highlight the word by time
                        var playertime = event.jPlayer.status.currentTime;
                        if (Math.round(playertime) > MP3FileEndTime) {
                            AudioPlayer.jPlayer('pause', MP3FileStartTime)
                        } else if (Math.floor(playertime) < MP3FileStartTime) {
                            AudioPlayer.jPlayer('play', MP3FileStartTime)
                        } else {
                            //
                            var playerfixedTime = playertime.toFixed(2);
                            var playerfixedTimeString = playerfixedTime.toString();
                            var playerfixedTimeToArray = playerfixedTimeString.split('.');
                            // highlight the span
                            var highlight = all_spans_segments.filter('span.segment[data-stime^=' + playerfixedTimeToArray[0] + '\\.]');
                            if (highlight.length > 1) {
                                highlight = highlight.filter(function () {
                                    // get the nearest span
                                    var spanTime = $(this).attr('data-stime')
                                    var spanTimeToArray = spanTime.split('.');
                                    var spanfragment = spanTimeToArray[1];
                                    var playerfragment = playerfixedTimeToArray[1];
                                    if (playerfragment >= spanfragment) {
                                        return $(this);
                                    }
                                }).filter(':last')
                            }
                            // highlight
                            highlight.addClass('highlight')
                        }
                        if ($.browser.msie && $.browser.version == '9.0') {
                            if (Math.round(playertime) > MP3FileEndTime || Math.floor(playertime) < MP3FileStartTime) {
                                AudioPlayer.jPlayer('stop')
                            }
                        }
                    }
                }
            });


            if (lastEditedDiv.hasClass('reditem') || lastEditedDiv.hasClass('blueitem') || lastEditedDiv.hasClass('greenitem') || lastEditedDiv.hasClass('brownitem')) {
                $('#approve').show();
            } else {
                $('#approve').hide();
            }
            if (lastEditedDiv.hasClass('reditem')) {
                $('#reject').hide();
            } else {
                $('#reject').show();
            }

            //alert($(this).attr('data-sfid')); alert($(this).attr('data-scid'));

            $('#IsSessionStartHidden').val($(this).attr('data-isSessionStart'));
            mode = 3;
            sfid = $(this).attr('data-sfid');
            sid = getParameterByName('sid');
            if (window.location.pathname.toLowerCase().indexOf("prereview") != -1) {
                mode = 1;
                sfid = getParameterByName('sfid');
                sid = $('.SessionIDHidden').val();
            }
            if ($('#IsSessionStartHidden').val() == "0")
                $("#lnkMoreEditOptions").attr('style', 'display:block').attr('href', 'EditSessionFile.aspx?scid=' + $(this).attr('data-scid') + '&sfid=' + sfid + '&editmode=' + mode + '&sid=' + sid);
            else
                $("#lnkMoreEditOptions").attr('style', 'display:none');

            $(".popupoverlay").show();
            $(".reviewpopup_cont").show();

            //koko2
            $(".datacontainer textarea").val($(this).html());
            $("#note").val(note);

            $(".datacontainer textarea").tinymce().undoManager.clear();

            $(".datacontainer textarea").elastic();
            $(".datacontainer textarea").trigger('update');
        } //end else
    });

    $(".divcontent").scroll(function () {
        $(".popupoverlay").css({
            top: $(this).scrollTop()
        })

    });

    $(".close_btn").click(function () {
        var AudioPlayer = $("#jquery_jplayer_1");
        // jplayer
        AudioPlayer.jPlayer('pause')
        $(".popupoverlay").hide();
        $(".reviewpopup_cont").hide();
    });

    // popup buttons actions
    $('#approve').click(function () {
        var ed = $('.reviewpopup_cont');

        lastEditedDiv.attr("data-revnote", $('#note').val());
        // Do you ajax call here, window.setTimeout fakes ajax call
        $('.absLoad.loading').show(); // Show progress
        var calledFuncName = 'ApproveSessionContentItem';
        var calledHandlerName = 'ReviewerHandler.ashx';
        if ($('#IsSessionStartHidden').val() == '1') {
            calledFuncName = 'ApproveSessionStart';
            calledHandlerName = 'SessionStartHandler.ashx';
        }
        jQuery.ajax({
            cache: false,
            type: 'post',
            url: calledHandlerName, //'ReviewerHandler.ashx',
            data: {
                funcname: calledFuncName,
                sid: $('#MainContent_SessionIDHidden').val(), //used for item 
                scid: $('#SessionContentItemIDHidden').val(), //used for item 
                sfid: $('#SessionContentItemIDHidden').val(), //used for stat this val contain fileID of start
                reviewernote: $('#note').val() //used for item and start
            },
            success: function (response) {

                if (response == '-2') {
                    alert('لا يجوز الموافقة علي نص مدرج تحت متحدث او بند غير معرف');

                    $('.absLoad.loading').hide();
                } else


                    if (response != '1') {
                        alert('لقد حدث خطأ');
                    } else {




                        $('#note').val("");

                        if (lastEditedDiv.hasClass('reditem')) {
                            lastEditedDiv.removeClass("reditem");
                            $('#spnRejectCount').text(parseInt($('#spnRejectCount').text()) - 1);
                        } else if (lastEditedDiv.hasClass('greenitem')) {
                            $('#spnFixCount').text(parseInt($('#spnFixCount').text()) - 1);
                            lastEditedDiv.removeClass("greenitem");
                        } else if (lastEditedDiv.hasClass('blueitem')) {
                            $('#spnModAfterApprove').text(parseInt($('#spnModAfterApprove').text()) - 1);
                            lastEditedDiv.removeClass("blueitem");
                        } else if (lastEditedDiv.hasClass('brownitem')) {
                            lastEditedDiv.removeClass("brownitem");
                        }

                        if ((parseInt($('#spnRejectCount').text()) == 0) &&
                            (parseInt($('#spnFixCount').text()) == 0) &&
                            (parseInt($('#spnModAfterApprove').text()) == 0)) {

                            changeButtonsForSessionStatus();

                        }


                        //lastEditedDiv.closest("div").removeClass("reditem");
                        //koko

                        $('.absLoad.loading').hide();
                    }
            },
            error: function () {
                $('.absLoad.loading').hide();
            }
        });
        // close popup
        $.fancybox.close()
        $(".popupoverlay").hide();
        $(".reviewpopup_cont").hide();
        var AudioPlayer = $("#jquery_jplayer_1");
        AudioPlayer.jPlayer('pause');
    })



    // popup buttons actions
    $('.approveSessionFile').click(function () {

        var currFile = $(this);
        var fileID = currFile.attr('data-fileid');
        var fileName = currFile.text();
        if (confirm("هل انت متأكد انك ترغب في الموافقة على جميع المقاطع الخاصة بالملف" + fileName)) {
            $('.absLoad.loading').show();
            jQuery.ajax({
                cache: false,
                type: 'post',
                url: 'ReviewerHandler.ashx', //'ReviewerHandler.ashx',
                data: {
                    funcname: 'ApproveRejectedItemsInFile',
                    sfid: fileID
                },
                success: function (response) {
                    if (response != '1') {
                        alert('لقد حدث خطأ');
                    } else {
                        alert('لقد تمت الموافقه على جميع مقاطع الملف ' + fileName);
                        $('.absLoad.loading').hide();
                        location.reload();
                    }
                },
                error: function () {
                    alert('لقد حدث خطأ');
                    $('.absLoad.loading').hide();
                }
            });
        }


        // close popup
        $.fancybox.close()
        $(".popupoverlay").hide();
        $(".reviewpopup_cont").hide();
        var AudioPlayer = $("#jquery_jplayer_1");
        AudioPlayer.jPlayer('pause');
    })



    $('#reject').click(function () {
        //var ed = $('.reviewpopup_cont')
        // Do you ajax call here, window.setTimeout fakes ajax call
        $('.absLoad.loading').show();

        lastEditedDiv.attr("data-revnote", $('#note').val())

        var calledFuncName = 'RejectSessionContentItem';
        var calledHandlerName = 'ReviewerHandler.ashx';
        if ($('#IsSessionStartHidden').val() == '1') {
            calledFuncName = 'RejectSessionStart';
            calledHandlerName = 'SessionStartHandler.ashx';
        }
        jQuery.ajax({
            cache: false,
            type: 'post',
            url: calledHandlerName, //'ReviewerHandler.ashx',
            data: {
                funcname: calledFuncName,
                scid: $('#SessionContentItemIDHidden').val(), //used ofr item
                sid: $('#MainContent_SessionIDHidden').val(), //used ofr item
                sfid: $('#SessionContentItemIDHidden').val(), //used for stat this val contain fileID of start
                reviewernote: $('#note').val() //used for start and item
            },
            success: function (response) {
                if (response != '1') {
                    alert('لقد حدث خطأ');

                    //ed.setProgressState(0); // Hide progress
                    //ed.setContent(html);

                    //hide approve and final approve buttons
                    $('.btnApproveSession').css("display", "none");
                    $('.btnFinalApproveSession').css("display", "none");
                    changeButtonsForSessionStatus();
                    $('.absLoad.loading').hide();
                } else {


                    $('#note').val("");
                    lastEditedDiv.removeClass("greenitem");
                    lastEditedDiv.removeClass("blueitem");

                    lastEditedDiv.addClass("reditem"); //removeClass("myClass noClass").addClass("yourClass");
                    $('#spnRejectCount').text(parseInt($('#spnRejectCount').text()) + 1);

                    changeButtonsForSessionStatus();
                    $('.absLoad.loading').hide();

                }
                $('.absLoad.loading').hide();
            },
            error: function () {
                $('.absLoad.loading').hide();
            }
        });
        // close popup
        $.fancybox.close()
        $(".popupoverlay").hide();
        $(".reviewpopup_cont").hide();
        var AudioPlayer = $("#jquery_jplayer_1");
        AudioPlayer.jPlayer('pause');
    });

    function htmlEncode(value) {
        return $('<div/>').text(value).html();
    }

    $('#save').click(function () {
        $('.absLoad.loading').show();
        //var ed = $('.reviewpopup_cont')
        // Do you ajax call here, window.setTimeout fakes ajax call
        //ed.setProgressState(1); // Show progress
        lastEditedDiv.attr("data-revnote", $('#note').val())

        var calledFuncName = 'UpdateSessionContentItemText';
        var calledHandlerName = 'ReviewerHandler.ashx';
        if ($('#IsSessionStartHidden').val() == '1') {
            calledFuncName = 'SaveSessionStart';
            calledHandlerName = 'SessionStartHandler.ashx';
        }

        jQuery.ajax({
            cache: false,
            type: 'post',
            url: calledHandlerName, //'ReviewerHandler.ashx',
            data: {
                funcname: calledFuncName,
                scid: $('#SessionContentItemIDHidden').val(), //used ofr item,
                sid: $('#MainContent_SessionIDHidden').val(), //used ofr start
                sfid: $('#SessionContentItemIDHidden').val(), //used ofr start
                contentitemtext: htmlEncode($("textarea.tinymce").val()), //used ofr start and item
                reviewernote: $('#note').val() //used ofr start and item
            },
            success: function (response) {
                if (response != '1') {
                    alert('لقد حدث خطأ');

                    //ed.setProgressState(0); // Hide progress
                    //ed.setContent(html);
                } else {
                    $('#note').val("");
                    lastEditedDiv.html($("textarea.tinymce").html());
                    //lastEditedDiv.val($("textarea.tinymce").html());
                }
                $('.absLoad.loading').hide();
            },
            error: function () {
                $('.absLoad.loading').hide();
            }
        });
        // close popup
        $.fancybox.close()
        $(".popupoverlay").hide();
        $(".reviewpopup_cont").hide();
        var AudioPlayer = $("#jquery_jplayer_1");
        AudioPlayer.jPlayer('pause');
    });

    $('#saveForDataEntry').click(function () {
        $('.absLoad.loading').show();
        //var ed = $('.reviewpopup_cont')
        // Do you ajax call here, window.setTimeout fakes ajax call
        //ed.setProgressState(1); // Show progress
        lastEditedDiv.attr("data-revnote", $('#note').val())

        var calledFuncName = 'UpdateSessionContentItemText';
        var calledHandlerName = 'ReviewerHandler.ashx';
        if ($('#IsSessionStartHidden').val() == '1') {
            calledFuncName = 'SaveSessionStart';
            calledHandlerName = 'SessionStartHandler.ashx';
        }

        jQuery.ajax({
            cache: false,
            type: 'post',
            url: calledHandlerName, //'ReviewerHandler.ashx',
            data: {
                funcname: calledFuncName,
                scid: $('#SessionContentItemIDHidden').val(), //used ofr item,
                sid: $('#MainContent_SessionIDHidden').val(), //used ofr start
                sfid: $('#SessionContentItemIDHidden').val(), //used ofr start
                contentitemtext: htmlEncode($("textarea.tinymce").val()), //used ofr start and item
                reviewernote: $('#note').val(), //used ofr start and item
                editfileowner: $('#MainContent_currentUserID').val()
            },
            success: function (response) {
                if (response != '1') {
                    alert('لقد حدث خطأ');

                    //ed.setProgressState(0); // Hide progress
                    //ed.setContent(html);
                } else {
                    $('#note').val("");
                    lastEditedDiv.html($("textarea.tinymce").html());
                    //lastEditedDiv.val($("textarea.tinymce").html());
                }
                $('.absLoad.loading').hide();
            },
            error: function () {
                $('.absLoad.loading').hide();
            }
        });
        // close popup
        $.fancybox.close()
        $(".popupoverlay").hide();
        $(".reviewpopup_cont").hide();
        var AudioPlayer = $("#jquery_jplayer_1");
        AudioPlayer.jPlayer('pause');
    });
    function getParameterByName(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
    // finish: save and exit button onclick
    $(".btnfinishSF").click(function () {
        var sessionID = $(".sessionID").val();
        jQuery.ajax({
            cache: false,
            type: 'post',
            url: 'EditSessionHandler.ashx',
            data: {
                funcname: 'UpdateCompletedSessionFileStatusCompleted',
                sid: $('#MainContent_SessionIDHidden').val(), //used ofr start
                sfid: getParameterByName("sfid")
            },
            dataType: 'json',
            success: function (response) {
                if (response == "true") {
                    window.location = "default.aspx";
                } else {
                    alert("لقد حدث خطأ");
                }
            },
            error: function () {
                alert("لقد حدث خطأ");
            }
        });
    });


    $('.btnApproveSession').click(function () {

        $('.absLoad.loading').show()
        $(this).attr('disabled', 'disabled');
        //var ed = $('.reviewpopup_cont')
        // Do you ajax call here, window.setTimeout fakes ajax call
        jQuery.ajax({
            cache: false,
            type: 'post',
            url: 'ReviewerHandler.ashx',
            data: {
                funcname: 'ApproveSession',
                sid: $('#MainContent_SessionIDHidden').val() //,
                //reviewernote: $('#note').val()
            },
            success: function (response) {

                if (response != 'true') {
                    alert('لقد حدث خطأ');

                    // Hide progress
                    //ed.setContent(html);
                } else {


                    changeButtonsForSessionStatus();
                    alert('يتم الآن تجهيز ملفات المضبطة.. هذه العملية تستغرق عدة دقائق .. سيقوم التطبيق بإرسال رسالة بريد إلكتروني إليكم بمجرد الإنتهاء من تجهيزها')

                    $('.btnFinalApproveSession').css("display", "none");

                }
                $('.absLoad.loading').hide();
            },
            error: function () {
                $('.absLoad.loading').hide();
            }
        });
        // close popup
        $.fancybox.close()
        $(".popupoverlay").hide();
        $(".reviewpopup_cont").hide();

    })
    $('.btnFinalApproveSession').click(function () {
        $('.absLoad.loading').show();
        $(this).attr('disabled', 'disabled');
        //var ed = $('.reviewpopup_cont')
        // Do you ajax call here, window.setTimeout fakes ajax call
        //ed.setProgressState(1); // Show progress
        jQuery.ajax({
            cache: false,
            type: 'post',
            url: 'ReviewerHandler.ashx',
            data: {
                funcname: 'FinalApproveSession',
                sid: $('#MainContent_SessionIDHidden').val(),
                reviewernote: $('#note').val()
            },
            success: function (response) {

                if (response != 'true') {
                    alert('لقد حدث خطأ');

                    //ed.setProgressState(0); // Hide progress
                    //ed.setContent(html);
                } else {


                    changeButtonsForSessionStatus();
                    // alert('يتم الآن تجهيز الملفات النهائيه للمضبطة وارسالها الي البرلمان الالكتروني .. هذه العملية تستغرق عدة دقائق .. سيقوم التطبيق بإرسال رسالة بريد إلكتروني إليكم بمجرد الإنتهاء من تجهيزها')
                    alert('لقد تم التصديق على المضبطة بنجاح  .. يمكنك الرجوع الى تلك المضبطة من صفحة المضابط المصدق عليها');

                }
                $('.absLoad.loading').hide();
            },
            error: function () {
                $('.absLoad.loading').hide();
            }
        });
    })

    // onchange event for SameSpeaker checkbox
    $('.gotofile').click(function (e) {
        var tlink = $(this)
        if (tlink.attr('href')) {
            var num = $(tlink.attr('href')).offset().top - $('#MainContent_pnlContent .divcontent').offset().top + $('#MainContent_pnlContent .divcontent').scrollTop() - 5;
            $('#MainContent_pnlContent .divcontent').stop().animate({
                scrollTop: num
            })
        }
        e.preventDefault()
    })

    $('.approveSessionFile').click(function (e) {
        var tlink = $(this);
        //alert(tlink.attr('href'));

        //usama march
        //here approve session file contents all session content items under it
        //call handler then update page (reload page)

        e.preventDefault();
    })

})