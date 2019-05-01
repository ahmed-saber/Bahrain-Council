using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TayaIT.Enterprise.EMadbatah.DAL;
using TayaIT.Enterprise.EMadbatah.Model;
using TayaIT.Enterprise.EMadbatah.Model.VecSys;
using TayaIT.Enterprise.EMadbatah.Vecsys;
using TayaIT.Enterprise.EMadbatah.BLL;
using System.Collections;
using System.IO;
using TayaIT.Enterprise.EMadbatah.Util.Web;
using TayaIT.Enterprise.EMadbatah.Config;
using System.Text;
using TayaIT.Enterprise.EMadbatah.Word;
using SessionItem = TayaIT.Enterprise.EMadbatah.Model.SessionItem;
using SessionSubItem = TayaIT.Enterprise.EMadbatah.Model.SessionSubItem;

namespace TayaIT.Enterprise.EMadbatah.Web
{
    public partial class CreateNewSession : BasePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (CurrentUser.Role != Model.UserRole.Admin)
                Response.Redirect(Constants.PageNames.ERROR_PAGE + "?" + Constants.QSKeyNames.ERROR_TYPE + "=" + (int)ErrorType.Unauthorized);
            if (!Page.IsPostBack)
            {
                EMadbatahEntities context = new EMadbatahEntities();
                List<DefaultAttendant> DefaultAttendants = context.DefaultAttendants.Select(aa => aa).OrderBy(x => x.OrderByAttendantType).Where(cc => cc.Type != (int)Model.AttendantType.UnAssigned && cc.Type != (int)Model.AttendantType.CountryPresidentFamily && cc.Status == (int)Model.AttendantStatus.Active).ToList();
                ddlPresident.DataSource = DefaultAttendants;
                ddlPresident.DataTextField = "LongName";
                ddlPresident.DataValueField = "ID";
                ddlPresident.DataBind();

                if (!string.IsNullOrEmpty(SessionID))
                {
                    Session sessionObj = SessionHelper.GetSessionByID(long.Parse(SessionID));

                    txtDate.Text = sessionObj.StartTime.Value.Date.ToString("dd/MM/yyyy"); ;
                    txtTime.Text = sessionObj.StartTime.Value.ToString("HH:mm");

                    txtSubject.Text = sessionObj.Subject.ToString();
                    //txtEParliamentID.Text = sessionObj.EParliamentID.ToString();

                    txtSeason.Text = sessionObj.Season.ToString();
                    txtStage.Text = sessionObj.Stage.ToString();
                    txtStageType.Text = sessionObj.StageType.ToString();
                    txtType.Text = sessionObj.Type.ToString();
                    ddlPresident.SelectedValue = sessionObj.PresidentID.ToString();

                    if (sessionObj.SessionStartFlag == (int)SessionOpenStatus.OnTime)
                        CBSessionStart.Checked = true;
                    else CBSessionStart.Checked = false;

                    if (SessionFileHelper.GetUnNewSessionFilesCount(long.Parse(SessionID)) > 0)
                        CBSessionStart.Enabled = false;
                    else
                        CBSessionStart.Enabled = true;
                    this.Title = "المضبطة الإلكترونية - تعديل بيانات المضبطة";
                    divPageTitle.InnerHtml = "تعديل بيانات المضبطة";


                    //int i = 1;
                    //foreach (TreeNode treeNode in TreeView1.Nodes)
                    //{
                    //    DAL.SessionItem mySessionItem = new DAL.SessionItem { Name = treeNode.Value, Order = i };
                    //    sessionObj.SessionItems.Add(mySessionItem);
                    //    i++;
                    //    foreach (TreeNode childNode in treeNode.ChildNodes)
                    //    {
                    //        int j = 1;
                    //        DAL.SessionSubItem mySessionSubItem = new DAL.SessionSubItem { Name = childNode.Value, Order = j };
                    //        mySessionItem.SessionSubItems.Add(mySessionSubItem);
                    //        j++;
                    //    }
                    //    sessionObj.SessionItems.Add(mySessionItem);
                    //}

                }
            }
        }

        protected void btnCreateNewSession_Click(object sender, EventArgs e)
        {
            if (TreeView1.Nodes.Count == 0)
            {
                lblValidateImport.Visible = true;
                return;
            }
            if (!string.IsNullOrEmpty(SessionID))
            {
                Session sessionObj = fillValues();
                SessionHelper.UpdateSessionInfo(long.Parse(SessionID), sessionObj);
                Session current_session = EditorFacade.GetSessionByID(long.Parse(SessionID));
                if (SessionFileHelper.GetUnNewSessionFilesCount(long.Parse(SessionID)) == 0)
                    AttendantHelper.GenerateSessionAttendants(long.Parse(SessionID), current_session, true);

            }
            else
            {
                Session sessionObj = fillValues();
                long SessionIDCreated = SessionHelper.CreateNewSession(sessionObj);

                if (SessionIDCreated != -1)
                    AttendantHelper.GenerateSessionAttendants(SessionIDCreated, sessionObj, false);
            }
            Response.Redirect("Default.aspx");
        }

        public Session fillValues()
        {
            DateTime plannedStartDate = DateTime.ParseExact(txtDate.Text + " " + txtTime.Text, "dd/MM/yyyy hh:mm", null);
            //DateTime plannedStartDate = Convert.ToDateTime(txtDate.Text + " " + txtTime.Text);
            string president = ddlPresident.SelectedItem.Text;
            string place = "الكويت";
            int EParliamentID = 12345;//int.Parse(txtEParliamentID.Text);
            string Season = txtSeason.Text;
            string Stage = txtStage.Text;
            string StageType = txtStageType.Text;
            string Type = txtType.Text;
            Int32 PresidentID = Int32.Parse(ddlPresident.SelectedValue);
            string subject = txtSubject.Text;
            int SessionStartFlag = CBSessionStart.Checked ? (int)SessionOpenStatus.OnTime : (int)SessionOpenStatus.NotOnTime;

            Session sessionObj = new DAL.Session();
            sessionObj.Date = DateTime.Now;
            sessionObj.StartTime = plannedStartDate;
            sessionObj.President = president;
            sessionObj.Place = place;
            sessionObj.EParliamentID = EParliamentID;

            sessionObj.Season = Season;
            sessionObj.Type = Type;
            sessionObj.Stage = Stage;
            sessionObj.StageType = StageType;
            sessionObj.Serial = EParliamentID;
            sessionObj.SessionStatusID = (int)Model.SessionStatus.New;

            sessionObj.Subject = subject;
            sessionObj.ReviewerID = CurrentUser.ID;
            sessionObj.SessionStartFlag = SessionStartFlag;
            sessionObj.PresidentID = PresidentID;

            int i = 1;
            foreach (TreeNode treeNode in TreeView1.Nodes)
            {
                DAL.SessionItem mySessionItem = new DAL.SessionItem { Name = treeNode.Value, Order = i };
                sessionObj.SessionItems.Add(mySessionItem);
                i++;
                foreach (TreeNode childNode in treeNode.ChildNodes)
                {
                    int j = 1;
                    DAL.SessionSubItem mySessionSubItem = new DAL.SessionSubItem { Name = childNode.Value, Order = j };
                    mySessionItem.SessionSubItems.Add(mySessionSubItem);
                    j++;
                }
                sessionObj.SessionItems.Add(mySessionItem);
            }


            return sessionObj;
        }

        public string ConverToToTwoDigits(string num)
        {
            if (num.Length == 1)
                return "0" + num;
            else return num;
        }

        protected void btnImportFromWord_OnClick(object sender, EventArgs e)
        {
            if (!FileUpload1.HasFile) return;
            lblValidateImport.Visible = false;
            HttpPostedFile myfile = FileUpload1.PostedFile;

            myfile.SaveAs(Server.MapPath("~/ItemFiles/" + myfile.FileName));

            IMadbataWordFileReadable wordSourceFile = new WordSourceFile();
            SessionDetails mySession = wordSourceFile.ReadMadbatatWordFile(Server.MapPath("~/ItemFiles/" + myfile.FileName));

            //lblSessionName1.Text = mySession.Name1;
            //lblSessionName2.Text = mySession.Name2;
            //lblSessionName3.Text = mySession.Name3;
            //lblSessionDate.Text = mySession.SessionDate;

            TreeView1.Nodes.Clear();
            foreach (SessionItem sessionItem in mySession.SessionItems)
            {
                TreeNode itemNode = new TreeNode(sessionItem.Name) { Value = sessionItem.Name };
                foreach (SessionSubItem sessionSubItem in sessionItem.SessionSubItems)
                {
                    string subItemName = sessionSubItem.Name.Length > 100
                        ? sessionSubItem.Name.Substring(0, 100) + " ...."
                        : sessionSubItem.Name;
                    TreeNode subItemNode = new TreeNode(sessionSubItem.Rank + "- " + subItemName) { Value = sessionSubItem.Name };
                    itemNode.ChildNodes.Add(subItemNode);
                }
                TreeView1.Nodes.Add(itemNode);
            }
            File.Delete(Server.MapPath("~/ItemFiles/" + myfile.FileName));
        }

        protected void TreeView1_OnSelectedNodeChanged(object sender, EventArgs e)
        {
            mp1.Show();
            txtName.Text = TreeView1.SelectedNode.Value;
        }

        protected void UpdateText_OnClick(object sender, EventArgs e)
        {
            TreeView1.SelectedNode.Value = txtName.Text;

            string subItemName = txtName.Text.Length > 100
                ? txtName.Text.Substring(0, 100) + " ...."
                : txtName.Text;
            TreeView1.SelectedNode.Text = subItemName;
        }

        protected void btnUpdateText_OnClick(object sender, EventArgs e)
        {
            TreeView1.SelectedNode.Value = txtName.Text;
            TreeView1.SelectedNode.Text = txtName.Text;
            mp1.Hide();
        }

    }
}