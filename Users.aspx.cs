using System;
using System.IO;
using System.Linq;
using System.Web.UI.WebControls;
using TayaIT.Enterprise.EMadbatah.DAL;
using TayaIT.Enterprise.EMadbatah.Web;

public partial class Users : BasePage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        EMadbatahEntities context = new EMadbatahEntities();
        if (!IsPostBack)
        {
            GridView1.DataSource = context.Users.ToList();
            GridView1.DataBind();
        }
    }

    protected void GridView1_OnRowCommand(object sender, GridViewCommandEventArgs e)
    {
        //if (e.CommandName != "SetAsDefaultUser") return;
        //int id = Convert.ToInt32(e.CommandArgument);
        //StreamWriter writer = new StreamWriter(Server.MapPath("~/CurrentUser/CurrentUser.txt"), false);
        //writer.WriteLine(id);
        //writer.Flush();
        //writer.Close();
        //writer.Dispose();
        //Response.Redirect("~/Users.aspx");
    }
}