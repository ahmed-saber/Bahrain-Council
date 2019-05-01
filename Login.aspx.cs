using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TayaIT.Enterprise.EMadbatah.BLL;
using TayaIT.Enterprise.EMadbatah.Config;
using TayaIT.Enterprise.EMadbatah.DAL;
using TayaIT.Enterprise.EMadbatah.Web;

public partial class Login : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void btnLogin_OnClick(object sender, EventArgs e)
    {
        EMadbatahEntities context = new EMadbatahEntities();
        User myUser = context.Users.SingleOrDefault(x => x.DomainUserName == txtUserName.Text && x.Email == txtEmail.Text);
        if (myUser == null)
        {
            return;
        }
        
        Session[Constants.SessionObjectsNames.CURRENT_USER] = EMadbatahFacade.GetUserByUserID(myUser.ID);
        Response.Redirect("~/Default.aspx");
        //CurrentUser = EMadbatahFacade.GetUserByUserID(myUser.ID);
    }
}