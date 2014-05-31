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
    public static class ActionParameterTypesRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"actionTypeID","ACTION_TYPE_ID"},
            {"name","NAME"},
            {"domainValueTypeID","DOMAIN_VALUE_TYPE_ID"}
        };

        public static ResponseObjectPackage<List<ActionParameterTypeModel>> GetBySearchTemplate(RequestObjectPackage<ActionParameterTypeSearchTemplate> request, IDbConnection connectionID)
        {
            ActionParameterTypeSearchTemplate obj = request.requestData;
            string sql = string.Format(
                "select ID, NAME, ACTION_TYPE_ID, DOMAIN_VALUE_TYPE_ID " + Environment.NewLine +
                "from ACTION_PARAMETER_TYPES " + Environment.NewLine +
                "where {0}",
                    ToSqlWhere(obj)
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<ActionParameterTypeModel> list = DBOrmUtils.OpenSqlList<ActionParameterTypeModel>(sql, mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<ActionParameterTypeModel>>() { resultData = list };
        }
        public static string ToSqlWhere(ActionParameterTypeSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromString(obj.name, "NAME");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.actionTypeID, "ACTION_TYPE_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.domainValueTypeID, "DOMAIN_VALUE_TYPE_ID");
            return where;
        }

        public static ResponsePackage Save(RequestObjectPackage<ActionParameterTypeModel> request, IDbConnection connectionID)
        {
            return Save(request, connectionID, null);
        }
        public static ResponsePackage Save(RequestObjectPackage<ActionParameterTypeModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            ActionParameterTypeModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update ACTION_PARAMETER_TYPES set NAME = {0}, ACTION_TYPE_ID = {1}, DOMAIN_VALUE_TYPE_ID = {2} " + Environment.NewLine +
                    " where ID = {3} returning ID",
                    SQL.FromString(obj.name),
                    SQL.FromNumber(obj.actionTypeID),
                    SQL.FromNumber(obj.domainValueTypeID),
                    SQL.FromNumber(obj.ID)
                );
            }
            else
            {
                sql = string.Format(
                    " insert into ACTION_PARAMETER_TYPES (NAME, ACTION_TYPE_ID, DOMAIN_VALUE_TYPE_ID) " + Environment.NewLine +
                    " values ({0}, {1}, {2}) returning ID",
                    SQL.FromString(obj.name),
                    SQL.FromNumber(obj.actionTypeID),
                    SQL.FromNumber(obj.domainValueTypeID)
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
                "delete from ACTION_PARAMETER_TYPES" +
                "where ID = {0}",
                    ID
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
