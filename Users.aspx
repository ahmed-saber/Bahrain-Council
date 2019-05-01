<%@ Page Title="" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="Users.aspx.cs" Inherits="Users" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="Server">
    <form id="form1" runat="server">
        <asp:GridView OnRowCommand="GridView1_OnRowCommand" ID="GridView1" DataKeyNames="ID" Width="100%" runat="server" AutoGenerateColumns="False" CellPadding="4" ForeColor="#333333" GridLines="None" Height="125px">
            <AlternatingRowStyle BackColor="White" />
            <Columns>
                <asp:TemplateField HeaderText="اسم المستخدم" ItemStyle-Width="50px">
                    <ItemTemplate>
                        <%# Eval("FName") %>
                    </ItemTemplate>
                    <ItemStyle Width="50px"></ItemStyle>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="المستخدم الحالى" ItemStyle-Width="50px">
                    <ItemTemplate>
                        <asp:Button Visible="False" ID="btnEdit" CommandArgument='<%# Eval("ID")%>' CommandName="SetAsDefaultUser" runat="server" Text="المستخدم الحالى" />
                    </ItemTemplate>
                    <ItemStyle Width="50px"></ItemStyle>
                </asp:TemplateField>
            </Columns>
            <FooterStyle BackColor="#990000" Font-Bold="True" ForeColor="White" />
            <HeaderStyle BackColor="#990000" Font-Bold="True" ForeColor="White" />
            <PagerStyle BackColor="#FFCC66" ForeColor="#333333" HorizontalAlign="Center" />
            <RowStyle BackColor="#FFFBD6" ForeColor="#333333" />
            <SelectedRowStyle BackColor="#FFCC66" Font-Bold="True" ForeColor="Navy" />
            <SortedAscendingCellStyle BackColor="#FDF5AC" />
            <SortedAscendingHeaderStyle BackColor="#4D0000" />
            <SortedDescendingCellStyle BackColor="#FCF6C0" />
            <SortedDescendingHeaderStyle BackColor="#820000" />
        </asp:GridView>
    </form>
</asp:Content>

