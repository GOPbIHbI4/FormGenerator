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
    public static class ActionKindPropertiesRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
            {"actionKindID","ACTION_KIND_ID"}
        };

        public static ResponseObjectPackage<List<ActionKindPropertyModel>> GetBySearchTemplate(RequestObjectPackage<ActionKindPropertySearchTemplate> request, IDbConnection connectionID)
        {
            ActionKindPropertySearchTemplate obj = request.requestData;
            string sql = string.Format(
                "select ID, NAME, ACTION_KIND_ID " + Environment.NewLine +
                "from ACTION_KIND_PROPERTIES " + Environment.NewLine +
                "where {0}",
                    ToSqlWhere(obj)
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<ActionKindPropertyModel> list = DBOrmUtils.OpenSqlList<ActionKindPropertyModel>(sql, mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<ActionKindPropertyModel>>() { resultData = list };
        }
        public static string ToSqlWhere(ActionKindPropertySearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromString(obj.name, "NAME");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.actionKindID, "ACTION_KIND_ID");
            return where;
        }

        public static ResponsePackage Save(RequestObjectPackage<ActionKindPropertyModel> request, IDbConnection connectionID)
        {
            return Save(request, connectionID, null);
        }
        public static ResponsePackage Save(RequestObjectPackage<ActionKindPropertyModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            ActionKindPropertyModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update ACTION_KIND_PROPERTIES set NAME = {0}, ACTION_KIND_ID = {1} " + Environment.NewLine +
                    " where ID = {2} returning ID",
                    SQL.FromString(obj.name),
                    SQL.FromNumber(obj.actionKindID),
                    SQL.FromNumber(obj.ID)
                );
            }
            else
            {
                sql = string.Format(
                    " insert into ACTION_KIND_PROPERTIES (NAME) " + Environment.NewLine +
                    " values ({0}, {1}) returning ID",
                    SQL.FromString(obj.name),
                    SQL.FromNumber(obj.actionKindID)
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
                "delete from ACTION_KIND_PROPERTIES" +
                "where ID = {0}",
                    ID
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
