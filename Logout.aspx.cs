using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TayaIT.Enterprise.EMadbatah.Web;

public partial class Logout : BasePage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        CurrentUser = null;
        Session.Abandon();
        Response.Redirect("~/login.aspx");

    }
}