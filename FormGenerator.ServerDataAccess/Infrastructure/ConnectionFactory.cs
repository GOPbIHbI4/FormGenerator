using FirebirdSql.Data.FirebirdClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerDataAccess
{
    public interface IConnectionFactory
    {
        IDbConnection GetConnection();
    }

    public class FireBirdConnectionFactory:IConnectionFactory
    {
        public IDbConnection GetConnection()
        {
            FbConnectionStringBuilder builder = new FbConnectionStringBuilder();
            builder.Database = @"C:\ProjectsData\FormGenerator\TEST.FDB";
            builder.DataSource = "notebook";
            builder.UserID = "SYSDBA";
            builder.Password = "masterkey";
            builder.Port = 3050;
            return new FbConnection(builder.ToString());
        }
    }
}
