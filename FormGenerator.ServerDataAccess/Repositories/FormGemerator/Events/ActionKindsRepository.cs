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
    public static class ActionKindsRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"}
        };

        public static ResponseObjectPackage<List<ActionKindModel>> GetBySearchTemplate(RequestObjectPackage<ActionKindSearchTemplate> request, IDbConnection connectionID)
        {
            ActionKindSearchTemplate obj = request.requestData;
            string sql = string.Format(
                "select ID, NAME " + Environment.NewLine +
                "from ACTION_KINDS " + Environment.NewLine +
                "where {0}",
                    ToSqlWhere(obj)
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<ActionKindModel> list = DBOrmUtils.OpenSqlList<ActionKindModel>(sql, mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<ActionKindModel>>() { resultData = list };
        }
        public static string ToSqlWhere(ActionKindSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromString(obj.name, "NAME");
            return where;
        }

        public static ResponsePackage Save(RequestObjectPackage<ActionKindModel> request, IDbConnection connectionID)
        {
            return Save(request, connectionID, null);
        }
        public static ResponsePackage Save(RequestObjectPackage<ActionKindModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            ActionKindModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update ACTION_KINDS set NAME = {0} " + Environment.NewLine +
                    " where ID = {1} returning ID",
                    SQL.FromString(obj.name),
                    SQL.FromNumber(obj.ID)
                );
            }
            else
            {
                sql = string.Format(
                    " insert into ACTION_KINDS (NAME) " + Environment.NewLine +
                    " values ({0}) returning ID",
                    SQL.FromString(obj.name)
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
                "delete from ACTION_KINDS" +
                "where ID = {0}",
                    ID
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
