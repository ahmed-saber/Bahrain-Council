<%@ Page Language="C#" AutoEventWireup="true" CodeFile="CreateNewSession.aspx.cs"
    Title="المضبطة الإلكترونية - إضافة مضبطة جديدة" Inherits="TayaIT.Enterprise.EMadbatah.Web.CreateNewSession"
    MasterPageFile="~/Site.master" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="Server">
    <style type="text/css">
        .modalBackground {
            background-color: Gray;
            filter: alpha(opacity=90);
            opacity: 0.9;
        }

        textarea {
            resize: none;
            overflow-y: scroll;
            overflow-x: scroll;
        }

        .fileUpload {
            position: relative;
            overflow: hidden;
            margin: 10px;
            padding: 7px;
        }

            .fileUpload input.upload {
                position: absolute;
                top: 0;
                right: 0;
                margin: 0;
                cursor: pointer;
                opacity: 0;
                filter: alpha(opacity=0);
            }
    </style>
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    <script src="scripts/jquery-3.0.0.min.js" type="text/javascript"></script>
    <script src="scripts/jquery.datetimepicker.full.min.js" type="text/javascript"></script>
    <link href="styles/jquery.datetimepicker.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript">
        $(document).ready(function () {
            AjaxEndMethod();
            if (!Sys.WebForms.PageRequestManager.getInstance().get_isInAsyncPostBack()) {
                Sys.WebForms.PageRequestManager.getInstance().add_endRequest(AjaxEndMethod);
            }
        });
        function AjaxEndMethod() {
            // change the date language
            $.datetimepicker.setLocale('ar');
            // date picker
            $(".Calender").datetimepicker({
                timepicker: false,
                defaultDate: new Date(),
                format: 'd/m/Y',
            });
            // time picker
            $(".timePicker").datetimepicker({
                datepicker: false,
                defaultDate: new Date(),
                format: 'H:i'
            });
        }
    </script>
    <form id="form1" runat="server">
        <asp:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
        </asp:ToolkitScriptManager>
        <div class="grid_24 xxlargerow">
            <div class="Ntitle" runat="server" id="divPageTitle">
                اضافة مضبطة جديدة:
           
            </div>
        </div>
        <div class="clear">
        </div>
        <div class="grid_22">
            <div class="largerow">
                <div class="grid_5 h2">
                    &nbsp;
               
               
                </div>
                <div class="grid_16 h2">
                    <table style="border: 0;">
                        <tr>
                            <td style="padding-left: 50px;">
                                <div class="fileUpload btn" style="display: table-cell">
                                    <span>اختر ملف ...</span>
                                    <asp:FileUpload ID="FileUpload1" runat="server" class="upload" />
                                </div>
                            </td>
                            <td>
                                <asp:Button ID="btnImportFromWord" CssClass="btn" OnClick="btnImportFromWord_OnClick" runat="server" Text="استيراد جدول الاعمال" />
                            </td>

                        </tr>
                    </table>
                </div>
                <div class="clear">
                </div>
            </div>

            <asp:UpdatePanel ID="UpdatePanel1" runat="server">
                <ContentTemplate>
                    <div class="largerow">
                        <div class="grid_5 h2">&nbsp;</div>
                        <div class="grid_10 h2">
                            <asp:Label ID="lblValidateImport" ForeColor="Red" runat="server" Visible="False" Text="برجاء استيراد جدول الاعمال قبل الحفظ"></asp:Label>
                        </div>
                    </div>
                    <div class="largerow">
                        <%--<div class="grid_5 h2">&nbsp;</div>--%>
                        <div class="grid_10 h2">

                            <asp:ModalPopupExtender ID="mp1" runat="server" PopupControlID="Panel1" TargetControlID="btnShow" CancelControlID="btnClose" BackgroundCssClass="modalBackground">
                            </asp:ModalPopupExtender>
                            <div class="grid_24">
                                <div class="grid_12">
                                    <asp:TreeView OnSelectedNodeChanged="TreeView1_OnSelectedNodeChanged" ID="TreeView1" runat="server" ImageSet="Arrows" ShowLines="True" Width="1167px">
                                        <HoverNodeStyle Font-Underline="True" ForeColor="#5555DD" />
                                        <NodeStyle Font-Names="Tahoma" Font-Size="10pt" ForeColor="Black" HorizontalPadding="5px" NodeSpacing="0px" VerticalPadding="0px" />
                                        <ParentNodeStyle Font-Bold="False" />
                                        <SelectedNodeStyle Font-Underline="True" ForeColor="#5555DD" HorizontalPadding="0px" VerticalPadding="0px" />
                                    </asp:TreeView>
                                </div>
                            </div>
                            <asp:Button ID="btnShow" Visible="True" Style="display: none;" runat="server" Text="عرض النص للتعديل" />
                            <asp:Panel ID="Panel1" runat="server" CssClass="modalBackground" align="center" Style="display: none">
                                <div style="border: 3px solid black;">
                                    <asp:UpdatePanel ID="UpdatePanel2" runat="server">
                                        <ContentTemplate>
                                            <asp:TextBox TextMode="MultiLine" ID="txtName" runat="server" Width="300" Height="300"></asp:TextBox>
                                        </ContentTemplate>
                                    </asp:UpdatePanel>
                                    <asp:Button ID="btnClose" CssClass="btn" runat="server" Text="اغلاق" />
                                    <asp:Button ID="btnUpdateText" CssClass="btn" OnClick="btnUpdateText_OnClick" runat="server" Text="تحديث" />
                                </div>
                            </asp:Panel>

                        </div>
                        <div class="clear">
                        </div>
                    </div>
                    <div class="largerow">
                        <div class="grid_4 h2">
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator15" runat="server" ControlToValidate="ddlPresident" ErrorMessage="*" ForeColor="Red" ValidationGroup="VGSession"></asp:RequiredFieldValidator>
                            <asp:Label ID="Label1" runat="server" Text="رئيس الجلسة"></asp:Label>
                        </div>
                        <div class="grid_6">
                            <asp:DropDownList ID="ddlPresident" runat="server" CssClass="inputBlock">
                            </asp:DropDownList>
                        </div>
                        <div class="clear">
                        </div>
                    </div>

                    <div class="largerow">
                        <div class="grid_4 h2">
                            <asp:Label ID="lblDate" runat="server" Text="التاريخ"></asp:Label>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator5" runat="server" ControlToValidate="txtDate"
                                ErrorMessage="*" ForeColor="Red" ValidationGroup="VGSession"></asp:RequiredFieldValidator>
                        </div>
                        <div class="grid_4">
                            <asp:TextBox ID="txtDate" runat="server" class="textfield inputBlock Calender" />
                        </div>
                        <div class="grid_4 h2">
                            <asp:Label ID="Label2" runat="server" Text="الوقت"></asp:Label>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator11" runat="server" ControlToValidate="txtTime"
                                ErrorMessage="*" ForeColor="Red" ValidationGroup="VGSession"></asp:RequiredFieldValidator>
                        </div>
                        <div class="grid_4">
                            <asp:TextBox ID="txtTime" runat="server" class="textfield inputBlock timePicker"></asp:TextBox>
                        </div>
                        <div class="clear">
                        </div>
                    </div>
                    <div class="largerow">
                        <div class="grid_4 h2">
                            <asp:Label ID="lblSeason" runat="server" Text="الفصل التشريعى"></asp:Label>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator13" runat="server" ControlToValidate="txtSeason" ErrorMessage="*" ForeColor="Red" ValidationGroup="VGSession"></asp:RequiredFieldValidator>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator3" runat="server" ControlToValidate="txtSeason"
                                ErrorMessage="يمكنك ادخال أرقام فقط" ForeColor="Red" ValidationExpression="^[0-9]*$"
                                ValidationGroup="VGSession"> </asp:RegularExpressionValidator>
                        </div>
                        <div class="grid_4">
                            <asp:TextBox ID="txtSeason" runat="server" CssClass="textfield inputBlock"></asp:TextBox>
                        </div>
                        <div class="grid_4 h2">
                            <asp:Label ID="lblStage" runat="server" Text="دور الانعقاد"></asp:Label>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator14" runat="server" ControlToValidate="txtStage" ErrorMessage="*" ForeColor="Red" ValidationGroup="VGSession"></asp:RequiredFieldValidator>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator4" runat="server" ControlToValidate="txtStage"
                                ErrorMessage="يمكنك ادخال أرقام فقط" ForeColor="Red" ValidationExpression="^[0-9]*$"
                                ValidationGroup="VGSession"> </asp:RegularExpressionValidator>
                        </div>
                        <div class="grid_4">
                            <asp:TextBox ID="txtStage" runat="server" CssClass="textfield inputBlock"></asp:TextBox>
                        </div>
                        <div class="grid_3">
                            <asp:TextBox ID="txtStageType" runat="server" CssClass="textfield inputBlock"></asp:TextBox>
                        </div>
                        <div class="grid_1 h2">
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator16" runat="server" ControlToValidate="txtStageType" ErrorMessage="*" ForeColor="Red" ValidationGroup="VGSession"></asp:RequiredFieldValidator>
                        </div>
                        <div class="clear">
                        </div>
                    </div>
                    <div class="largerow">
                        <div class="grid_4 h2">
                            <asp:Label ID="lblSubject" runat="server" Text="الجلسة"></asp:Label>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator7" runat="server" ErrorMessage="*"
                                ControlToValidate="txtSubject" ValidationGroup="VGSession" ForeColor="Red"></asp:RequiredFieldValidator>
                            <asp:RegularExpressionValidator ID="RegularExpressionValidator2" runat="server" ControlToValidate="txtSubject"
                                ErrorMessage="يمكنك ادخال أرقام فقط" ForeColor="Red" ValidationExpression="^[0-9]*$"
                                ValidationGroup="VGSession"> </asp:RegularExpressionValidator>
                        </div>
                        <div class="grid_4">
                            <asp:TextBox ID="txtSubject" runat="server" CssClass="textfield inputBlock"></asp:TextBox>
                        </div>
                        <div class="grid_4 h2">
                            <asp:Label ID="Label3" runat="server" Text="النوع"></asp:Label>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator12" runat="server" ControlToValidate="txtType" ErrorMessage="*" ForeColor="Red" ValidationGroup="VGSession"></asp:RequiredFieldValidator>
                        </div>
                        <div class="grid_4">
                            <asp:TextBox ID="txtType" runat="server" CssClass="textfield inputBlock"></asp:TextBox>
                        </div>
                        <div class="clear">
                        </div>
                    </div>

                    <div class="largerow">
                        <div class="grid_4 h2">
                            &nbsp;
               
               
                        </div>
                        <div class="grid_8 h2">
                            <asp:CheckBox ID="CBSessionStart" runat="server" Text="اكتمال النصاب القانونى فى الموعد الأول"
                                Checked Style="font-size: 15px;" class="chk" />
                        </div>
                        <div class="clear">
                        </div>
                    </div>
                    <div class="prefix_5 addnewusercont">
                        <div class="grid_5 h2">
                            &nbsp;
               
                        </div>
                        <asp:Button ID="btnCreateNewSession" runat="server" Text="حفظ بيانات المضبطة" OnClick="btnCreateNewSession_Click"
                            ValidationGroup="VGSession" CssClass="btn" />
                    </div>
                </ContentTemplate>
            </asp:UpdatePanel>
        </div>
        <div class="clear">
        </div>
    </form>
</asp:Content>
