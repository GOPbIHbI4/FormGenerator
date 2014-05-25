using FormGenerator.ServerDataAccess;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Server
{
    public class FormEditorBuisnessLogic
    {
        public ResponseObjectPackage<object> GetFormByID(RequestPackage package)
        {
            return new ResponseObjectPackage<object>();// new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new FormEditorServerDataAccess().GetFormByID, package);
        }
    }
}
