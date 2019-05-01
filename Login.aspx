<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Login.aspx.cs" Inherits="Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title></title>
    <link rel="stylesheet" type="text/css" href="styles/reset_rtl.css" />
    <link rel="stylesheet" type="text/css" href="styles/960_24_col_rtl.css" />
    <link rel="stylesheet" type="text/css" href="styles/jquery.fancybox-1.3.4.css">
    <link rel="stylesheet" type="text/css" href="styles/tipTip.css" />
    <script type="text/javascript" src="scripts/jquery-1.7.min.js"></script>
    <script type="text/javascript" src="scripts/jquery.form.js"></script>
    <script type="text/javascript" src="scripts/jquery.validate.min.js" charset="ISO-8859-1"></script>
    <script type="text/javascript" src="scripts/jquery.fancybox-1.3.4.pack.js"></script>
    <script type="text/javascript" src="scripts/jquery.tipTip.minified.js"></script>
    <script type="text/javascript" src="scripts/runGlobally.js"></script>
    <!--[if lt IE 9]>
    <script type="text/javascript" src="scripts/html5.js"></script>
    <![endif]-->
    <link rel="stylesheet" type="text/css" href="styles/style.css" />
</head>
<body>
    <form id="form1" runat="server">

        <section id="content">
            <article id="main_cont" class="container_24">
                <div class="content">
                    <div class="largerow">
                        <div class="grid_10">
                            &nbsp;
                        </div>
                        <div class="grid_4 h2">
                            اسم المستخدم
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ErrorMessage="*" ControlToValidate="txtUserName" ForeColor="Red"></asp:RequiredFieldValidator>
                        </div>
                        <div class="grid_4">
                            <asp:TextBox ID="txtUserName" runat="server"></asp:TextBox>
                        </div>
                    </div>
                    <br/>
                    <div class="largerow">
                        <div class="grid_10">
                            &nbsp;
                        </div>
                        <div class="grid_4 h2">
                            البريد الالكتروني
                             <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="*" ControlToValidate="txtEmail" ForeColor="Red"></asp:RequiredFieldValidator>
                        </div>
                        <div class="grid_4">
                            <asp:TextBox ID="txtEmail" runat="server"></asp:TextBox>
                        </div>
                    </div>
                    <br/>
                    <div class="largerow">
                        <div class="grid_15">
                            &nbsp;
                        </div>
                        <div class="grid_4">
                            <asp:Button ID="btnLogin" OnClick="btnLogin_OnClick" runat="server" Text="دخول" />
                        </div>
                    </div>

                </div>
            </article>
        </section>
        <footer id="footer">
            <div class="tex_align_en">
                <p class="footertxt">جميع الحقوق محفوظة © الأمانة العامة لمجلس الأمة</p>
            </div>
        </footer>

        <script type="text/javascript">

            function getParameterByName(name) {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regexS = "[\\?&]" + name + "=([^&#]*)";
                var regex = new RegExp(regexS);
                var results = regex.exec(window.location.href);
                if (results == null)
                    return "";
                else
                    return decodeURIComponent(results[1].replace(/\+/g, " "));
            }

            $(document).ready(function () {

                $(".hrefSignOut").click(function () {

                    try {
                        document.execCommand("ClearAuthenticationCache", false);
                    } catch (e) {

                    }

                    jQuery.ajax({
                        cache: false,
                        type: 'post',
                        url: 'AdminHandler.ashx',
                        data: {
                            funcname: 'SignOut'
                        },
                        success: function (response) {

                            location.reload();


                        },
                        error: function () {
                            location.reload();

                        }
                    });

                });


                $(".refreshSessionInfo").click(function () {
                    $('.absLoad.loading').show();

                    jQuery.ajax({
                        cache: false,
                        type: 'post',
                        url: 'SessionHandler.ashx',
                        data: {
                            funcname: 'UpdateSessionInfo',
                            sid: getParameterByName('sid')
                        },
                        success: function (response) {
                            if (response == 'true') {
                                location.reload();
                            } else {
                                alert("لقد حدث خطأ");
                            }
                            $('.absLoad.loading').hide();
                        },
                        error: function () {
                            $('.absLoad.loading').hide();
                            location.reload();

                        }
                    });

                });


            });   //end document ready



        </script>

    </form>
</body>
</html>
