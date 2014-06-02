using FormGenerator.Models;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerDataAccess
{
    public static class ActionParametersRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"actionID","ACTION_ID"},
            {"actionParameterTypeID","ACTION_PARAMETER_TYPE_ID"},
            {"controlID","CONTROL_ID"},
        };

        public static ResponseObjectPackage<List<ActionParameterModel>> GetBySearchTemplate(RequestObjectPackage<ActionParameterSearchTemplate> request, IDbConnection connectionID)
        {
            ActionParameterSearchTemplate obj = request.requestData;
            string sql = string.Format(
                "select ID, ACTION_ID, ACTION_PARAMETER_TYPE_ID, CONTROL_ID " + Environment.NewLine +
                "from ACTION_PARAMETERS " + Environment.NewLine +
                "where {0}",
                    ToSqlWhere(obj)
            );

            List<ActionParameterModel> list = DBOrmUtils.OpenSqlList<ActionParameterModel>(sql, mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<ActionParameterModel>>() { resultData = list };
        }

        public static ResponseObjectPackage<List<ActionParameterModel>> GetByActionsList(RequestObjectPackage<List<ActionModel>> request, IDbConnection connectionID)
        {
            List<int> obj = (request.requestData ?? new List<ActionModel>()).Select(e => e.ID).ToList();
            obj.Add(-1);
            string sql = string.Format(
                "select ID, ACTION_ID, ACTION_PARAMETER_TYPE_ID, CONTROL_ID " + Environment.NewLine +
                "from ACTION_PARAMETERS " + Environment.NewLine +
                "where ACTION_ID in ({0})",
                    string.Join(", ", obj)
            );

            List<ActionParameterModel> list = DBOrmUtils.OpenSqlList<ActionParameterModel>(sql, mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<ActionParameterModel>>() { resultData = list };
        }
        public static string ToSqlWhere(ActionParameterSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.actionID, "ACTION_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.actionParameterTypeID, "ACTION_PARAMETER_TYPE_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.controlID, "CONTROL_ID");
            return where;
        }

        public static ResponsePackage Save(RequestObjectPackage<ActionParameterModel> request, IDbConnection connectionID)
        {
            return Save(request, connectionID, null);
        }
        public static ResponsePackage Save(RequestObjectPackage<ActionParameterModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            ActionParameterModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update ACTION_PARAMETERS set ACTION_ID = {0}, ACTION_PARAMETER_TYPE_ID = {1}, CONTROL_ID = {2} " + Environment.NewLine +
                    " where ID = {3} returning ID",
                    SQL.FromNumber(obj.actionID),
                    SQL.FromNumber(obj.actionParameterTypeID),
                    SQL.FromNumber(obj.controlID),
                    SQL.FromNumber(obj.ID)
                );
            }
            else
            {
                sql = string.Format(
                    " insert into ACTION_PARAMETERS (ACTION_ID, ACTION_PARAMETER_TYPE_ID, CONTROL_ID) " + Environment.NewLine +
                    " values ({0}, {1}, {2}) returning ID",
                    SQL.FromNumber(obj.actionID),
                    SQL.FromNumber(obj.actionParameterTypeID),
                    SQL.FromNumber(obj.controlID)
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true, transactionID);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }

        public static ResponsePackage Delete(RequestPackage request, IDbConnection connectionID)
        {
            return Delete(request, connectionID, null);
        }
        public static ResponsePackage Delete(RequestPackage request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            int ID = request.requestID;
            string sql = string.Format(
                "delete from ACTION_PARAMETERS" +
                "where ID = {0}",
                    ID
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
