

$(document).ready(function () {

    //////////////////// Votes
    // Load votes
    $(".btnAddNewVote").click(function (e) {
        $.fancybox(`
        <div id="newVoteOverlay" class="lightbox-content-holder container_24">
            <div class="lightbox-head">
                <h2><span class="red">*</span> اضافة تصويت نداء بالاسم :</h2>
            </div>
            <div class="row">
                <div class="grid_4"><h4>اضافة تصويت جديد :</h4></div>
                <div class="grid_8 ">
                    <input type="text" id="txtNewVote" class ="txtNewVote textfield inputBlock" />
                </div>
                <div class="grid_2 h2">
                    <input type="button" id="btnSaveVote" class="btn" value="اضافة" />
                </div>
            </div>
            <div class="row">
                <div class="grid_4"><h4>او اختر من التصويتات :</h4></div>
                <div class="grid_8">
                    <select id="ddl_votes" class="inputBlock">
                        <option value="0">-------- اختر الاجراء --------</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="grid_24">
                    <div id="jquery_jplayer_2" class="jp-jplayer"></div>
                    <div id="jp_container_2" class="jp-audio">
                        <div class="jp-type-single">
                            <div id="jp_interface_1" class="jp-interface">
                                <ul class="jp-controls">
                                    <li><a href="#" class="jp-play" tabindex="1" title="play"></a></li>
                                    <li><a href="#" class="jp-pause" tabindex="1" title="pause"></a></li>
                                </ul>
                                <div class="jp-progress">
                                    <div class="jp-seek-bar">
                                        <div class="jp-play-bar">
                                        </div>
                                    </div>
                                </div>
                                <div class="jp-current-time">
                                </div>
                                <div class="jp-duration">
                                </div>
                                <div class="next-jp-xseconds" title="تقديم 5 ثوانى">
                                </div>
                                <div class="prev-jp-xseconds" title="تاخير 5 ثوانى">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="grid_12">
                    <label class="h4 ml-20"><input id="chbVote" type="checkbox" /> بداية التصويت</label>
                </div>
            </div>
            <div id="AttendantCont" class="row tex_align_center">
            </div>
            <div class="row">
                <div class ="grid_24 h2">
                    <span>الغير موجودين: (</span>
                    <span class ="nonExistVotesCount blueitem">0</span>
                    <span>) نائبا.</span>
                    <span>الموافقون: (</span>
                    <span class="agreedVotesCount reditem">0</span>
                    <span>) نائبا.</span>
                    <span>غير الموافقين: (</span>
                    <span class="disAgreedVotesCount greenitem">0</span>
                    <span>) نائبا.</span>
                    <span>الممتنعون: (</span>
                    <span class="NoVotesCount" style="color:black;">0</span>
                    <span>) نائبا.</span>
                    <span>الغائبون: (</span>
                    <span class ="AbsenceVotesCount"  style="color:olive;">0</span>
                    <span>) نائبا.</span>
                     <span>المعتذرون: (</span>
                    <span class ="ExcuseVotesCount"  style="color:maroon;">0</span>
                    <span>) نائبا.</span>
                </div>
            </div>
            <div class="lightbox-actions-holder fl">
                <input type="button" class="approve-action" value="حفظ" />
            </div>
        </div>`,
            {
                'onComplete': function (e) {
                    // VARS
                    var $overlay = $('#newVoteOverlay');
                    var $ddl_votes = $('#ddl_votes', $overlay);
                    var $chbVote = $('#chbVote', $overlay);
                    // PAUSE ANY PLAYER
                    $(".jp-jplayer").jPlayer("pause");
                    // LOAD SESSION VOTES
                    loadSessionVotes(function (response) {
                        var voteId = $(".voteId").val();
                        $ddl_votes.empty().append($('<option />').attr({
                            value: "0"
                        }).html("اختر من بين التصويتات"));

                        for (i = 0; i < response.length; i++) {
                            var option = $('<option>').attr({
                                value: response[i].ID
                            });
                            $ddl_votes.append(option.text(response[i].VoteSubject));
                        }
                        $ddl_votes.val(voteId);

                        if ($ddl_votes.val() == voteId && voteId != "0") {
                            $chbVote.attr('checked', true);
                        }

                        loadVotesMembers($overlay);

                        $ddl_votes.change(function () {
                            loadVotesMembers($overlay);
                        });
                    });

                    var AudioPlayer = $("#jquery_jplayer_2", $overlay);
                    var playertime;
                    AudioPlayer.jPlayer({
                        swfPath: "/scripts/jPlayer/",
                        wmode: "window",
                        solution: 'html, flash',
                        supplied: "mp3",
                        preload: 'metadata',
                        volume: 1,
                        cssSelectorAncestor: '#newVoteOverlay #jp_container_2',
                        errorAlerts: false,
                        warningAlerts: false,
                        ready: function () {
                            // play the jplayer
                            var startTime = $('.hdstartTime');
                            var firstTime = Math.floor(startTime.val());
                            $(this).jPlayer("setMedia", {
                                mp3: $(".MP3FilePath").val()
                            }).jPlayer("pause", firstTime);

                            // next x seconds button
                            $('.next-jp-xseconds', AudioPlayer.next()).click(function (e) {
                                AudioPlayer.jPlayer("play", playertime + 5);
                            })
                            // prev x seconds button
                            $('.prev-jp-xseconds', AudioPlayer.next()).click(function (e) {
                                AudioPlayer.jPlayer("play", playertime - 5);
                            })
                        },
                        timeupdate: function (event) {
                            // time
                            playertime = event.jPlayer.status.currentTime;
                        }
                    });

                    // TABLE RADIO BUTTONS
                    $(".table_att_voting input:radio", $overlay).live("change", function (e) {
                        $('.nonExistVotesCount', $overlay).html($("input:radio:checked[value='0']").length);
                        $('.agreedVotesCount', $overlay).html($("input:radio:checked[value='1']").length);
                        $('.disAgreedVotesCount', $overlay).html($("input:radio:checked[value='2']").length);
                        $('.NoVotesCount', $overlay).html($("input:radio:checked[value='3']").length);
                        $('.AbsenceVotesCount', $overlay).html($("input:radio:checked[value='4']").length);
                        $('.ExcuseVotesCount', $overlay).html($("input:radio:checked[value='5']").length);
                    });

                    // add new vote
                    $("#btnSaveVote", $overlay).click(function (e) {
                        // vars
                        var voteSubject = $(".txtNewVote", $overlay).val();
                        if (voteSubject != '') {
                            // ajax load
                            jQuery.ajax({
                                cache: false,
                                type: 'post',
                                url: 'VotingHandler.ashx',
                                data: {
                                    funcname: 'AddVote',
                                    sid: $(".sessionID").val(),
                                    votesubject: voteSubject
                                },
                                dataType: 'json',
                                success: function (response) {
                                    option = $('<option>').attr({
                                        value: response,
                                        selected: true
                                    });
                                    $ddl_votes.append(option.text(voteSubject));
                                    $(".txtNewVote", $overlay).val('');
                                    loadVotesMembers();
                                },
                                error: function () { }
                            });
                        }
                        e.preventDefault();
                    });

                    $(".approve-action", $overlay).click(function (e) {
                        // vars
                        var agreedVote_lst = [];
                        var disAgreedVote_lst = [];
                        var NoVote_lst = [];
                        var NonExist_lst = [];
                        var AbsenceVote_lst = [];
                        var ExcuseVote_lst = [];
                        $('.table_att_voting input:radio:checked', $overlay).each(function () {
                            if ($(this).val() == 0) {
                                NonExist_lst.push(this.name.replace("options_", ""));
                            } else if ($(this).val() == 1) {
                                agreedVote_lst.push(this.name.replace("options_", ""));
                            } else if ($(this).val() == 2) {
                                disAgreedVote_lst.push(this.name.replace("options_", ""));
                            } else if ($(this).val() == 3) {
                                NoVote_lst.push(this.name.replace("options_", ""));
                            } else if ($(this).val() == 4) {
                                AbsenceVote_lst.push(this.name.replace("options_", ""));
                            } else if ($(this).val() == 5) {
                                ExcuseVote_lst.push(this.name.replace("options_", ""));
                            }
                        });

                        if ($ddl_votes.val() != '') {
                            // HIDE LOADING
                            $.fancybox.showActivity();
                            // ajax load
                            jQuery.ajax({
                                cache: false,
                                type: 'post',
                                url: 'VotingHandler.ashx',
                                data: {
                                    funcname: 'SaveVoteMemVal',
                                    sid: $(".sessionID").val(),
                                    voteid: $ddl_votes.val(),
                                    nonexist_mem: JSON.stringify(NonExist_lst),
                                    agreed_mem: JSON.stringify(agreedVote_lst),
                                    disagreed_mem: JSON.stringify(disAgreedVote_lst),
                                    novote_mem: JSON.stringify(NoVote_lst),
                                    absencevote_mem: JSON.stringify(AbsenceVote_lst),
                                    excusevote_mem: JSON.stringify(ExcuseVote_lst)
                                },
                                dataType: 'json',
                                complete: function () {
                                    // HIDE LOADING
                                    $.fancybox.hideActivity();
                                }
                            });
                        }
                        // close popup
                        $.fancybox.close();
                    });

                    $chbVote.change(function () {
                        if ($chbVote.is(':checked')) {
                            $(".voteId").val($ddl_votes.val());
                            $('.spanVoteSubject').html($ddl_votes.find('option:selected').text());
                            $('.divVote').show();
                        } else {
                            $(".voteId").val(0);
                            $('.spanVoteSubject').html('');
                            $('.divVote').hide();
                        }
                    });
                }
            }
        );
        e.preventDefault();
    });

    function loadSessionVotes(callback) {
        //Load Available Votes
        jQuery.ajax({
            cache: false,
            type: 'post',
            url: 'VotingHandler.ashx',
            data: {
                funcname: 'GetSessionVotes',
                sid: $(".sessionID").val()
            },
            dataType: 'json',
            success: callback
        });
    }

    function loadVotesMembers($overlay) {
        // VARS
        var voteId = $("#ddl_votes", $overlay).val();
        // LOADER
        $('#AttendantCont', $overlay).html($('<img src="/images/loading.gif">'));
        // CHECK
        if (voteId != "0") {
            jQuery.ajax({
                cache: false,
                type: 'post',
                url: 'VotingHandler.ashx',
                data: {
                    funcname: 'GetVoteMemVal',
                    sid: $(".sessionID").val(),
                    voteid: voteId
                },
                dataType: 'json',
                success: function (response) {
                    for (i = 0; i < response.length; i++) {
                        var option = $('<option>').attr({
                            value: response[i].ID
                        });
                        $('.ddl_votes', $overlay).append(option.text(response[i].VoteSubject));
                    }
                    var grid_1 = $('<div />').addClass("grid_12");
                    var table1 = $('<table />').addClass("table_att_voting");
                    var grid_2 = grid_1.clone();
                    var table2 = table1.clone();
                    var vote_types = ["غير موجود", "موافق", "غير موافق", "ممتنع", "غائب", "معتذر"]
                    var th_header_container = $('<div/ >');
                    th_header_container.append($('<span class="blueitem" style="margin: 0 2px;display: inline-block;width: 60px;font-size: 85%;">').html(vote_types[0])).append($('<span class="greenitem" style="margin: 0 2px;display: inline-block;width: 40px;font-size: 85%;">').html(vote_types[1])).append($('<span class="reditem" style="margin: 0 2px;display: inline-block;width: 60px;color:red;font-size: 85%;">').html(vote_types[2])).append($('<span class="blueitem" style="margin: 0 2px;display: inline-block;color:black;font-size: 85%;width: 45px;">').html(vote_types[3])).append($('<span class="blueitem" style="margin: 0 2px;display: inline-block;color:olive;font-size: 85%;width: 40px;">').html(vote_types[4])).append($('<span class="blueitem" style="margin: 0 2px;display: inline-block;color:maroon;font-size: 85%">').html(vote_types[5]));

                    var row = $('<tr>').attr({});
                    var th1 = $('<th style="width:5%">').attr({}).append($('<span>').html("ID").addClass("displaynone"));
                    var th2 = $('<th style="width:35%">').attr({}).append($('<span>').html("اسم المتحدث"));
                    var th3 = $('<th style="width:60%">').attr({}).html(th_header_container);
                    row = row.append(th1).append(th2).append(th3)
                    table1.append(row.clone());
                    table2.append(row.clone());

                    var first_table_len = parseInt(response.length / 2);

                    for (var i = 0; i < response.length; i++) {
                        row = $('<tr>').attr({});
                        td1 = $('<td style="width:5%">').attr({}).html($('<span>').html(response[i].AttendantID).addClass("displaynone"));
                        td2 = $('<td style="width:40%">').attr({}).html($('<span>').html(response[i].AttendantName));
                        td3 = $('<td style="width:55%">').attr({}).html(draw_radio_options_table(response[i].AttendantID.toString(), response[i].MemberVoteValue));
                        if (i < first_table_len) {
                            table1.append(row.append(td1).append(td2).append(td3));
                        }
                        else {
                            table2.append(row.append(td1).append(td2).append(td3));
                        }
                    }

                    $('#AttendantCont', $overlay).html(grid_1.append(table1)).append(grid_2.append(table2));
                    $('.nonExistVotesCount', $overlay).html($("input:radio:checked[value='0']").length);
                    $('.agreedVotesCount', $overlay).html($("input:radio:checked[value='1']").length);
                    $('.disAgreedVotesCount', $overlay).html($("input:radio:checked[value='2']").length);
                    $('.NoVotesCount', $overlay).html($("input:radio:checked[value='3']").length);
                    $('.AbsenceVotesCount', $overlay).html($("input:radio:checked[value='4']").length);
                    $('.ExcuseVotesCount', $overlay).html($("input:radio:checked[value='5']").length);


                    if ($('.ddl_votes', $overlay).val() == $(".voteId").val()) {
                        $(".chbVote", $overlay).attr("checked", true);
                    } else {
                        $(".chbVote", $overlay).removeAttr("checked");
                    }

                    $.fancybox.resize();
                }
            });
        } else {
            $('.nonExistVotesCount', $overlay).html(0);
            $('.agreedVotesCount', $overlay).html(0);
            $('.disAgreedVotesCount', $overlay).html(0);
            $('.NoVotesCount', $overlay).html(0);
            $('.AbsenceVotesCount', $overlay).html(0);
            $('.ExcuseVotesCount', $overlay).html(0);
            $('#AttendantCont', $overlay).html("");
            $(".chbVote", $overlay).removeAttr("checked");
        }
        $.fancybox.resize();
    }

    function draw_radio_options_table(attendantID, checkedOptionVal) {
        var vote_types = ["غير موجود", "موافق", "غير موافق", "ممتنع", "غائب", "معتذر"]
        var table_options = $('<table class="tbl_voting_options">');
        var tr_options = $('<tr>');
        for (var i = 0; i < vote_types.length; i++) {
            radio = $('<input>').attr({
                type: 'radio',
                value: i,
                name: 'options_' + attendantID
            });
            if (checkedOptionVal == (i)) {
                radio.attr("checked", "checked")
            }
            var td_options = $('<td>').html(radio);
            tr_options.append(td_options);
        }
        table_options.append(tr_options);
        return table_options;
    }

    $(".removeVote").click(function (e) {
        $(".voteId").val('0');
        $('.spanVoteSubject').html('');
        $('.divVote').hide();
        e.preventDefault();
    });
});